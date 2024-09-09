/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:AGPDY12LIKkv@ep-crimson-term-a52xld8u.us-east-2.aws.neon.tech/ai-mock-interviewer?sslmode=require',
    }
  };