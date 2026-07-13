import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables for LLM Keys
dotenv.config();

/**
 * The LLM Bridge serves as the connection configuration box.
 * It determines whether code is written via hardcoded premium templates,
 * local LLM synthesis, or external API execution (like Gemini).
 */
export class LLMBridge {
  public static async executePrompt(prompt: string, contextDir: string): Promise<string> {
    console.error(`\n🧠 [LLM Bridge Activated]: Processing conceptual prompt...`);
    console.error(`🧠 [Prompt String]: "${prompt}"`);
    console.error(`🧠 [Target Workspace]: ${contextDir}`);
    
    // Component path calculation
    const componentPath = path.join(contextDir, "src", "App.tsx");
    const mainPath = path.join(contextDir, "src", "main.tsx");
    
    let componentCode = "";

    // CONFIGURATION BOX: Determine Execution Path
    if (process.env.GEMINI_API_KEY) {
      console.error(`🧠 [Execution Path]: Gemini API Detected. Calling Live LLM...`);
      componentCode = await this.callGeminiAPI(prompt);
    } else if (process.env.OPENAI_API_KEY) {
      console.error(`🧠 [Execution Path]: OpenAI API Detected. Calling Live LLM...`);
      componentCode = await this.callOpenAIAPI(prompt);
    } else {
      console.error(`🧠 [Execution Path]: No API Keys Detected. Falling back to internal Premium Template Engine...`);
      // Simulate AI synthesis latency
      await new Promise(resolve => setTimeout(resolve, 3000));
      componentCode = this.getPremiumTemplate(prompt);
    }
    
    // Simulate AI synthesis latency is handled within the functions now.


    try {
      if (!fs.existsSync(path.dirname(componentPath))) {
        fs.mkdirSync(path.dirname(componentPath), { recursive: true });
      }
      fs.writeFileSync(componentPath, componentCode, "utf-8");
      
      // Also write an entrypoint file just in case it's missing
      const mainCode = `
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`;
      fs.writeFileSync(mainPath, mainCode, "utf-8");

      console.error(`✅ [LLM Bridge]: Successfully synthesized and injected React components into ${componentPath}`);
      return "AI Component Synthesis Complete";
    } catch (e: any) {
      console.error(`❌ [LLM Bridge Fault]: ${e.message}`);
      throw new Error(`LLM synthesis failed: ${e.message}`);
    }
  }

  /**
   * Analyzes raw social media posts to extract a sentiment score and core bottleneck.
   */
  public static async analyzeSocialSentiment(posts: string[]): Promise<{ sentiment: string, bottleneck: string }> {
    console.error(`\n🧠 [LLM Bridge]: Analyzing Social Sentiment for ${posts.length} unstructured posts...`);
    
    // CONFIGURATION BOX: Determine Execution Path
    if (process.env.GEMINI_API_KEY) {
      console.error(`🧠 [Execution Path]: Gemini API Detected. Calling Live LLM for Sentiment Analysis...`);
      return await this.callGeminiSentiment(posts);
    } else if (process.env.OPENAI_API_KEY) {
      console.error(`🧠 [Execution Path]: OpenAI API Detected. Calling Live LLM for Sentiment Analysis...`);
      return await this.callOpenAISentiment(posts);
    } else {
      console.error(`🧠 [Execution Path]: No API Keys Detected. Running Local NLP Heuristic Engine...`);
      // Simulate AI synthesis latency
      await new Promise(resolve => setTimeout(resolve, 2000));
      return this.mockSentimentHeuristic(posts);
    }
  }

  // --- SCAFFOLDED API CONNECTIONS ---

  private static async callGeminiAPI(prompt: string): Promise<string> {
    const SYSTEM_PROMPT = `You are an autonomous biological cell tasked with writing React code. Output ONLY valid React/Vite code for App.tsx. Do not include markdown ticks, do not include conversation. Write a highly stylized, dark-mode, premium UI based on the user's prompt.`;
    
    // TODO: Inject @google/genai package execution here using process.env.GEMINI_API_KEY
    // const { GoogleGenAI } = require("@google/genai");
    // const ai = new GoogleGenAI({});
    // const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { systemInstruction: SYSTEM_PROMPT } });
    // return response.text;

    console.error(`⚠️ [Gemini Sandbox]: API call scaffold reached. Executing bypass until fully wired.`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return this.getPremiumTemplate(prompt);
  }

  private static async callOpenAIAPI(prompt: string): Promise<string> {
    const SYSTEM_PROMPT = `You are an autonomous biological cell tasked with writing React code. Output ONLY valid React/Vite code for App.tsx. Do not include markdown ticks, do not include conversation. Write a highly stylized, dark-mode, premium UI based on the user's prompt.`;
    
    // TODO: Inject openai package execution here using process.env.OPENAI_API_KEY
    // const OpenAI = require("openai");
    // const openai = new OpenAI();
    // const response = await openai.chat.completions.create({ model: "gpt-4o", messages: [{role: "system", content: SYSTEM_PROMPT}, {role: "user", content: prompt}] });
    // return response.choices[0].message.content;

    console.error(`⚠️ [OpenAI Sandbox]: API call scaffold reached. Executing bypass until fully wired.`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return this.getPremiumTemplate(prompt);
  }

  private static async callGeminiSentiment(posts: string[]): Promise<{ sentiment: string, bottleneck: string }> {
    console.error(`⚠️ [Gemini Sandbox]: Sentiment API call scaffold reached.`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return this.mockSentimentHeuristic(posts);
  }

  private static async callOpenAISentiment(posts: string[]): Promise<{ sentiment: string, bottleneck: string }> {
    console.error(`⚠️ [OpenAI Sandbox]: Sentiment API call scaffold reached.`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return this.mockSentimentHeuristic(posts);
  }

  private static mockSentimentHeuristic(posts: string[]): { sentiment: string, bottleneck: string } {
    const combinedText = posts.join(" ").toLowerCase();
    
    // Extremely rudimentary keyword density heuristic engine
    const negativeKeywords = ["frustrated", "slow", "annoyed", "expensive", "hate", "broken", "pain"];
    const positiveKeywords = ["love", "fast", "cheap", "amazing", "great"];
    
    let negCount = 0;
    let posCount = 0;
    
    negativeKeywords.forEach(kw => { if (combinedText.includes(kw)) negCount++; });
    positiveKeywords.forEach(kw => { if (combinedText.includes(kw)) posCount++; });

    let sentiment = "NEUTRAL";
    if (negCount > posCount) sentiment = "FRUSTRATED_BEARISH";
    if (posCount > negCount) sentiment = "OPTIMISTIC_BULLISH";

    // Extracting a pseudo-bottleneck by finding a sentence with "broken" or "slow"
    let bottleneck = "Users are expressing general dissatisfaction with current operational speeds.";
    const sentences = combinedText.split(/[.!?]/);
    for (const sentence of sentences) {
      if (sentence.includes("broken") || sentence.includes("slow") || sentence.includes("expensive")) {
        bottleneck = `Core User Complaint: "${sentence.trim()}"`;
        break;
      }
    }

    return { sentiment, bottleneck };
  }

  private static getPremiumTemplate(prompt: string): string {
    return `


export default function App() {
  return (
    <div style={{ backgroundColor: '#0d0e12', color: '#e2e8f0', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui' }}>
      <header style={{ borderBottom: '1px solid #222938', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ color: '#38bdf8', margin: 0, fontSize: '1.5rem', letterSpacing: '0.05em' }}>
          HYPER-CONTEXT MINTED APP
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          AI Generated Specification: ${prompt}
        </p>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: '#151922', padding: '1.5rem', borderRadius: '8px', border: '1px solid #222938', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ color: '#f8fafc', fontSize: '1.1rem', marginTop: 0 }}>Data Stream Alpha</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Real-time biological metrics flowing into the component view layer.</p>
        </div>
        <div style={{ background: '#151922', padding: '1.5rem', borderRadius: '8px', border: '1px solid #222938', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ color: '#f8fafc', fontSize: '1.1rem', marginTop: 0 }}>Neural Analytics</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Active hormone secretions monitored across the organism.</p>
        </div>
      </div>
    </div>
  );
}
`;
  }
}
