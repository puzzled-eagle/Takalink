import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Support large image payloads for photo classification
app.use(express.json({ limit: '20mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback rule-based classifier for waste when Gemini is unavailable or rate-limited
function getRuleBasedClassification(text: string = '') {
  const lower = text.toLowerCase();
  if (lower.includes('pet') || lower.includes('bottle') || lower.includes('plastic') || lower.includes('jerrycan') || lower.includes('hdpe')) {
    return {
      categoryName: 'Plastics',
      subcategory: lower.includes('jerrycan') ? 'HDPE Containers & Jerrycans' : 'PET Bottles (Clear/Blue)',
      suggestedTitle: lower.includes('jerrycan') ? 'Clean HDPE Jerrycans & Containers' : 'Clean Baled Clear PET Bottles',
      condition: 'sorted_clean',
      contaminationAssessment: 'Standard post-consumer plastics. Check for caps, label rings, and liquid residue.',
      recommendedUnit: 'kg',
      estimatedPriceMinKES: 22,
      estimatedPriceMaxKES: 34,
      handlingSafetyNotes: 'Ensure containers are completely drained. Avoid pesticide or hazardous industrial chemical containers.',
      isPotentiallyHazardous: false,
      confidenceScore: 0.85,
      source: 'expert_rule_fallback',
    };
  }
  if (lower.includes('box') || lower.includes('cardboard') || lower.includes('carton') || lower.includes('paper')) {
    return {
      categoryName: 'Paper & Cardboard',
      subcategory: 'Corrugated Cardboard (OCC)',
      suggestedTitle: 'Compressed Corrugated Cardboard Cartons',
      condition: 'sorted_clean',
      contaminationAssessment: 'Keep strictly dry. Ensure no food contact oils or wet waste.',
      recommendedUnit: 'kg',
      estimatedPriceMinKES: 11,
      estimatedPriceMaxKES: 16,
      handlingSafetyNotes: 'Store in dry sheltered area. Bundle with sisal or nylon twine.',
      isPotentiallyHazardous: false,
      confidenceScore: 0.88,
      source: 'expert_rule_fallback',
    };
  }
  if (lower.includes('can') || lower.includes('aluminium') || lower.includes('copper') || lower.includes('scrap') || lower.includes('metal')) {
    return {
      categoryName: 'Metals & Scrap',
      subcategory: lower.includes('copper') ? 'Stripped Copper Wire' : 'Aluminium Beverage Cans (UBC)',
      suggestedTitle: lower.includes('copper') ? 'High Purity Stripped Copper Scrap' : 'Crushed Aluminium Beverage Cans',
      condition: 'sorted_clean',
      contaminationAssessment: 'Verify non-ferrous purity using magnet test. Ensure no steel inclusions.',
      recommendedUnit: 'kg',
      estimatedPriceMinKES: 135,
      estimatedPriceMaxKES: 160,
      handlingSafetyNotes: 'Wear cut-resistant safety gloves when handling sheared scrap edges.',
      isPotentiallyHazardous: false,
      confidenceScore: 0.9,
      source: 'expert_rule_fallback',
    };
  }
  if (lower.includes('oil') || lower.includes('cooking') || lower.includes('fryer')) {
    return {
      categoryName: 'Used Cooking Oil (UCO)',
      subcategory: 'Filtered Restaurant Fryer Oil',
      suggestedTitle: 'Filtered Commercial Kitchen Used Cooking Oil',
      condition: 'sorted_clean',
      contaminationAssessment: 'Mesh filter to remove burnt food crumbs. Water content must be <2%.',
      recommendedUnit: 'litres',
      estimatedPriceMinKES: 48,
      estimatedPriceMaxKES: 65,
      handlingSafetyNotes: 'Store in leakproof 20L jerrycans with tight bungs away from direct sunlight.',
      isPotentiallyHazardous: false,
      confidenceScore: 0.92,
      source: 'expert_rule_fallback',
    };
  }

  // Default general classification
  return {
    categoryName: 'Plastics',
    subcategory: 'Mixed Recyclables',
    suggestedTitle: 'Post-Consumer Recyclable Materials',
    condition: 'mixed_recyclable',
    contaminationAssessment: 'Review for segregation of wet waste and hazardous materials.',
    recommendedUnit: 'kg',
    estimatedPriceMinKES: 15,
    estimatedPriceMaxKES: 30,
    handlingSafetyNotes: 'Segregate by polymer or material type before transport to maximize buyer value.',
    isPotentiallyHazardous: false,
    confidenceScore: 0.75,
    source: 'expert_rule_fallback',
  };
}

// 1. Photo & Description Waste Classification
app.post('/api/ai/classify-waste', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', descriptionText = '' } = req.body;

    if (!aiClient) {
      const fallback = getRuleBasedClassification(descriptionText);
      return res.json(fallback);
    }

    const systemInstruction = `You are the lead circular economy and materials scientist for TakaLink Kenya, operating in Eldoret, Kenya.
Analyze waste materials from photographs or descriptions to classify them for recovery, recycling, and marketplace trading.
Valid categories are: 'Plastics', 'Paper & Cardboard', 'Metals & Scrap', 'Glass Cullet & Bottles', 'Electronic Waste (E-Waste)', 'Organic & Biomass', 'Used Cooking Oil (UCO)', 'Textiles & Garment Offcuts'.
Conditions: 'sorted_clean', 'mixed_recyclable', 'needs_cleaning', 'raw_industrial'.
Units: 'kg', 'tonnes', 'pieces', 'litres'.
Prices in Kenyan Shillings (KES) must reflect realistic market rates in Eldoret, Kenya.
Flag hazardous waste (like mercury, CRT glass, lead acid batteries, toxic industrial sludge) with isPotentiallyHazardous: true.
Output MUST be strict JSON only.`;

    const prompt = `Classify this waste material:
User Description: "${descriptionText}"
Provide structured output with:
- categoryName
- subcategory
- suggestedTitle
- condition
- contaminationAssessment
- recommendedUnit
- estimatedPriceMinKES
- estimatedPriceMaxKES
- handlingSafetyNotes
- isPotentiallyHazardous
- confidenceScore (0.0 to 1.0)`;

    let parts: any[] = [];
    if (imageBase64) {
      // Strip data url prefix if present
      const cleanBase64 = imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }
    parts.push({ text: prompt });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    const parsed = JSON.parse(rawText);

    return res.json({
      categoryName: parsed.categoryName || 'Plastics',
      subcategory: parsed.subcategory || 'Mixed Recyclables',
      suggestedTitle: parsed.suggestedTitle || 'Sorted Recyclable Waste',
      condition: parsed.condition || 'sorted_clean',
      contaminationAssessment: parsed.contaminationAssessment || 'Visual check required for contamination.',
      recommendedUnit: parsed.recommendedUnit || 'kg',
      estimatedPriceMinKES: Number(parsed.estimatedPriceMinKES) || 20,
      estimatedPriceMaxKES: Number(parsed.estimatedPriceMaxKES) || 35,
      handlingSafetyNotes: parsed.handlingSafetyNotes || 'Wear protective PPE when handling bulk waste.',
      isPotentiallyHazardous: Boolean(parsed.isPotentiallyHazardous),
      confidenceScore: Math.min(1, Math.max(0, Number(parsed.confidenceScore) || 0.88)),
      source: 'gemini-3.8-flash',
    });
  } catch (error) {
    console.error('Classification error:', error);
    const fallback = getRuleBasedClassification(req.body.descriptionText);
    return res.json(fallback);
  }
});

// 2. Intelligent Marketplace Matching
app.post('/api/ai/match-recommendations', async (req: Request, res: Response) => {
  try {
    const { listing, buyerRequests = [] } = req.body;

    if (!listing) {
      return res.status(400).json({ error: 'Listing required' });
    }

    if (!aiClient) {
      // Rule-based fallback
      const compatibleRequests = buyerRequests.filter(
        (b: any) =>
          b.categoryName?.toLowerCase() === listing.categoryName?.toLowerCase() ||
          b.categoryId === listing.categoryId
      );

      return res.json({
        topMatches: compatibleRequests.map((b: any) => ({
          buyerRequestId: b.id,
          buyerName: b.buyerName,
          targetMaterial: b.subcategory || b.categoryName,
          matchConfidence: 0.92,
          reason: `High compatibility: Both operate in ${listing.approximateLocation?.town || 'Eldoret'}. Listing supplies ${listing.quantity} ${listing.unit} toward buyer's ${b.targetQuantity} ${b.unit} target.`,
        })),
        aiSummary: `Found ${compatibleRequests.length} compatible buyers in the Eldoret circular economy zone matching category ${listing.categoryName}.`,
        source: 'rule_fallback',
      });
    }

    const prompt = `Given this active waste listing in Eldoret, Kenya:
${JSON.stringify(listing, null, 2)}

And these active buyer bulk procurement requests:
${JSON.stringify(buyerRequests, null, 2)}

Analyze compatibility based on:
1. Material category and subcategory grade
2. Location proximity in Eldoret / Uasin Gishu
3. Quantity feasibility
4. Price compatibility in KES

Return a JSON object:
{
  "topMatches": [
    {
      "buyerRequestId": "id",
      "buyerName": "name",
      "targetMaterial": "name",
      "matchConfidence": 0.85,
      "reason": "Clear 2-sentence explanation of why this match is viable"
    }
  ],
  "aiSummary": "Summary of marketplace liquidity for this item in Eldoret"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ ...parsed, source: 'gemini-3.8-flash' });
  } catch (error) {
    console.error('Matching error:', error);
    return res.json({
      topMatches: [],
      aiSummary: 'Rule-based matching active. Compatible buyers listed in marketplace dashboard.',
      source: 'rule_fallback',
    });
  }
});

// 3. Indicative Price Guidance
app.post('/api/ai/price-guidance', async (req: Request, res: Response) => {
  try {
    const { category, subcategory, condition, quantity, unit } = req.body;

    const EldoretBenchmarks: Record<string, { min: number; max: number; unit: string }> = {
      plastics: { min: 22, max: 35, unit: 'KES/kg' },
      paper: { min: 11, max: 17, unit: 'KES/kg' },
      metals: { min: 130, max: 550, unit: 'KES/kg' },
      glass: { min: 5, max: 12, unit: 'KES/kg' },
      oil: { min: 48, max: 68, unit: 'KES/litre' },
      organics: { min: 2800, max: 4800, unit: 'KES/tonne' },
    };

    const benchmark =
      EldoretBenchmarks[category?.toLowerCase()] ||
      EldoretBenchmarks.plastics;

    let conditionMultiplier = 1.0;
    if (condition === 'sorted_clean') conditionMultiplier = 1.1;
    if (condition === 'needs_cleaning') conditionMultiplier = 0.85;
    if (condition === 'raw_industrial') conditionMultiplier = 0.95;

    const recommendedMin = Math.round(benchmark.min * conditionMultiplier);
    const recommendedMax = Math.round(benchmark.max * conditionMultiplier);

    return res.json({
      category,
      subcategory: subcategory || 'Standard Grade',
      condition,
      priceRange: {
        min: recommendedMin,
        max: recommendedMax,
        unit: benchmark.unit,
      },
      currency: 'KES',
      marketContext: `Indicative Eldoret scrap and recycling transaction range for ${condition?.replace('_', ' ') || 'standard'} grade as of Q4 2026.`,
      disclaimer: 'Indicative guidance only based on recent transaction medians. Final prices are negotiated directly between supplier and buyer.',
      sufficientData: true,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Price guidance error:', error);
    return res.status(500).json({ error: 'Failed to generate price guidance' });
  }
});

// 4. Conversational Circular Economy Assistant
app.post('/api/ai/assistant', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [], userRole = 'supplier' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    if (!aiClient) {
      return res.json({
        reply: `Hello! I am your TakaLink Circular Economy Advisor for Eldoret. You are currently browsing as a ${userRole}. I can guide you on sorting materials (like separating PET from PVC), pricing guidelines in KES, finding bulk aggregation groups, or booking certified NEMA transporters. How can I assist with your waste listing or procurement today?`,
        source: 'rule_fallback',
      });
    }

    const systemInstruction = `You are TakaLink's AI Circular Economy Specialist based in Eldoret, Kenya.
TakaLink's mission is "Turning waste into value" by connecting waste suppliers, recyclable-material buyers, and licensed transporters.
Knowledge points:
- Eldoret waste hubs: West Indies, Huruma, Langas, Pioneer, Kapsoya, Eldoret CBD Market, Industrial Area.
- Regulatory compliance: NEMA (National Environment Management Authority) waste transportation permits, hazardous e-waste regulations, and Kenya's Sustainable Waste Management Act 2022.
- Practical recycling tips: Keep cardboard dry (wet cardboard rots and loses tensile strength for re-pulping); de-cap and crush PET bottles; test aluminium cans with magnets; verify restaurant cooking oil has low water content.
- Currency: Kenyan Shillings (KES).
- Role context: The user is currently logged in as a ${userRole}.
Be practical, concise, encouraging, and helpful. Never fabricate transactions, fake buyers, or legal certifications.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      reply: response.text || 'TakaLink is ready to assist your recycling workflow.',
      source: 'gemini-3.8-flash',
    });
  } catch (error) {
    console.error('Assistant error:', error);
    return res.json({
      reply: 'TakaLink Assistant is currently in offline mode. You can still list materials, submit offers, and request transport directly through the platform tabs.',
      source: 'rule_fallback',
    });
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiEnabled: Boolean(apiKey),
    launchArea: 'Eldoret, Kenya',
  });
});

// Start server
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TakaLink] Server listening on http://0.0.0.0:${PORT}`);
    console.log(`[TakaLink] Gemini AI: ${apiKey ? 'Configured & Active' : 'Fallback Mode (Rule-based)'}`);
  });
}

startServer().catch((err) => {
  console.error('[TakaLink] Failed to start server:', err);
  process.exit(1);
});
