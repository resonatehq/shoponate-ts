import express, { Request, Response } from "express";
import { Resonate, Context } from "@resonatehq/sdk";
import {
  addToCart,
  removeFromCart,
  getCart,
  deleteCart,
  startDB,
} from "./database.js";
import { Database as DatabaseType } from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const resonate = new Resonate();
// Regster the addToCart function with Resonate
resonate.register("addToCart", addToCart, { timeout: 2000, version: 1 });
// Regster the removeFromCart function with Resonate
resonate.register("removeFromCart", removeFromCart, {
  timeout: 2000,
  version: 1,
});
// Regster the getCart function with Resonate
resonate.register("getCart", getCart, { timeout: 2000, version: 1 });
// Register the checkoutFlow function with Resonate
resonate.register("deleteCart", deleteCart, { timeout: 2000, version: 1 });
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
  try {
    const cartId = req.query.cartId as string;
    const id = uuidv4(); // Generate a UUID for promise
    const op = (await resonate.run("getCart", `${id}`, cartId, db)) as {
      data: any;
    };
    res.json({ cart: op.data });
  } catch (e) {
    let errorMessage = "An unknown error occurred.";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// POST route example
app.post("/cart/add", async (req: Request, res: Response) => {
  try {
    const { callId, cartId, fruit } = req.body;
    // Use Resonate to call the addToCart function
    // This provides a Durable Promise and the operation will be retried if it fails
    await resonate.run("addToCart", `${callId}`, cartId, fruit, db);
    res
      .status(201)
      .json({ message: `Item ${fruit.name} added to Cart ${cartId}` });
  } catch (e) {
    let errorMessage = "An unknown error occurred.";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

app.post("/cart/remove", async (req: Request, res: Response) => {
  try {
    const { callId, cartId, fruit } = req.body;
    // Use Resonate to call the removeFromCart function
    // This provides a Durable Promise and the operation will be retried if it fails
    await resonate.run(
      "removeFromCart",
      `${callId}`,
      cartId,
      fruit.fruitId,
      db
    );
    res
      .status(201)
      .json({ message: `Item ${fruit.name} removed from cart ${cartId}` });
  } catch (e) {
    let errorMessage = "An unknown error occurred.";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

app.post("/cart/checkout", async (req: Request, res: Response) => {
  console.log("reached checkout");
  try {
    const { callId, cartId } = req.body;
    await resonate.run("deleteCart", callId, cartId, db);
    res
      .status(201)
      .json({ message: `Your order has been processed and is on the way.` });
  } catch (e) {
    let errorMessage = "An unknown error occurred";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    res.status(500).json({ message: errorMessage });
  }
});

// Dynamic route example
// app.get("/api/users/:id", (req: Request, res: Response) => {
//   const { id } = req.params;
//   // This would typically fetch a specific user from a database
//   res.json({ user: { id, name: "Example User" } });
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
