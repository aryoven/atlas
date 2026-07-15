import { AtlasKernel } from "./kernel/AtlasKernel";
import { AIEngine } from "./engine/AIEngine";
import { MemoryEngine } from "./memory/MemoryEngine";
import { KnowledgeEngine } from "./knowledge/KnowledgeEngine";

import { ToolRegistry } from "./tools/ToolRegistry";
import { registerTools } from "./tools/registerTools";

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

    // Register all built-in tools
    registerTools(this.tools);

    console.log("🚀 Atlas Core initialized");
  }
}