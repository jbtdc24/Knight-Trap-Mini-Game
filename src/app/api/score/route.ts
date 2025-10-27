
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from "next-auth/next"
import fs from 'fs';
import path from 'path';

// This is a simple file-based database. In a production app, you'd use a more robust database.
const dbPath = path.resolve(process.cwd(), 'db.json');

interface ScoreEntry {
  email: string;
  name: string;
  score: number;
  date: string;
}

interface Database {
  scores: ScoreEntry[];
}

// Function to read the database from the server file system
const readDB = (): Database => {
  try {
    // Check if the file exists before trying to read
    if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, 'utf-8');
        // Make sure data is not empty before parsing
        if (data) {
            return JSON.parse(data);
        }
    }
  } catch (error) {
    console.error("Error reading database:", error);
  }
  // If the file doesn't exist, is empty, or has errors, return a default structure
  return { scores: [] };
};

// Function to write to the database on the server file system
const writeDB = (data: Database) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to database:", error);
  }
};

export async function GET(request: Request) {
  const db = readDB();
  // Sort scores by score descending, then by date ascending
  const leaderboard = db.scores.sort((a, b) => {
    if (b.score !== a.score) {
        return b.score - a.score;
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }).slice(0, 10); // Return only the top 10
  return NextResponse.json(leaderboard);
}

export async function POST(request: Request) {
  // First, check for a valid session
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email || !session.user.name) {
    return NextResponse.json({ message: 'Unauthorized: You must be logged in to post a score.' }, { status: 401 });
  }

  const { score } = await request.json();

  if (typeof score !== 'number') {
    return NextResponse.json({ message: 'Invalid score provided.' }, { status: 400 });
  }

  const db = readDB();
  
  const newScore: ScoreEntry = {
    email: session.user.email,
    name: session.user.name,
    score: score,
    date: new Date().toISOString(),
  };

  db.scores.push(newScore);
  
  writeDB(db);

  return NextResponse.json({ message: 'Score saved successfully.' });
}
