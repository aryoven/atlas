import { ToolRegistry } from "./ToolRegistry";

import { BrowserTool } from "./BrowserTool";
import { SearchTool } from "./SearchTool";

export function registerTools(registry: ToolRegistry) {
  // Built-in Tools
  registry.register(new BrowserTool());
  registry.register(new SearchTool());

  // Future Tools
  // registry.register(new FileSystemTool());
  // registry.register(new GmailTool());
  // registry.register(new CalendarTool());
  // registry.register(new SupabaseTool());
}