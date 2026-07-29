-- Add the new profile columns as nullable so existing users can be backfilled safely.
ALTER TABLE "users"
ADD COLUMN "firstName" TEXT,
ADD COLUMN "middleName" TEXT,
ADD COLUMN "lastName" TEXT,
ADD COLUMN "suffix" TEXT,
ADD COLUMN "headline" TEXT,
ADD COLUMN "phone" TEXT,
ADD COLUMN "location" TEXT,
ADD COLUMN "avatarUrl" TEXT,
ADD COLUMN "avatarPublicId" TEXT,
ADD COLUMN "linkedinUrl" TEXT,
ADD COLUMN "githubUrl" TEXT,
ADD COLUMN "portfolioUrl" TEXT;

-- Legacy full names cannot be split perfectly. For multi-part names, the last
-- whitespace-delimited token is treated as lastName and everything before it
-- as firstName. middleName and suffix intentionally remain NULL for manual
-- correction. Blank or one-word legacy records receive a reviewable fallback.
UPDATE "users"
SET
  "firstName" = CASE
    WHEN NULLIF(BTRIM("name"), '') IS NULL THEN 'ApplyFlow'
    WHEN BTRIM("name") ~ '\s' THEN REGEXP_REPLACE(BTRIM("name"), '\s+\S+$', '')
    ELSE BTRIM("name")
  END,
  "lastName" = CASE
    WHEN NULLIF(BTRIM("name"), '') IS NULL THEN 'User'
    WHEN BTRIM("name") ~ '\s' THEN REGEXP_REPLACE(BTRIM("name"), '^.*\s+', '')
    ELSE 'User'
  END;

ALTER TABLE "users"
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;

-- Keep the legacy name column for this compatibility migration. Remove it in a
-- later migration after the backfilled records have been reviewed.
