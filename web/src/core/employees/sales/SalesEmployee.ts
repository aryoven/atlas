import { BaseEmployee } from "../BaseEmployee";

export class SalesEmployee extends BaseEmployee {
  async answerCustomer(message: string) {
    return this.think(message);
  }
}