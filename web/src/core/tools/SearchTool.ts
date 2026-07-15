import { AtlasTool } from "./ToolRegistry";

export class SearchTool implements AtlasTool {
  name = "search";

  description = "Search the web for information.";

  async execute(input?: { query: string }) {
    console.log("🔎 SearchTool:", input?.query);

    // فعلاً Mock
    return {
      success: true,
      tool: this.name,
      query: input?.query,
      results: [],
      timestamp: new Date().toISOString(),
    };
  }
}