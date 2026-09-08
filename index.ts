import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import { streamText } from 'ai';

async function main() {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ AI_GATEWAY_API_KEY is not set in .env.local.');
    console.warn('Please add your Vercel AI Gateway key to .env.local to stream live text from openai/gpt-5.6-sol.\n');
  }

  console.log('🚀 Initiating text stream via Vercel AI Gateway with model: openai/gpt-5.6-sol...');

  try {
    const result = streamText({
      model: 'openai/gpt-5.6-sol',
      prompt: 'Introduce My Planet Services in 2 concise sentences, focusing on engineering MVPs, AI solutions, and full-stack platforms.',
    });

    console.log('\n--- Streaming Response ---');
    for await (const textPart of result.textStream) {
      process.stdout.write(textPart);
    }

    const usage = await result.usage;
    console.log('\n\n--- Token Usage ---');
    console.log(JSON.stringify(usage, null, 2));
    console.log('\n✅ Stream completed successfully.');
  } catch (err) {
    console.error('\n❌ Streaming error:', (err as Error).message);
    if (!apiKey) {
      console.log('💡 Note: Set your AI_GATEWAY_API_KEY in .env.local to authenticate with Vercel AI Gateway.');
    }
  }
}

main();
