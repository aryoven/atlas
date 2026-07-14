export class AIEngine {
  constructor() {
    console.log("AI Engine initialized");
  }

  async process(prompt: string) {
    console.log("Processing:", prompt);

    return {
      success: true,
      response: "",
    };
  }
}