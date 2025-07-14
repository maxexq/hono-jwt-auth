import { Database } from "bun:sqlite";
import { type UUID, randomUUID } from "crypto";

export const insertUser = async (
  db: Database,
  email: string,
  password: string
) => {
  const userId = randomUUID();

  const passwordHash = await Bun.password.hash(password);

  const insertQuery = db.query(
    `
    INSERT INTO users (id, email, password_hash) 
    VALUES (?, ?, ?) 
    RETURNING id
    `
  );

  const user = insertQuery.get(userId, email, passwordHash) as { id: UUID };

  return user.id;
};

export const getUserByEmail = async (db: Database, email: string) => {
  const query = db.query(
    `
    SELECT id, password_hash 
    FROM users 
    WHERE email = ?
    `
  );

  const user = query.get(email) as
    | { id: UUID; password_hash: string }
    | undefined;

  return user;
};

export const getUserById = async (db: Database, userId: UUID) => {
  const query = db.query(
    `
    SELECT id, email 
    FROM users 
    WHERE id = ?
    `
  );

  const user = query.get(userId) as { id: UUID; email: string } | undefined;

  return user;
};
