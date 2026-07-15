import { Core } from "./Core";

export interface RuntimeRequest {
  employee: any;
  conversation: any;
  message: string;
}

export class AtlasRuntime {
  private core: Core;

  constructor() {
    this.core = new Core();
  }

  async ask(request: RuntimeRequest) {
    return await this.core.ask({
      employee: request.employee,
      conversation: request.conversation,
      message: request.message,
    });
  }
}

export const atlasRuntime = new AtlasRuntime();