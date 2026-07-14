import { AtlasTool } from "./ToolRegistry";

export class BrowserTool implements AtlasTool {
  name = "browser";

  description = "Browse websites and fetch web pages.";

  async execute(input?: { url: string }) {
    console.log("🌐 BrowserTool:", input?.url);

    // فعلاً Mock
    return {
      success: true,
      tool: this.name,
      url: input?.url,
      content: "Browser Tool Placeholder",
      timestamp: new Date().toISOString(),
    };
  }
}