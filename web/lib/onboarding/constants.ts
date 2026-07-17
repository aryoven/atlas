export const ONBOARDING_ROLES = [
  "Sales",
  "Support",
  "Marketing",
  "Programmer",
  "Accountant",
  "Custom",
] as const;

export type OnboardingRole = (typeof ONBOARDING_ROLES)[number];

export const ONBOARDING_PERSONALITIES = [
  "Professional",
  "Friendly",
  "Concise",
  "Expert",
  "Custom",
] as const;

export type OnboardingPersonality = (typeof ONBOARDING_PERSONALITIES)[number];

const PERSONALITY_INSTRUCTIONS: Record<OnboardingPersonality, string> = {
  Professional:
    "Communicate in a professional, polished tone. Be clear, respectful, and business-appropriate.",
  Friendly:
    "Communicate in a warm, approachable tone. Be helpful and personable while staying useful.",
  Concise:
    "Keep responses short and direct. Prioritize clarity. Avoid unnecessary filler.",
  Expert:
    "Communicate as a domain expert. Be precise, insightful, and confident. Use specialized knowledge when relevant.",
  Custom:
    "Adapt your communication style to best serve the user's goals and context.",
};

const PERSONALITY_TEMPERATURE: Record<OnboardingPersonality, number> = {
  Professional: 0.5,
  Friendly: 0.7,
  Concise: 0.3,
  Expert: 0.4,
  Custom: 0.7,
};

export function buildOnboardingInstructions(
  goal: string,
  personality: OnboardingPersonality
): string {
  return [
    goal.trim(),
    "",
    `Personality: ${personality}`,
    PERSONALITY_INSTRUCTIONS[personality],
  ].join("\n");
}

export function getOnboardingTemperature(
  personality: OnboardingPersonality
): number {
  return PERSONALITY_TEMPERATURE[personality];
}

export const ONBOARDING_TOTAL_STEPS = 7;
