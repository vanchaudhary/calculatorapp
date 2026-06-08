---
applyTo: prisma/migrations/**, db/migrations/**, migrations/**
---

# Database Migration Instructions

> This file loads ONLY when editing database migrations (Prisma, Flyway, TypeORM, etc.). It does not appear when editing application code.

## Migration Safety Rules

### ❌ NEVER Do This

- Drop a column without a backfill strategy
- Rename a column without writing a migration that copies data
- Delete a table in production
- Make a nullable column non-nullable without backfilling
- Change column type without testing data conversion

### ✅ Always Do This

- Write both `up()` and `down()` for every migration
- Test migrations on production-like data volume first
- Document data transformations in migration comments
- Keep migrations small and focused (one schema change per migration)
- Review migrations with another team member before production

## Migration Pattern Examples

### Add Column (nullable, safe)
```sql
-- migration: add_user_status
ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'active';

-- down (reverse)
ALTER TABLE users DROP COLUMN status;
```

### Add Column (non-nullable, requires backfill)
```sql
-- migration: add_user_role_non_nullable
-- Step 1: Add nullable column
ALTER TABLE users ADD COLUMN role VARCHAR(50);

-- Step 2: Backfill existing rows (in up migration)
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Step 3: Make not-nullable
ALTER TABLE users ALTER COLUMN role SET NOT NULL;

-- down (reverse, undo in reverse order)
ALTER TABLE users ALTER COLUMN role DROP NOT NULL;
ALTER TABLE users DROP COLUMN role;
```

### Rename Column (with data copy)
```sql
-- migration: rename_user_username_to_handle
-- Step 1: Add new column with data from old column
ALTER TABLE users ADD COLUMN handle VARCHAR(255);
UPDATE users SET handle = username;

-- Step 2: Drop old column (in a separate migration, after code is deployed)
-- (This prevents race conditions between old and new code)

-- down
ALTER TABLE users DROP COLUMN handle;
```

## Prisma-Specific

- Use `prisma migrate dev --name migration_name` to generate migrations
- Always review generated migration before committing
- Add comments explaining the business logic:
  ```prisma
  // Migration: Add premium user tier
  // Backfill: All existing users default to 'free' tier
  model User {
    // ...
    tier String @default("free") // "free" or "premium"
  }
  ```

## TypeORM-Specific

- Generate with `typeorm migration:generate`
- Follow the same safety rules as SQL migrations
- Test with `queryRunner` before applying:
  ```typescript
  await queryRunner.query(`UPDATE users SET status = 'active'`);
  ```

## Testing Migrations

- Before running in production:
  1. Dump production data
  2. Run migration locally on production-like data
  3. Verify row counts and data integrity
  4. Time the migration (if >30 seconds on large tables, plan for downtime)
  5. Plan rollback strategy if migration fails

## Rollback Strategy

- Keep `down()` migrations as simple as the `up()` migration
- Do NOT delete old migrations after they're deployed
- Test rollback locally before deploying

---

**Token Cost:** This file loads only in migration files, not in application code or tests.
