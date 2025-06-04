🖥️ Front‑end Dashboard

Stack: React + TypeScript · Vite · Tailwind CSS · Socket.io · Lucide‑react icons

This front‑end provides a real‑time dashboard to monitor and control virtual machines (VMs) running in our Edge platform. It consumes REST endpoints and WebSocket streams exposed by the back‑end micro‑services.

✨ Quick Start

# Clone the monorepo (or this folder only)
$ git clone https://github.com/<org>/<repo>.git
$ cd frontend

# Install dependencies (Node ≥ 18)
$ npm install         # or: pnpm install | yarn install

# Copy environment template then adjust it
$ cp .env.example .env

# ‼️ Start the **WebSocket relay** first (bridges Spring Boot → Socket.io)
$ node index.js   # listens on port 3000

# In a second terminal: run the Vite dev server 
$ npm run dev     # opens http://localhost:5173

Open http://localhost:5173 and you should see the VM dashboard updating live.

The relay listens to Spring‑Boot metrics on ws://localhost:8090/ws/vms and re‑emits them to the browser on Socket.io (3000). fileciteturn0file0

🔧 Environment Variables

Create a `` file at the project root (Vite prefixes must be VITE_). Example:

# Server that exposes REST APIs
VITE_API_URL=http://localhost:8080

# Socket.io relay (see index.js)
VITE_SOCKET_URL=http://localhost:3000



📂 Notable Source Files

Path

Purpose

index.js

Node/Express + Socket.io server that relays VM metrics & logs fileciteturn0file0

src/pages/VirtualMachinesPage.tsx

Live list of VMs with search, filters, WebSocket metrics fileciteturn0file2

src/pages/LogManagementPage.tsx

Tail‑f like log viewer per VM fileciteturn0file1

src/hooks/useWebSocket.ts

Custom React hook that wraps Socket.io

src/services/api.ts

Tiny REST helper for fetchVirtualMachines()

Tailwind CSS classes are used throughout for styling; icons come from lucide‑react.

🏗️ Build & Deploy

# Production bundle (~/dist)
$ npm run build

# Locally preview the bundle on http://localhost:4173
$ npm run preview

Deploy the contents of the `` folder to any static host (Nginx, Netlify, S3 + CloudFront, etc.). Remember to set correct CORS and reverse‑proxy rules for /socket.io and /api endpoints.

Docker (optional)

A minimal image (multi‑stage) could look like:

FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

🛠️ Useful NPM Scripts

Script

What it does

npm run dev

Launch Vite with hot‑module‑reload

npm run build

Build production assets (minified)

npm run preview

Serve built assets locally

npm run lint

ESLint + Prettier check (if configured)

npm run test

Run unit tests (Jest / Vitest)

❓ Troubleshooting

Symptom

Fix

``** CORS error**

Ensure VITE_API_URL & VITE_SOCKET_URL point to the correct hosts and that back‑end sets CORS headers.

No live metrics / logs

Confirm index.js is running (node index.js) and Spring Boot WebSocket endpoint is reachable at localhost:8090.

npm run dev fails on port 5173

Change default port: npm run dev -- --port 5174 and update VITE_SOCKET_URL origin accordingly.


