import { neon } from '@neondatabase/serverless';

const dbUrl = "postgresql://neondb_owner:npg_JIij7aH6dGnW@ep-holy-forest-adfeecmt-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(dbUrl);

async function seed() {
  console.log("Adding example incident...");
  try {
    await sql`
      INSERT INTO incidents (error_code, method, message)
      VALUES ('HF_INFERENCE_TIMEOUT', 'POST /api/nexo', 'The Hugging Face inference request timed out after 30 seconds.');
    `;
    console.log("SUCCESS: Example incident added.");
  } catch (error) {
    console.error("ERROR:", error);
    process.exit(1);
  }
}

seed();
