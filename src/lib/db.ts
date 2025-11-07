
import fs from 'fs';
import path from 'path';

// Define the structure of our database entries
export interface ScoreEntry {
  email: string;
  name: string;
  score: number;
  date: string;
}

export interface UserEntry {
  email: string;
  name: string;
}

export interface Database {
  scores: ScoreEntry[];
  users: UserEntry[];
}

// Define the path to our database file on the server
const dbPath = path.resolve(process.cwd(), 'db.json');

// Function to read the entire database from the server file system
export const readDB = (): Database => {
  try {
    // Check if the file exists before trying to read
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      // If the file is empty, return a default structure
      if (!data) {
        return { scores: [], users: [] };
      }
      const parsedData = JSON.parse(data);
      // Ensure both scores and users arrays exist
      return {
        scores: parsedData.scores || [],
        users: parsedData.users || [],
      };
    }
  } catch (error) {
    console.error("Error reading database:", error);
  }
  // If the file doesn't exist or has errors, return a default structure
  return { scores: [], users: [] };
};

// Function to write the entire database to the server file system
export const writeDB = (data: Database) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to database:", error);
  }
};
