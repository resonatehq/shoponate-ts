import { Fruit } from "./types.js";
import Database, { Database as DatabaseType } from "better-sqlite3";
import { Context } from "@resonatehq/sdk";
import path from "path";
import { fileURLToPath } from "url";
import { error } from "console";

export async function addToCart(
  _: Context,
  cartId: string,
  fruit: Fruit,
  db: DatabaseType
): Promise<void> {
  try {
    console.log(`Adding ${fruit.name} to cart ${cartId}`);
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
    return;
  } catch (e) {
    let errorMessage = "An unknown error occurred";
    if (e instanceof Error) {
      errorMessage = `Error inserting into cart: ${e.message}`;
    }
    throw errorMessage;
  }
}

export async function removeFromCart(
  _: Context,
  cartId: string,
  fruitId: string,
  db: DatabaseType
): Promise<void> {
  try {
    const stmt = db.prepare(`
        DELETE FROM cart WHERE cartId = ? AND fruitId = ?
        `);
    const info = stmt.run(cartId, fruitId);
    console.log(`A row has been deleted with rowid ${info.changes}`);
    return;
  } catch (e) {
    let errorMessage = "An unknown error occurred";
    if (e instanceof Error) {
      errorMessage = `Error deleting from cart: ${e.message}`;
    }
    throw errorMessage;
  }
}

export async function deleteCart(
  _: Context,
  cartId: string,
  db: DatabaseType
): Promise<void> {
  console.log("reached delete");
  try {
    const stmt = db.prepare(`
        DELETE FROM cart WHERE cartId = ?`);
    const info = stmt.run(cartId);
    console.log(
      `All rows with cartId ${cartId} have been deleted. ${info.changes}`
    );
    return;
  } catch (e) {
    let errorMessage = "An unknown error has occurred";
    if (e instanceof Error) {
      errorMessage = `Error deleting cart: ${e.message}`;
    }
    throw errorMessage;
  }
}

export async function getCart(
  _: Context,
  cartId: string,
  db: DatabaseType
): Promise<{ data: any[] }> {
  console.log(`Getting cart ${cartId}`);
  try {
    const stmt = db.prepare(`
        SELECT * FROM cart WHERE cartId = ?
      `);
    const rows = stmt.all(cartId);
    return { data: rows };
  } catch (e) {
    let errorMessage = "An unknown error occurred";
    if (e instanceof Error) {
      errorMessage = `Error retrieving cart: ${e.message}`;
    }
    throw errorMessage;
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

  // Create the cart table if it doesn't exist
  const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cartId TEXT NOT NULL,
      fruitId INTEGER NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT
    );
  `);
  const info = stmt.run();
  console.log(info);
  return db;
}
