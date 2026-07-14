import { AtlasKernel } from "./kernel/AtlasKernel";
import { AIEngine } from "./engine/AIEngine";
import { MemoryEngine } from "./memory/MemoryEngine";
import { KnowledgeEngine } from "./knowledge/KnowledgeEngine";

import { ToolRegistry } from "./tools/ToolRegistry";
import { BrowserTool } from "./tools/BrowserTool";

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

    // Register built-in tools
    this.tools.register(new BrowserTool());

    console.log("🚀 Atlas Core initialized");
  }
}