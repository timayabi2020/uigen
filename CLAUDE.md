# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Initial setup (install deps + generate Prisma client + run migrations)
npm run setup

# Development server (Turbopack)
npm run dev

# Build for production
npm run build

# Run all tests
npm test

# Run a single test file
npx vitest run src/lib/__tests__/file-system.test.ts

# Lint
npm run lint

# Reset database
npm run db:reset

# Regenerate Prisma client after schema changes
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

## Architecture

UIGen is a Next.js 15 App Router application where users describe React components in a chat interface and see them rendered live in a preview pane.

### Request flow

1. User types a message in `ChatInterface` → `ChatContext` sends it to `/api/chat` via Vercel AI SDK's `useChat`
2. `/api/chat/route.ts` calls Claude (`claude-haiku-4-5`) with two tools: `str_replace_editor` and `file_manager`
3. Claude uses these tools to create/modify files in a server-side `VirtualFileSystem` instance
4. Tool calls stream back to the client; `FileSystemContext.handleToolCall()` applies them to the client-side `VirtualFileSystem`
5. `PreviewFrame` watches `refreshTrigger` from `FileSystemContext`, compiles the virtual files via Babel (`jsx-transformer.ts`), and renders them in a sandboxed `<iframe>` using an import map with blob URLs

### Virtual file system

`VirtualFileSystem` (`src/lib/file-system.ts`) is an in-memory tree of `FileNode` objects. It is serialized to plain JSON for persistence in Prisma and for transmission in each API request body (`files` field). The server reconstructs it per-request via `deserializeFromNodes`.

### Preview rendering

`src/lib/transform/jsx-transformer.ts` handles client-side compilation:
- `transformJSX`: uses `@babel/standalone` to compile TSX/JSX to JS
- `createImportMap`: builds an ES module import map; local files become blob URLs, third-party packages resolve to `https://esm.sh/<package>`
- `createPreviewHTML`: generates the full iframe HTML with Tailwind CDN, the import map, and an error boundary

### AI provider

`src/lib/provider.ts` exports `getLanguageModel()`. If `ANTHROPIC_API_KEY` is not set, a `MockLanguageModel` is used that returns static component code. The real model is `claude-haiku-4-5`.

### Auth

Custom JWT-based auth (`src/lib/auth.ts`) using `jose`. Sessions are stored in an httpOnly cookie (`auth-token`, 7-day expiry). No auth middleware redirects — anonymous use is supported. Projects save only for authenticated users.

### Data model

Defined in `prisma/schema.prisma` — reference it whenever you need to understand the structure of data stored in the database.

Two Prisma models (SQLite, `prisma/dev.db`):
- `User`: email + bcrypt password
- `Project`: stores `messages` (JSON array) and `data` (serialized `VirtualFileSystem`) as JSON strings; `userId` is optional for anonymous projects

### Context providers

`FileSystemProvider` wraps `ChatProvider`. Both must be present; `ChatProvider` calls `useFileSystem()` internally.

### Path alias

`@/` maps to `src/` (configured in `tsconfig.json`).

### Testing

Vitest with jsdom environment and `@testing-library/react`. Tests live in `__tests__` directories co-located with the code they test.
