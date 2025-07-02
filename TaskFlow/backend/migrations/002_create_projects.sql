CREATE TABLE IF NOT EXISTS "Projects" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "color" VARCHAR(7) DEFAULT '#3B82F6',
  "status" VARCHAR(20) DEFAULT 'active' CHECK ("status" IN ('active', 'completed', 'archived')),
  "userId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON "Projects"("userId");
CREATE INDEX IF NOT EXISTS idx_projects_status ON "Projects"("status");