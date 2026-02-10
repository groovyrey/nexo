import { neon } from '@neondatabase/serverless';

const dbUrl = "postgresql://neondb_owner:npg_JIij7aH6dGnW@ep-holy-forest-adfeecmt-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const sql = neon(dbUrl);

async function init() {
  console.log("Connecting to Neon and initializing incidents table...");
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS incidents (
        id SERIAL PRIMARY KEY,
        error_code VARCHAR(50) NOT NULL,
        method VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("SUCCESS: Table 'incidents' created or already exists.");
  } catch (error) {
    console.error("ERROR: Failed to initialize table:", error);
    process.exit(1);
  }
}

init();
