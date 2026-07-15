import { ToolRegistry } from "./ToolRegistry";

import { BrowserTool } from "./BrowserTool";
import { SearchTool } from "./SearchTool";
import { FileSystemTool } from "./FileSystemTool";

export function registerTools(registry: ToolRegistry) {
  // Built-in Tools
  registry.register(new BrowserTool());
  registry.register(new SearchTool());
  registry.register(new FileSystemTool());

  // Future Tools
  // registry.register(new GmailTool());
  // registry.register(new CalendarTool());
  // registry.register(new SupabaseTool());
}