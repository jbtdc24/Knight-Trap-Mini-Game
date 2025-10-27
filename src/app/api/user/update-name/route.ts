
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { readDB, writeDB, UserEntry } from '@/lib/db';

export async function POST(request: Request) {
  // 1. Authenticate the user
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // 2. Validate the incoming data
  const { newName } = await request.json();
  if (typeof newName !== 'string' || newName.length < 3 || newName.length > 20) {
    return NextResponse.json({ message: 'Invalid name. Must be between 3 and 20 characters.' }, { status: 400 });
  }

  // 3. Update the database
  const db = readDB();
  const userEmail = session.user.email;
  let userFound = false;

  // Find the user and update their name
  db.users = db.users.map(user => {
    if (user.email === userEmail) {
      user.name = newName;
      userFound = true;
    }
    return user;
  });

  // If the user was not in the database, add them
  if (!userFound) {
    db.users.push({ email: userEmail, name: newName });
  }

  // 4. Write the changes back to the file
  writeDB(db);

  // 5. Return a success response
  return NextResponse.json({ message: 'Name updated successfully', newName });
}
