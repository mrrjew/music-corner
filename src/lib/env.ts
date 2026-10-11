import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"], {
    required_error: "NODE_ENV is required and must be 'development', 'test', or 'production'",
  }),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formattedErrors = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`❌ Missing or invalid environment variable:\n${formattedErrors}`);
}

export const env = parsed.data;
