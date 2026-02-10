import { NextResponse } from 'next/server';
import { getRecentIncidents, getIncidentCountForMonth } from '@/lib/incidents';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const now = new Date();
    const [incidents, currentMonthCount] = await Promise.all([
      getRecentIncidents(10),
      getIncidentCountForMonth(now.getMonth(), now.getFullYear())
    ]);
    return NextResponse.json({ 
      incidents,
      currentMonthCount 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin/Setup endpoint to ensure table exists
export async function POST(req: Request) {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
    }

    const sql = neon(dbUrl);
    
    // Simple authentication check (optional, but good for safety)
    // For now, we'll allow it to run to ensure setup is easy
    
    await sql`
      CREATE TABLE IF NOT EXISTS incidents (
        id SERIAL PRIMARY KEY,
        error_code VARCHAR(50) NOT NULL,
        method VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return NextResponse.json({ message: "Incidents table initialized successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
