// TODO: Replace mock data with real API calls when backend is available.

export const mockUser = {
  id: "u_1",
  name: "Alex Chen",
  email: "alex@codementor.ai",
  githubUsername: "alexchen",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  plan: "Pro",
  joinedAt: "2024-08-12",
};

export const mockStats = {
  reviews: 148,
  projects: 24,
  averageScore: 87,
  linesReviewed: 42315,
};

export type ReviewStatus = "completed" | "in_progress" | "failed";

export interface Project {
  id: string;
  name: string;
  language: string;
  createdAt: string;
  lastReviewed: string;
  status: ReviewStatus;
  description: string;
}

export const mockProjects: Project[] = [
  {
    id: "p1",
    name: "payments-service",
    language: "TypeScript",
    createdAt: "2025-05-14",
    lastReviewed: "2025-07-01",
    status: "completed",
    description: "Stripe webhook handlers and invoice reconciliation.",
  },
  {
    id: "p2",
    name: "auth-gateway",
    language: "Go",
    createdAt: "2025-04-22",
    lastReviewed: "2025-06-28",
    status: "completed",
    description: "OAuth2 gateway with rate limiting.",
  },
  {
    id: "p3",
    name: "ml-pipeline",
    language: "Python",
    createdAt: "2025-06-01",
    lastReviewed: "2025-07-03",
    status: "in_progress",
    description: "Training pipeline for recommendation model.",
  },
  {
    id: "p4",
    name: "web-dashboard",
    language: "TypeScript",
    createdAt: "2025-03-11",
    lastReviewed: "2025-06-19",
    status: "completed",
    description: "Internal analytics dashboard.",
  },
  {
    id: "p5",
    name: "data-etl",
    language: "Rust",
    createdAt: "2025-05-30",
    lastReviewed: "2025-06-30",
    status: "failed",
    description: "High-throughput ETL for event streams.",
  },
  {
    id: "p6",
    name: "mobile-api",
    language: "Kotlin",
    createdAt: "2025-02-08",
    lastReviewed: "2025-06-15",
    status: "completed",
    description: "REST API powering the mobile app.",
  },
];

export interface ReviewSummary {
  id: string;
  project: string;
  language: string;
  score: number;
  bugs: number;
  createdAt: string;
  status: ReviewStatus;
}

export const mockReviews: ReviewSummary[] = [
  {
    id: "r1",
    project: "payments-service",
    language: "TypeScript",
    score: 92,
    bugs: 1,
    createdAt: "2025-07-01",
    status: "completed",
  },
  {
    id: "r2",
    project: "auth-gateway",
    language: "Go",
    score: 78,
    bugs: 4,
    createdAt: "2025-06-28",
    status: "completed",
  },
  {
    id: "r3",
    project: "ml-pipeline",
    language: "Python",
    score: 65,
    bugs: 7,
    createdAt: "2025-06-25",
    status: "completed",
  },
  {
    id: "r4",
    project: "web-dashboard",
    language: "TypeScript",
    score: 88,
    bugs: 2,
    createdAt: "2025-06-19",
    status: "completed",
  },
  {
    id: "r5",
    project: "data-etl",
    language: "Rust",
    score: 71,
    bugs: 5,
    createdAt: "2025-06-12",
    status: "completed",
  },
];
export const mockReviewResult = {
  overallScore: 84,
  bugs: [
    {
      id: "b1",
      name: "Null Reference",
      severity: "high",
      line: 42,
      message: "Possible null dereference on `user.profile`.",
      difficulty: "Medium",
      meaning: "Accessing a property on a null or undefined value.",
      why: "The variable was not guarded before access.",
      fix: "Add a null check or optional chaining (`user?.profile`).",
      example: "if (user?.profile) { ... }",
      avoid: "Enable strict null checks in tsconfig.",
      related: ["TypeScript strict mode", "Optional chaining"],
    },
    {
      id: "b2",
      name: "Unhandled Promise",
      severity: "medium",
      line: 78,
      message: "Promise returned by `sendEmail` is not awaited.",
      difficulty: "Easy",
      meaning: "An async function is called without handling its result.",
      why: "Missing `await` on the promise.",
      fix: "Add `await` or handle with `.then().catch()`.",
      example: "await sendEmail(user);",
      avoid: "Enable no-floating-promises lint rule.",
      related: ["Async/Await", "Error handling"],
    },
  ],
  logic:
    "Overall control flow is clean. Consider extracting the retry loop into a helper for reuse.",
  performance: "The nested loop in `aggregate()` is O(n²). Use a hashmap to reduce to O(n).",
  bestPractices: [
    "Prefer `const` over `let` for immutable bindings.",
    "Break long functions into smaller units.",
    "Add JSDoc for exported APIs.",
  ],
  complexity: { time: "O(n²)", space: "O(n)", optimal: "O(n)" },
  optimizedCode: `function aggregate(items: Item[]) {\n  const map = new Map<string, number>();\n  for (const item of items) {\n    map.set(item.key, (map.get(item.key) ?? 0) + item.value);\n  }\n  return map;\n}`,
  optimizationExplanation:
    "Replaced the nested loop with a single pass using a Map for O(1) lookups, reducing time complexity from O(n²) to O(n).",
  errorExplanation:
    "TypeError on line 42 occurs because `user.profile` may be undefined for guest users.",
  howToAvoid: "Enforce strict null checks in the compiler and validate inputs at the boundary.",
  unitTests: `describe("aggregate", () => {\n  it("sums values by key", () => {\n    expect(aggregate([{ key: "a", value: 1 }, { key: "a", value: 2 }])).toEqual(new Map([["a", 3]]));\n  });\n  it("handles empty input", () => {\n    expect(aggregate([]).size).toBe(0);\n  });\n});`,
  edgeCases: ["Empty array", "Duplicate keys", "Very large input (1M items)", "Unicode keys"],
  codeExplanation:
    "The function iterates over an array of `Item` and accumulates values grouped by `key`. It returns a Map for O(1) subsequent lookups.",
};

export const mockRepos = [
  {
    id: 1,
    name: "alexchen/payments-service",
    language: "TypeScript",
    branch: "main",
    updated: "2d ago",
    stars: 128,
    private: false,
  },
  {
    id: 2,
    name: "alexchen/auth-gateway",
    language: "Go",
    branch: "main",
    updated: "5d ago",
    stars: 84,
    private: false,
  },
  {
    id: 3,
    name: "alexchen/ml-pipeline",
    language: "Python",
    branch: "develop",
    updated: "1w ago",
    stars: 42,
    private: true,
  },
  {
    id: 4,
    name: "alexchen/web-dashboard",
    language: "TypeScript",
    branch: "main",
    updated: "3w ago",
    stars: 210,
    private: false,
  },
  {
    id: 5,
    name: "alexchen/data-etl",
    language: "Rust",
    branch: "main",
    updated: "1mo ago",
    stars: 19,
    private: true,
  },
];

export const languages = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "Kotlin",
  "C++",
  "C#",
  "Ruby",
  "PHP",
];

export const sampleCode = `function aggregate(items) {\n  let result = {};\n  for (let i = 0; i < items.length; i++) {\n    for (let j = 0; j < items.length; j++) {\n      if (items[i].key === items[j].key) {\n        result[items[i].key] = (result[items[i].key] || 0) + items[j].value;\n      }\n    }\n  }\n  return result;\n}`;