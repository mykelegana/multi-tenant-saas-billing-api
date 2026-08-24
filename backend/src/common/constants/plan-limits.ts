export const PLAN_LIMITS = {
    FREE: {
        API_REQUESTS: 1000,
        PROJECTS_CREATED: 5,
        REQUESTS_PER_MINUTE: 100,
    },
    PRO: {
        API_REQUESTS: 10000,
        PROJECTS_CREATED: 50,
        REQUESTS_PER_MINUTE: 500,
    },
} as const;