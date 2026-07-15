import { AtlasTool } from "./ToolRegistry";

export class SupabaseTool implements AtlasTool {
  name = "supabase";

  description = "Interact with Supabase database and storage.";

  async execute(input?: {
    action:
      | "select"
      | "insert"
      | "update"
      | "delete"
      | "rpc";
    table?: string;
    data?: any;
    filters?: any;
  }) {
    console.log("🟢 SupabaseTool:", input);

    // TODO:
    // connect to Supabase Client

    return {
      success: true,
      tool: this.name,
      action: input?.action,
      table: input?.table,
      data: input?.data,
      timestamp: new Date().toISOString(),
    };
  }
}