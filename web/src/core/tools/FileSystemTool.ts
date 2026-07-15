import { AtlasTool } from "./ToolRegistry";

export class FileSystemTool implements AtlasTool {
  name = "filesystem";

  description = "Read, write and manage project files.";

  async execute(input?: {
    action: "read" | "write" | "delete" | "list";
    path: string;
    content?: string;
  }) {
    console.log("📁 FileSystemTool:", input);

    // فعلاً Mock
    return {
      success: true,
      tool: this.name,
      action: input?.action,
      path: input?.path,
      content: input?.content ?? null,
      timestamp: new Date().toISOString(),
    };
  }
}