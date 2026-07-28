export type Plan = "free" | "pro" | "business";

export const PLANS = {
  free: {
    id: "free",
    name: "Free",

    employeeLimit: 4,
    knowledgeLimit: 5,
    monthlyMessageLimit: 200,
    workspaceLimit: 1,

    memory: false,
    apiAccess: false,
    betterModels: false,
    premiumModels: false,
    sharedKnowledge: false,
    teamWorkspace: false,
    prioritySupport: false,
    earlyAccess: false,
  },

  pro: {
    id: "pro",
    name: "Pro",

    employeeLimit: 20,
    knowledgeLimit: Infinity,
    monthlyMessageLimit: Infinity,
    workspaceLimit: 1,

    memory: true,
    apiAccess: false,
    betterModels: true,
    premiumModels: false,
    sharedKnowledge: false,
    teamWorkspace: false,
    prioritySupport: true,
    earlyAccess: false,
  },

  business: {
    id: "business",
    name: "Business",

    employeeLimit: Infinity,
    knowledgeLimit: Infinity,
    monthlyMessageLimit: Infinity,
    workspaceLimit: Infinity,

    memory: true,
    apiAccess: true,
    betterModels: true,
    premiumModels: true,
    sharedKnowledge: true,
    teamWorkspace: true,
    prioritySupport: true,
    earlyAccess: true,
  },
} as const;

export function getPlan(plan: Plan) {
  return PLANS[plan];
}

export type PlanDetails = (typeof PLANS)[Plan];