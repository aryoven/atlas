export interface AtlasTool {
  name: string;
  description: string;

  execute(input?: any): Promise<any>;
}

export class ToolRegistry {
  private tools = new Map<string, AtlasTool>();

  register(tool: AtlasTool) {
    this.tools.set(tool.name, tool);
  }

  get(name: string) {
    return this.tools.get(name);
  }

  list() {
    return Array.from(this.tools.values());
  }

  async execute(name: string, input?: any) {
    const tool = this.tools.get(name);

    if (!tool) {
      throw new Error(`Tool "${name}" not found.`);
    }

    return tool.execute(input);
  }
}