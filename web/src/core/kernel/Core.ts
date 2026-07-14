import { AtlasKernel } from "./AtlasKernel";
import { AIEngine } from "../engine/AIEngine";
import { MemoryEngine } from "../memory/MemoryEngine";
import { KnowledgeEngine } from "../knowledge/KnowledgeEngine";

export class Core {
  kernel: AtlasKernel;
  ai: AIEngine;
  memory: MemoryEngine;
  knowledge: KnowledgeEngine;

  constructor() {
    this.kernel = new AtlasKernel();
    this.ai = new AIEngine();
    this.memory = new MemoryEngine();
    this.knowledge = new KnowledgeEngine();

    console.log("Atlas Core initialized");
  }
}