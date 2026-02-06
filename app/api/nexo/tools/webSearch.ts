import { NextRequest, NextResponse } from 'next/server';

export async function webSearch(query: string) {
  const apiKey = process.env.LANGSEARCH_API_KEY;
  if (!apiKey) {
    throw new Error('LANGSEARCH_API_KEY is not set');
  }

  const url = `https://api.langsearch.com/v1/web-search`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json', // Keep Accept header for good measure
    },
    body: JSON.stringify({ query, count: 3, summary: true }),
  });

  if (!response.ok) {
    let errorDetail = `Status ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      errorDetail = JSON.stringify(errorJson);
    } catch (e) {
      const errorText = await response.text();
      errorDetail = errorText;
    }
    console.error(`Crawleo API request failed: ${errorDetail}`);
    throw new Error(`Crawleo API request failed: ${errorDetail}`);
  }

  const data = await response.json();
  return data;
}
