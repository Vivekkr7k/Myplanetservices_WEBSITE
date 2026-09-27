import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });
dotenv.config();
import { streamText } from 'ai';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT = `You are the AI Studio Concierge for My Planet Services (https://myplanetservices.com), a premier SaaS, Web & AI Development Studio.

You represent an elite, agile engineering squad that designs, builds, and scales modern digital products.

Key Studio Facts:
- Leadership & Squad:
  * Vivek Kumar — Founder & CEO (Full-Stack Web/Mobile, AI Copilot Swarms, GTM Performance)
  * Mayank — Co-Founder & AI Architect (AI Reasoning Engines, SaaS Architecture)
  * Bishnu Chaudhary — Partner & Growth Architect (Web Ecosystems, Cross-Platform Mobile, DevOps, Copy Writing, SEO/AEO/GEO)
  * Om Verma — GTM Engineer & Lead Gen Specialist (Outbound Pipelines, CRM Architectures)

- 10 Core Disciplines:
  1. E-Commerce Development (Shopify Plus, Medusa.js, sub-second checkout, custom 3D configurators)
  2. Corporate Websites (High-touch editorial motion, headless CMS like Sanity/Strapi)
  3. Custom Web Applications (React 19, Next.js, Vite, TypeScript, high-concurrency dashboards)
  4. Cloud & Multi-Tenant SaaS (Stripe/Razorpay billing, role-based access, tenant isolation, Supabase/PostgreSQL)
  5. Mobile Applications (React Native cross-platform apps for iOS & Android with native feel)
  6. AI Agents & Copilots (Autonomous agent swarms, RAG knowledge retrieval, LLM integrations via Vercel AI Gateway)
  7. SEO, AEO & GEO Search Dominance (Optimized for Google, ChatGPT Search, Perplexity, Claude, Apple Intelligence)
  8. Performance Marketing & GTM (High-velocity acquisition funnels, multi-channel attribution)
  9. DevOps & Cloud Infrastructure (Docker, CI/CD, AWS, Vercel, automated deployment pipelines)
  10. Strategic Copy Writing (High-converting copy, technical documentation, B2B thought leadership)

- Notable Production Case Studies:
  * Edison Lighting (edisonlighting.in): Bangalore architectural, decorative and custom LED manufacturer's storefront with 3D studio, AR visualiser, Razorpay e-commerce, and PWA.
  * ARiqA (ariqa.in): AI & AR Virtual Try-On platform for beauty and retail with <50ms real-time sub-frame tracking.
  * Wintek Digital (wintekdigital.com): Nationwide digital signage CMS and interactive kiosk network with 1,000+ connected commercial displays.
  * Fortune India (fortune-india.co.in): B2B e-commerce platform for drone parts and carbon fiber supplies with 500+ SKUs and wholesale volume quoting.

- Pricing & Sprint Model:
  * Starter Sprint: $3,500/mo (~₹2.5L/mo) — Rapid MVP builds, focused single-discipline deliveries.
  * Growth Studio: $5,500/mo (~₹4.2L/mo) — Full multidisciplinary squad, weekly live demos, continuous iteration.
  * Scale & Enterprise: $8,000/mo (~₹6.5L/mo) — Dedicated engineering unit, high-concurrency architectures, enterprise SLA.
  * Terms: Zero lock-in, month-to-month contracts, client owns 100% of IP, GitHub repos, and cloud assets from day one.

Guidelines:
- Maintain a warm, confident, senior engineering tone. Be concise, direct, and actionable.
- Format responses cleanly with brief bullet points or bold highlights when comparing features or explaining steps.
- When relevant, encourage the visitor to book a free 20-minute discovery call with Vivek or check out the /pricing and /work pages.
- Avoid robotic corporate clichés. You are speaking on behalf of a top-tier modern software studio.`;

/**
 * Intelligent fallback generator when AI_GATEWAY_API_KEY is unset or during network errors.
 */
function getFallbackResponse(lastQuery: string): string {
  const query = lastQuery.toLowerCase();

  if (query.includes('price') || query.includes('cost') || query.includes('rate') || query.includes('pricing')) {
    return "Our studio offers transparent sprint-based pricing with zero long-term lock-in:\n\n" +
      "• **Starter Sprint**: $3,500 / month (~₹2,50,000/mo) — Ideal for fast MVPs, redesigns, and standalone modules.\n" +
      "• **Growth Studio**: $5,500 / month (~₹4,20,000/mo) — Full multidisciplinary squad with weekly demo cadence and rapid feature iteration.\n" +
      "• **Scale & Enterprise**: $8,000 / month (~₹6,50,000/mo) — High-throughput dedicated engineering for complex AI/SaaS platforms.\n\n" +
      "You own 100% of all code, Figma files, and cloud infrastructure from day one. Would you like to schedule a 20-minute scoping call with Vivek?";
  }

  if (query.includes('service') || query.includes('what do you do') || query.includes('offer') || query.includes('build')) {
    return "At **My Planet Services**, we operate as an integrated product squad covering:\n\n" +
      "1. **SaaS & Cloud Platforms** (Multi-tenant architectures, billing, role permissions)\n" +
      "2. **AI Agents & Copilots** (Autonomous workflows, RAG, reasoning models)\n" +
      "3. **Web & Mobile Apps** (React 19, Next.js, React Native for iOS/Android)\n" +
      "4. **E-Commerce Engines** (Shopify Plus, Medusa.js, sub-second checkout)\n" +
      "5. **DevOps & Cloud Infrastructure** (Docker, AWS, Vercel, CI/CD)\n" +
      "6. **AEO / GEO & Growth** (Search dominance across Google, ChatGPT, and Perplexity)\n\n" +
      "Which discipline best matches what you're planning to build?";
  }

  if (query.includes('work') || query.includes('project') || query.includes('portfolio') || query.includes('case')) {
    return "Here are live platforms recently engineered and shipped by our squad:\n\n" +
      "• **Edison Lighting** (*edisonlighting.in*): Architectural LED manufacturer storefront with 3D studio, AR visualiser, Razorpay checkout & installable PWA.\n" +
      "• **ARiqA** (*ariqa.in*): AI & AR virtual try-on engine for retail with <50ms real-time facial mesh tracking.\n" +
      "• **Wintek Digital** (*wintekdigital.com*): Centralized cloud display CMS powering 1,000+ connected commercial screens nationwide.\n" +
      "• **Fortune India** (*fortune-india.co.in*): High-speed B2B e-commerce platform for commercial drone parts with 500+ SKUs.\n\n" +
      "You can explore visual case studies on our [/work](/work) page, or tap 'Start Project' to discuss yours!";
  }

  return "Welcome to **My Planet Services**! We are an integrated studio specializing in SaaS engineering, full-stack web/mobile applications, AI copilots, and DevOps.\n\n" +
    "How can our squad help you today? You can ask about our sprint pricing, typical MVP turnaround (2–4 weeks), or book a direct 20-minute discovery call with our founder Vivek.";
}

function extractGatewayError(err: any): string {
  if (!err) return '';
  try {
    return [
      err.message || '',
      err.cause?.message || '',
      typeof err.cause?.responseBody === 'string' ? err.cause.responseBody : '',
      JSON.stringify(err.cause?.data || ''),
      err.type || '',
    ].join(' ');
  } catch {
    return String(err || '');
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { messages } = req.body as { messages?: ChatMessage[] };
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required' });
    return;
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY;
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';

  // Setup streaming headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  // If no API key is configured yet, stream the local intelligent knowledge response
  if (!apiKey) {
    const fallbackText = getFallbackResponse(lastUserMessage);
    const words = fallbackText.split(' ');
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? '' : ' ') + words[i];
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      await new Promise((r) => setTimeout(r, 20));
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
    return;
  }

  try {
    const formattedMessages = messages.map((m) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    }));

    const result = streamText({
      model: 'openai/gpt-5.6-sol',
      system: SYSTEM_PROMPT,
      messages: formattedMessages,
    });

    let chunkCount = 0;
    for await (const textPart of result.textStream) {
      chunkCount++;
      res.write(`data: ${JSON.stringify({ text: textPart })}\n\n`);
    }

    if (chunkCount === 0) {
      throw new Error('NO_STREAM_OUTPUT');
    }

    const usage = await result.usage.catch(() => null);
    res.write(`data: ${JSON.stringify({ done: true, usage })}\n\n`);
    res.end();
  } catch (err: any) {
    console.error('[AI Gateway Error]:', err?.message || err);
    const rawError = extractGatewayError(err);
    const isCreditCardRequired =
      rawError.includes('credit card') ||
      rawError.includes('customer_verification_required') ||
      err?.message === 'NO_STREAM_OUTPUT';

    let responseText = '';
    if (isCreditCardRequired) {
      responseText =
        "⚠️ **Vercel AI Gateway Billing Verification Required**:\n\n" +
        "Your API key (`AI_GATEWAY_API_KEY`) is active and connected, but Vercel requires a valid payment method on file to unlock requests for `openai/gpt-5.6-sol`.\n\n" +
        "👉 **To unlock live AI streaming**, visit your [Vercel Billing Settings](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%3Fmodal%3Dadd-credit-card) to add a card.\n\n" +
        "---\n\n" +
        getFallbackResponse(lastUserMessage);
    } else {
      responseText = getFallbackResponse(lastUserMessage);
    }

    const words = responseText.split(' ');
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? '' : ' ') + words[i];
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      await new Promise((r) => setTimeout(r, 15));
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  }
}
