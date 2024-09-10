# Shoponate TypeScript

**Resonate HQ example application using the TypeScript SDK**

This repository contains an example application that uses the Resonate HQ TypeScript SDK.
The application simulates an online fruit shop.
You can add fruit to your cart and simulate a check out.

![Fruit shop animated gif](https://github.com/resonatehq/shoponate-ts/blob/main/thefruitshop.gif)

This provides a basic example of how to integrate the Resonate SDK into your application.

## Run application locally

**How to run this application locally.**

### Prerequisites

You will need Node, NPM, and SQLite installed.

Then, clone the repository to a project folder on your machine.

#### Cart service

After you clone the repo, from your terminal, cd into the cart directory, install the dependencies, and run the service:

```shell
cd shoponate-ts/cart
npm install
npm run dev
```

You should now have the cart service running and accepting HTTP requests on port 5172.

#### UI

Next, from another terminal, run the UI.

Change directories into the `ui` directory and run:

```shell
cd shoponate-ts/ui
npm install
npm run dev -- --open
```

You should now have the UI running on port 5173.
