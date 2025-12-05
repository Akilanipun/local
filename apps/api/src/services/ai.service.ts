import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export interface ModerationResult {
    approved: boolean;
    flagged: boolean;
    reason?: string;
    confidence: number;
}

export class AIService {
    private model;

    constructor() {
        this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async moderateContent(content: string, language: 'en' | 'si' | 'ta' = 'en'): Promise<ModerationResult> {
        try {
            const prompt = `
You are a content moderator for a hyper-local news platform in Sri Lanka. 
Analyze the following ${language === 'en' ? 'English' : language === 'si' ? 'Sinhala' : 'Tamil'} text for:
1. Misinformation or factual inaccuracies
2. Hate speech or policy violations
3. Relevance to local community news

Content: "${content}"

Respond in JSON format:
{
  "approved": true/false,
  "flagged": true/false,
  "reason": "explanation if not approved or flagged",
  "confidence": 0.0-1.0
}
`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            // Fallback
            return {
                approved: true,
                flagged: false,
                confidence: 0.5,
            };
        } catch (error) {
            console.error('AI Moderation error:', error);
            // Fail-safe: flag for manual review
            return {
                approved: false,
                flagged: true,
                reason: 'AI service error - requires manual review',
                confidence: 0,
            };
        }
    }

    async summarizeNews(content: string, language: 'en' | 'si' | 'ta' = 'en'): Promise<string> {
        try {
            const prompt = `
Summarize the following news article in ${language === 'en' ? 'English' : language === 'si' ? 'Sinhala' : 'Tamil'} in exactly 3 concise sentences:

"${content}"

Provide only the summary, no additional text.
`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('AI Summarization error:', error);
            return content.substring(0, 200) + '...';
        }
    }

    async generateLocalImpact(globalNews: string, location: string): Promise<string> {
        try {
            const prompt = `
Given this global/national news: "${globalNews}"
And this location: "${location}"

Generate a brief 1-sentence statement about how this might impact the local community.
`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('AI Local Impact error:', error);
            return 'Impact on local community to be determined.';
        }
    }
}

export const aiService = new AIService();
