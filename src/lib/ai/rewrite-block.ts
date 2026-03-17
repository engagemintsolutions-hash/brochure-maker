import { getAnthropicClient, CLAUDE_MODEL } from '@/lib/anthropic';
import { REWRITE_SYSTEM } from './prompts';

export async function rewriteBlock(
  currentText: string,
  instruction: string,
): Promise<string> {
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: REWRITE_SYSTEM,
    messages: [
      {
        role: 'user',
        content: `Current text:\n"${currentText}"\n\nInstruction: ${instruction}`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return text.trim();
}
