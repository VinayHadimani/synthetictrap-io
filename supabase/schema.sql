-- ============================================
-- SyntheticTrap — Database Schema
-- Version: 1.0
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================

-- Ensure pgcrypto extension exists for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----- personas: AI-generated honeypot customer records -----
CREATE TABLE IF NOT EXISTS personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  card_number text NOT NULL,
  card_cvv text NOT NULL,
  card_expiry text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  date_of_birth date NOT NULL,
  backstory text,
  trap_signature text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ----- customers: dummy "real" customer records -----
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  card_number text,
  created_at timestamptz DEFAULT now()
);

-- ----- breach_events: logged trap triggers -----
CREATE TABLE IF NOT EXISTS breach_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id uuid REFERENCES personas(id) ON DELETE CASCADE,
  source_ip text,
  user_agent text,
  trigger_type text,
  trigger_url text,
  attacker_location jsonb,
  occurred_at timestamptz DEFAULT now(),
  payload jsonb,
  detected_within_ms integer
);

-- ----- Realtime: enable on breach_events (idempotent) -----
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'breach_events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE breach_events;
  END IF;
END $$;

-- ----- Indexes -----
CREATE INDEX IF NOT EXISTS idx_personas_signature ON personas(trap_signature);
CREATE INDEX IF NOT EXISTS idx_breach_events_persona ON breach_events(persona_id);
CREATE INDEX IF NOT EXISTS idx_breach_events_time ON breach_events(occurred_at DESC);

-- ----- Row Level Security -----
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE breach_events ENABLE ROW LEVEL SECURITY;

-- ----- Policies: anon can READ (dashboard uses anon key for realtime subscriptions) -----
-- All writes go through the service_role key server-side only.

DROP POLICY IF EXISTS "Anyone can read customers" ON customers;
CREATE POLICY "Anyone can read customers" ON customers
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Anyone can read personas" ON personas;
CREATE POLICY "Anyone can read personas" ON personas
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Anyone can read breach_events" ON breach_events;
CREATE POLICY "Anyone can read breach_events" ON breach_events
  FOR SELECT TO anon USING (true);

-- ============================================
-- End of schema. Expected result: 3 tables, 1 realtime publication entry, 6 indexes/policies.
-- ============================================
