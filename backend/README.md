# Admin Panel Backend (Fixed)

This is the corrected Fastify + Sequelize + MySQL + TypeScript backend (ES Modules).

Install:
```
npm install
```

Run:
```
npm run dev
```

Notes:
- Ensure MySQL is running and accessible with credentials from `.env`.
- `dev` uses `node --loader ts-node/esm src/server.ts`. If you prefer hot reload with `ts-node-dev`, use `npm run dev:legacy`.
