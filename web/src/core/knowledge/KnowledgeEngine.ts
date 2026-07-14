export class KnowledgeEngine {
  private documents: string[] = [];

  constructor() {
    console.log("Knowledge Engine initialized");
  }

  add(document: string) {
    this.documents.push(document);
  }

  list() {
    return this.documents;
  }

  clear() {
    this.documents = [];
  }
}