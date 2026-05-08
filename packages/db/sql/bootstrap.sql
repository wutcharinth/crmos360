-- Run ONCE in Supabase SQL Editor (or via psql) before the first `pnpm db:push`.
-- Enables required Postgres extensions.

create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- HNSW index for vector similarity is created by Drizzle migrations on customer_memory.embedding.
-- After running `pnpm db:push`, create the HNSW index manually:
-- create index on public.customer_memory using hnsw (embedding vector_cosine_ops);
