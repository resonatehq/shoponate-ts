# Shoponate TypeScript

**Resonate HQ example application using the TypeScript SDK**

## Run application locally

**How to run this application locally.**

You will need Node, NPM, and SQLite installed.

Clone the repo and install the dependencies for both the ui and the cart service.

```shell
cd shoponate-ts
cd ui
npm install
cd ..
cd cart
npm install
```

Then you will need to set up SQLite.

Create a database inside `/cart/dist`.
You can create the `dist` directory or run `npm run build` inside the `cart` directory to create it.

From within `/cart/dist` run:

```shell
sqlite3 shoponate-cart.db
```

Then, while inside the SQLite shell create the cart table:

```sql
CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, cartId TEXT NOT NULL, fruitId INTEGER NOT NULL, name TEXT NOT NULL, price REAL NOT NULL, image TEXT);
```

Now you can start the cart service.
From within the `cart` directory, run:

```shell
npm run build
npm run start
```

You should now have the cart service running and accepting HTTP requests on port 5172.

Next, run the UI.

Change directories into the `ui` directory and run:

```shell
npm run dev -- --open
```
