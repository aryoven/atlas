export class MemoryEngine {
  private memory: Map<string, any>;

  constructor() {
    this.memory = new Map();
    console.log("Memory Engine initialized");
  }

  set(key: string, value: any) {
    this.memory.set(key, value);
  }

  get(key: string) {
    return this.memory.get(key);
  }

  clear() {
    this.memory.clear();
  }
}