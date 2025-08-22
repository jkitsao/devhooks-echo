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
"use client";

import { SyncClient } from "@jkitsao/echo";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const client = new SyncClient({
      sourceId: "frontend-app",
      secret: "supersecret",
    });

    client.on("authenticated", () => {
      console.log("✅ Authenticated!");
      client.send({ type: "hello", msg: "from Next.js" });
    });

    client.on("event", (data) => {
      console.log("📩 Event received:", data);
    });

    client.connect();

    return () => client.disconnect();
  }, []);

  return <div>Echo Client Running...</div>;
}
```

---

## 📜 License

MIT © 2025 [Jackson Kitsao](https://github.com/jkitsao)

---
