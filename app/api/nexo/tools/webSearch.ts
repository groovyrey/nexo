import { NextRequest, NextResponse } from 'next/server';

export async function webSearch(query: string) {
  const apiKey = process.env.CRAWLEO_API_KEY;
  if (!apiKey) {
    throw new Error('CRAWLEO_API_KEY is not set');
  }

  const url = `https://api.crawleo.com/v1/search?query=${encodeURIComponent(
    query
  )}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
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
