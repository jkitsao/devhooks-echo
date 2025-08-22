# @jkitsao/echo

A tiny browser-compatible client for listening to real-time events from [Devhooks](https://devhooks/ingest).\
This package surfaces the events you ingest via Devhooks so you can consume them directly in your Next.js (or any frontend) apps.

---

## 🚀 About

When you send events to [Devhooks Ingest](https://devhooks/ingest), they don't just get stored --- they also become available as real-time streams.\
`@jkitsao/echo` makes it dead simple to subscribe to those streams over WebSockets and react to them in your UI.

- Works in **Next.js**, React, or plain browser apps

- Lightweight and dependency-free

- Automatically reconnects if the connection drops

- Plays nicely with state managers (Zustand, Redux, Jotai, etc.)

- Written in TypeScript for type safety

Think of it as your "event surface layer" --- just send events to Devhooks, and `echo` brings them back to your app in real-time.

---

## 📦 Installation

`npm install @jkitsao/echo

# or

yarn add @jkitsao/echo`

---

## 🛠️ Usage

### Basic Example

```js

import { Echo } from "@jkitsao/echo";

const echo = new Echo({
url: "wss://devhooks.live/ws", // Your Devhooks WebSocket URL
token: "<your-auth-token>", // Optional: if using auth
});

// Subscribe to all events
echo.on("message", (event) => {
console.log("Got event:", event);
});

// Subscribe to a specific channel
echo.subscribe("orders", (order) => {
console.log("New order:", order);
});`

### With React (state update)

`"use client";
import { useEffect, useState } from "react";
import { Echo } from "@jkitsao/echo";

export default function Orders() {
const [orders, setOrders] = useState<any[]>([]);

useEffect(() => {
const echo = new Echo({ url: "wss://devhooks.live/ws" });

    echo.subscribe("orders", (order) => {
      setOrders((prev) => [...prev, order]);
    });

    return () => echo.close();

}, []);

return (
 <ul>
  {orders.map((o, i) => (
   <li key={i}>{JSON.stringify(o)}</li>
  ))}
 </ul>
);
}

```

---

## 📜 License

MIT © 2025 [Jackson Kitsao](https://github.com/jkitsao)

---

Would you like me to also add a **"How it works internally"** section (like a tiny diagram: Devhooks → Echo → UI) so devs grok it quickly at a glance?
