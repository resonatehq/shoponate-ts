import { Fruit } from "./types.js";
import Database, { Database as DatabaseType } from "better-sqlite3";
import { Context } from "@resonatehq/sdk";
import path from "path";
import { fileURLToPath } from "url";

export async function addToCart(
  _: Context,
  cartId: string,
  fruit: Fruit,
  db: DatabaseType
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(cartId, fruit, db);
    const stmt = db.prepare(`
            INSERT INTO cart (cartId, fruitId, name, price, image)
            VALUES (?, ?, ?, ?, ?)
        `);
    const info = stmt.run(
      cartId,
      fruit.id,
      fruit.name,
      fruit.price,
      fruit.image
    );
    console.log(`A row has been inserted with rowid ${info.lastInsertRowid}`);
    return { success: true };
  } catch (e) {
    let errorMessage = "An unknown error occurred";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    console.error("Error inserting into cart:", e);
    return { success: false, error: errorMessage };
  }
}

export async function removeFromCart(
  _: Context,
  cardId: string,
  fruitId: string,
  db: DatabaseType
): Promise<{ success: boolean; error?: string }> {
  try {
    const stmt = db.prepare(`
        DELETE FROM cart WHERE cartId = ? AND fruitId = ?
        `);
    const info = stmt.run(cardId, fruitId);
    console.log(`A row has been deleted with rowid ${info.changes}`);
    return { success: true };
  } catch (e) {
    let errorMessage = "An unknown error occurred";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    console.error("Error deleting from cart:", e);
    return { success: false, error: errorMessage };
  }
}

export async function getCart(
  _: Context,
  cartId: string,
  db: DatabaseType
): Promise<{ success: boolean; data: any[]; error?: string }> {
  try {
    const stmt = db.prepare(`
        SELECT * FROM cart WHERE cartId = ?
      `);
    const rows = stmt.all(cartId);
    return { success: true, data: rows };
  } catch (e) {
    let errorMessage = "An unknown error occurred";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    console.error("Error retrieving cart:", e);
    return { success: false, data: [], error: errorMessage };
  }
}

export async function startDB() {
  // Determine the __dirname equivalent for ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // Specify the path to the database file
  const dbPath = path.resolve(__dirname, "shoponate-cart.db");
  // Open the database (it will create the file if it doesn't exist)
  const db = new Database(dbPath);
  return db;
}
