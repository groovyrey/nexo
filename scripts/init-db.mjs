import { neon } from '@neondatabase/serverless';

// Use environment variable for DB URL in production
const dbUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_JIij7aH6dGnW@ep-holy-forest-adfeecmt-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const sql = neon(dbUrl);

async function init() {
  console.log("Connecting to Neon database...");
  try {
    // This is a template for future table initialization
    /*
    await sql`
      CREATE TABLE IF NOT EXISTS your_table_name (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    */
    console.log("Database connection successful.");
  } catch (error) {
    console.error("ERROR: Failed to connect to database:", error);
    process.exit(1);
  }
}

init();
