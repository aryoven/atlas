import { ToolRegistry } from "./ToolRegistry";
import { BrowserTool } from "./BrowserTool";

export function registerTools(registry: ToolRegistry) {
  // Built-in Tools
  registry.register(new BrowserTool());

  // Future Tools
  // registry.register(new SearchTool());
  // registry.register(new FileSystemTool());
  // registry.register(new GmailTool());
  // registry.register(new CalendarTool());
  // registry.register(new SupabaseTool());
}