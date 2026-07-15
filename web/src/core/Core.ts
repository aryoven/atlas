import { AtlasKernel } from "./kernel/AtlasKernel";
import { AIEngine } from "./engine/AIEngine";
import { MemoryEngine } from "./memory/MemoryEngine";
import { KnowledgeEngine } from "./knowledge/KnowledgeEngine";

import { ToolRegistry } from "./tools/ToolRegistry";
import { BrowserTool } from "./tools/BrowserTool";

export interface AskOptions {
  employee: any;
  conversation: any;
  message: string;
}

export class Core {
  kernel: AtlasKernel;
  ai: AIEngine;
  memory: MemoryEngine;
  knowledge: KnowledgeEngine;
  tools: ToolRegistry;

  constructor() {
    this.kernel = new AtlasKernel();

    this.ai = new AIEngine();

    this.memory = new MemoryEngine();

    this.knowledge = new KnowledgeEngine();

    this.tools = new ToolRegistry();

    this.tools.register(new BrowserTool());

    console.log("🚀 Atlas Core initialized");
  }

  async ask(options: AskOptions) {
    console.log("========== ATLAS ==========");
    console.log("Employee:", options.employee?.name);
    console.log("Message:", options.message);

    // 1) Load Memory
    const memory = this.memory.get("history") ?? [];

    // 2) Load Knowledge
    const knowledge: any[] = [];

    // 3) Compose Prompt
    const prompt = `
Employee:
${options.employee?.name}

Role:
${options.employee?.role}

Instructions:
${options.employee?.instructions}

Conversation:
${JSON.stringify(memory)}

Knowledge:
${JSON.stringify(knowledge)}

User:
${options.message}
`;

    // 4) Ask AI
    const result = await this.ai.process(prompt);

    // 5) Save Memory
    memory.push({
      user: options.message,
      assistant: result.response,
    });

    this.memory.set("history", memory);

    return result;
  }
}