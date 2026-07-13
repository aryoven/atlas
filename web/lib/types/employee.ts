export type Employee = {
  id: string;
  user_id: string;
  name: string;
  role: string;
  instructions: string;
  model: string;
  temperature: number;
  created_at: string;
};

/** Models actually routed through the configured OpenRouter integration. */
export const EMPLOYEE_MODELS = ["OpenRouter Free"] as const;

export type EmployeeModel = (typeof EMPLOYEE_MODELS)[number];

export const TEMPERATURE_PRESETS = [0, 0.2, 0.5, 0.7, 1] as const;

export type EmployeeTab =
  | "overview"
  | "instructions"
  | "knowledge"
  | "conversations"
  | "settings";

export const EMPLOYEE_TABS: { id: EmployeeTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "instructions", label: "Instructions" },
  { id: "knowledge", label: "Knowledge" },
  { id: "conversations", label: "Conversations" },
  { id: "settings", label: "Settings" },
];
