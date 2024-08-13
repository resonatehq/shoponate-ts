import express, { Request, Response } from "express";
import { Resonate } from "@resonatehq/sdk";
import { addToCart, removeFromCart, getCart, startDB } from "./database.js";
import { Database as DatabaseType } from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const resonate = new Resonate();
// Regster the addToCart function with Resonate
resonate.register("addToCart", addToCart, { version: 1 });
// Regster the removeFromCart function with Resonate
resonate.register("removeFromCart", removeFromCart, { version: 1 });
// Regster the getCart function with Resonate
resonate.register("getCart", getCart, { version: 1 });
// Start the Resonate
resonate.start();

// Initialize the database connection once
let db: DatabaseType;

async function initializeDatabase() {
  db = await startDB();
}
// Call this once during service startup
await initializeDatabase();

const app = express();
const port = 5172;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
  })
);

// Root route
app.get("/", (_: Request, res: Response) => {
  res.send("Fruit shop cart service API");
});

// GET route example
app.get("/cart", async (req: Request, res: Response) => {
  const cartId = req.query.cartId as string;
  const id = uuidv4(); // Generate a UUID for promise
  // Use Resonate to call the getCart function
  // This provides a Durable Promise and the operation will be retried if it fails
  await resonate.run("getCart", `${id}`, cartId, db).then((op: any) => {
    if (op.success) {
      res.json({ cart: op.data });
    } else {
      res.status(500).json({ message: op.error });
    }
  });
});

// POST route example
app.post("/cart/add", async (req: Request, res: Response) => {
  const { cartId, fruit } = req.body;
  const id = uuidv4(); // Generate a UUID for promise and the fruit
  fruit.id = id; // Change the fruit id to a UUID
  // Use Resonate to call the addToCart function
  // This provides a Durable Promise and the operation will be retried if it fails
  const op: any = await resonate.run("addToCart", `${id}`, cartId, fruit, db);
  if (op.success) {
    res
      .status(201)
      .json({ message: `Item ${fruit.name} added to Cart ${cartId}` });
  } else {
    res.status(500).json({ message: op.error });
  }
});

app.post("/cart/remove", async (req: Request, res: Response) => {
  const { cartId, fruit } = req.body;
  const id = uuidv4(); // Generate a UUID for promise
  // Use Resonate to call the removeFromCart function
  // This provides a Durable Promise and the operation will be retried if it fails
  const op: any = await resonate.run(
    "removeFromCart",
    `${id}`,
    cartId,
    fruit.fruitId,
    db
  );
  if (op.success) {
    res
      .status(201)
      .json({ message: `Item ${fruit.name} removed from cart ${cartId}` });
  } else {
    res.status(500).json({ message: op.error });
  }
});

// Dynamic route example
app.get("/api/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  // This would typically fetch a specific user from a database
  res.json({ user: { id, name: "Example User" } });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
