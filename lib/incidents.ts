import { neon } from '@neondatabase/serverless';

// Interface for an incident record
export interface Incident {
  id: number;
  error_code: string;
  method: string;
  message: string;
  created_at: string | Date;
}

// Log an incident to the database
export async function logIncident(errorCode: string, method: string, message: string) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn("DATABASE_URL not set. Skipping incident logging.");
    return;
  }

  try {
    const sql = neon(dbUrl);
    await sql`
      INSERT INTO incidents (error_code, method, message)
      VALUES (${errorCode}, ${method}, ${message})
    `;
  } catch (error) {
    console.error("Failed to log incident to Neon DB:", error);
  }
}

// Fetch the latest incidents (limit 10)
export async function getRecentIncidents(limit: number = 5): Promise<Incident[]> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return [];
  }

  try {
    const sql = neon(dbUrl);
    // Fetch latest incidents
    const incidents = await sql`
      SELECT id, error_code, method, message, created_at
      FROM incidents
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return incidents as Incident[];
  } catch (error) {
    console.error("Failed to fetch incidents:", error);
    return [];
  }
}

// Count incidents for a specific month/year
export async function getIncidentCountForMonth(month: number, year: number): Promise<number> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return 0;

  try {
    const sql = neon(dbUrl);
    const start = new Date(year, month, 1).toISOString();
    const end = new Date(year, month + 1, 1).toISOString();
    
    const result = await sql`
      SELECT COUNT(*) as count 
      FROM incidents 
      WHERE created_at >= ${start} AND created_at < ${end}
    `;
    return parseInt(result[0].count);
  } catch (error) {
    console.error("Failed to count incidents:", error);
    return 0;
  }
}
