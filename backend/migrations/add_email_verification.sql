-- Add fields for email verification
ALTER TABLE users
ADD COLUMN IF NOT EXISTS verification_token_hash TEXT,
ADD COLUMN IF NOT EXISTS verification_token_expires_at TIMESTAMPTZ;

-- Index tokens so verification lookups remain efficient
CREATE INDEX IF NOT EXISTS idx_users_verification_token_hash
ON users(verification_token_hash)
WHERE verification_token_hash IS NOT NULL;