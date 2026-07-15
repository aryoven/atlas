import { Core } from "../Core";
import { EmployeeConfig } from "./EmployeeConfig";

export abstract class BaseEmployee {
  protected core: Core;

  protected config: EmployeeConfig;

  constructor(core: Core, config: EmployeeConfig) {
    this.core = core;
    this.config = config;
  }

  getConfig() {
    return this.config;
  }

  async think(prompt: string) {
    return this.core.ai.process(prompt);
  }

  remember(key: string, value: any) {
    this.core.memory.set(key, value);
  }

  recall(key: string) {
    return this.core.memory.get(key);
  }

  async useTool(name: string, input?: any) {
    return this.core.tools.execute(name, input);
  }
}