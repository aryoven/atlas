import { ToolRegistry } from "./ToolRegistry";

import { BrowserTool } from "./BrowserTool";
import { SearchTool } from "./SearchTool";
import { FileSystemTool } from "./FileSystemTool";
import { SupabaseTool } from "./SupabaseTool";

export function registerTools(registry: ToolRegistry) {
  // Built-in Tools
  registry.register(new BrowserTool());
  registry.register(new SearchTool());
  registry.register(new FileSystemTool());
  registry.register(new SupabaseTool());

  // Future Tools
  // registry.register(new GmailTool());
  // registry.register(newCalendarTool());
  // registry.register(newSlackTool());
}