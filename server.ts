import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. AI features will fallback to smart rule-based processing.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Route: Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'DZA Connect', time: new Date().toISOString() });
});

// API Route: Refine Post or translate Algerian Darija to formal/commercial Arabic
app.post('/api/gemini/refine-post', async (req, res) => {
  try {
    const { text, style, wilaya, targetAudience } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      // Graceful fallback if no API key
      let refined = text;
      if (style === 'formal') {
        refined = `منشور مجتمعي: ${text} - يرجى التفاعل والمشاركة من سكان المنطقة.`;
      } else if (style === 'market') {
        refined = `✨ إعلان تجاري مميز: ${text} - السعر قابل للتفاوض، التواصل عبر الرسائل أو الواتساب.`;
      }
      return res.json({
        original: text,
        refinedText: refined,
        suggestedHashtags: ['#الجزائر', `#${wilaya || 'منطقتي'}`, '#ديزاد_كونكت'],
        detectedSentiment: 'إيجابي',
      });
    }

    const systemPrompt = `أنت المساعد الذكي لشبكة التواصل الاجتماعي الجزائرية "ديزاد كونكت (DZA Connect)".
مهمتك هي أخذ النص المكتوب باللهجة الدارجة الجزائرية أو العربية البسيطة وإعادة صياغته حسب النمط المطلوب:
1. "formal": تحويله إلى لغة عربية فصحى راقية ومفهومة وواضحة مع الحفاظ على روح الفكرة.
2. "market": تحويله إلى إعلان تجاري تسويقي جذاب واحترافي لبيعه في السوق الجزائري بالدينار، مع إبراز المميزات وعبارات الشراء.
3. "community": صياغته كقضية مجتمعية أو نقاش بناء موجه لسكان ولاية ${wilaya || 'الجزائر'} لجذب تفاعل واستطلاع رأي.
4. "darija_polished": الحفاظ على الدارجة الجزائرية المهذبة الممتعة والقريبة من القلب بدون أخطاء إملائية.

أرجع النتيجة بصيغة JSON حصراً بالشكل التالي:
{
  "refinedText": "النص المعدل هنا",
  "summary": "ملخص فكرة المنشور بسطر واحد",
  "suggestedHashtags": ["هاشتاغ1", "هاشتاغ2", "هاشتاغ3"],
  "detectedSentiment": "إيجابي / مجتمعي / تجاري / استفسار"
}`;

    const prompt = `النمط المطلوب: ${style || 'formal'}
الولاية: ${wilaya || 'الجزائر'}
الجمهور المستهدف: ${targetAudience || 'عام'}
النص الأصلي من المستخدم:
"""${text}"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      parsed = {
        refinedText: outputText,
        suggestedHashtags: ['#الجزائر', '#ديزاد_كونكت'],
        detectedSentiment: 'عام',
      };
    }

    res.json({
      original: text,
      ...parsed,
    });
  } catch (error: any) {
    console.error('Error in refine-post:', error);
    res.status(500).json({ error: error.message || 'Failed to process AI text' });
  }
});

// API Route: Generate rich Marketplace listing description
app.post('/api/gemini/generate-ad', async (req, res) => {
  try {
    const { itemTitle, category, priceDZD, wilaya, condition, details } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        title: itemTitle || 'منتج للبيع',
        formattedPrice: `${priceDZD || 0} دج (قابل للتفاوض)`,
        description: `للبيع: ${itemTitle} في ولاية ${wilaya}. الحالة: ${condition}. ${details || ''}\nالتوصيل متوفر في 58 ولاية أو الاستلام يداً بيد.`,
        keyHighlights: ['حالة ممتازة', 'توصيل متاح', 'سعر تنافسي'],
        safetyTips: 'يُفضل فحص السلعة قبل الدفع واختيار أماكن عامة للتسليم.',
      });
    }

    const systemPrompt = `أنت خبير التسويق والإعلانات في السوق الجزائري لشبكة ديزاد كونكت.
قم بإنشاء إعلان تجاري احترافي ودقيق لمنتج أو خدمة معروضة للبيع بالدينار الجزائري (DZD).
الإعلان يجب أن يكون واضحاً ومقنعاً ويراعي تقاليد وسلوك المشتري الجزائري (التوصيل 58 ولاية، الدفع عند الاستلام، المعاينة).

أرجع النتيجة بصيغة JSON حصراً بالشكل التالي:
{
  "title": "عنوان جذاب للإعلان",
  "formattedPrice": "السعر منسق بالدينار الجزائري مع كلمة دج",
  "description": "الوصف التفصيلي الجذاب للمنتج",
  "keyHighlights": ["ميزة 1", "ميزة 2", "ميزة 3", "ميزة 4"],
  "suggestedTags": ["وسم1", "وسم2", "وسم3"],
  "safetyTips": "نصيحة أمان مختصرة للتعامل بين البائع والمشتري"
}`;

    const prompt = `السلعة: ${itemTitle}
القسم: ${category}
السعر: ${priceDZD} دج
الولاية: ${wilaya}
الحالة: ${condition}
تفاصيل إضافية من البائع: ${details || 'لا توجد تفاصيل إضافية'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      parsed = {
        title: itemTitle,
        description: outputText,
        keyHighlights: ['معاينة متاحة', 'سعر مناسب'],
        safetyTips: 'تأكد من فحص المنتج قبل إتمام الشراء.',
      };
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('Error in generate-ad:', error);
    res.status(500).json({ error: error.message || 'Failed to generate ad' });
  }
});

// API Route: AI Social & Community Assistant (مساعد ديزاد)
app.post('/api/gemini/assistant-chat', async (req, res) => {
  try {
    const { message, wilaya, userRole } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        reply: `أهلاً بك في شبكة ديزاد كونكت! أنا مساعدك الذكي لمساعدتك في التواصل ونشر المحتوى واستكشاف الفرص في ولايتك (${wilaya || 'الجزائر'}). يمكنك سؤالي عن صياغة المنشورات، قوانين المجتمع، أو معلومات الخدمات المحلية.`,
        suggestions: ['كيف أصيغ إعلان بيع سيارة؟', 'أفكار لموضوع نقاش محلي في ولايتي', 'ما هي أفضل المجموعات للانضمام إليها؟'],
      });
    }

    const systemPrompt = `أنت "مساعد ديزاد الذكي" (DZA Assistant)، المساعد الرسمي لشبكة التواصل الاجتماعي الجزائرية "DZA Connect".
شخصيتك: ودود، لبق، مثقف بالثقافة الجزائرية واللهجات والتقاليد والولايات الـ58، خبير بالتجارة المحلية، والأنشطة الشبابية.
أنت تساعد المستخدمين في:
- صياغة المنشورات والاستطلاعات الهادفة.
- معرفة الخدمات والمشاريع في ولايتهم (${wilaya || 'الجزائر'}).
- تقديم نصائح لرواد الأعمال والتجار وأصحاب المهن (مثل خدمات التاكسي، الحرفيين، المتاجر).
- توضيح الإجراءات والنصائح المجتمعية العامة بأسلوب جزائري محترم وراقي.

أرجع النتيجة بصيغة JSON حصراً بالشكل:
{
  "reply": "الرد الشافي والواضح بالعربية الفصحى المطعمة بلمسات جزائرية راقية",
  "suggestions": ["سؤال مقترح 1", "سؤال مقترح 2", "سؤال مقترح 3"]
}`;

    const prompt = `المستخدم من ولاية: ${wilaya || 'الجزائر'}
رسالة المستخدم: """${message}"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      parsed = {
        reply: outputText,
        suggestions: ['أخبرني المزيد', 'كيف أنشر في صوت المجتمع؟', 'اقترح فكرة منشور'],
      };
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('Error in assistant-chat:', error);
    res.status(500).json({ error: error.message || 'Failed to get assistant response' });
  }
});

// API Route: Analyze Community Poll / Debate Insights
app.post('/api/gemini/community-insights', async (req, res) => {
  try {
    const { pollQuestion, options, wilaya, commentsSummary } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        summary: `قضية مجتمعية هامة في ولاية ${wilaya || 'الجزائر'}: ${pollQuestion}. نسبة التصويت تعكس اهتماماً كبيراً من المواطنين بتحسين المرافق المحلية.`,
        recommendation: 'يُنصح برفع مخرجات هذا الاستطلاع إلى ممثلي المجتمع المدني والبلدية لتعزيز النقاش.',
      });
    }

    const prompt = `تحليل استطلاع رأي "صوت المجتمع" في ولاية: ${wilaya}
السؤال: ${pollQuestion}
الخيارات والنتائج: ${JSON.stringify(options)}
مقتطفات من تعليقات المواطنين: ${commentsSummary || 'لا توجد تعليقات إضافية'}

قدم تحليلاً موجزاً ومحايداً يعكس رأي الأغلبية وتوصيات لخدمة المجتمع المحلي. أرجع JSON:
{
  "summary": "ملخص التحليل المجتمعي في فقرة دقيقة",
  "keyConsensus": "نقطة الإجماع الرئيسية بين سكان المنطقة",
  "recommendation": "توصية عملية قابلة للتنفيذ لخدمة الحي أو الولاية"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to analyze poll' });
  }
});

// Vite & Static file handler
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DZA Connect server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
