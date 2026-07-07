import { getGeminiResponse } from '../lib/gemini';

describe('AI Citizen Assistant Service (Gemini Fallback)', () => {
  it('should return simulated response for passport questions', async () => {
    const response = await getGeminiResponse('What documents do I need for a passport?');
    expect(response).toContain('Passport');
    expect(response).toContain('Proof of Address');
  });

  it('should return simulated response for solar subsidies', async () => {
    const response = await getGeminiResponse('How can I get solar panel subsidy?');
    expect(response).toContain('Solar Panel Subsidy');
    expect(response).toContain('cashback');
  });

  it('should return simulated default response for general questions', async () => {
    const response = await getGeminiResponse('Tell me something general');
    expect(response).toContain('CivicAI');
  });
});
