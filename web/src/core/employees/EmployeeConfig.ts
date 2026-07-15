export interface EmployeeConfig {
  id: string;

  name: string;

  role: string;

  description: string;

  instructions: string;

  model: string;

  temperature: number;

  tools: string[];

  memory: boolean;

  knowledge: boolean;
}