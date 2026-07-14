import { AtlasKernel } from "./AtlasKernel";
import { AIEngine } from "../engine/AIEngine";
import { MemoryEngine } from "../memory/MemoryEngine";

export class Core {
  kernel: AtlasKernel;
  ai: AIEngine;
  memory: MemoryEngine;

  constructor() {
    this.kernel = new AtlasKernel();
    this.ai = new AIEngine();
    this.memory = new MemoryEngine();

    console.log("Atlas Core initialized");
  }
}