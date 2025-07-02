CREATE TABLE IF NOT EXISTS "Tasks" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR(200) NOT NULL,
  "description" TEXT,
  "priority" VARCHAR(20) DEFAULT 'medium' CHECK ("priority" IN ('low', 'medium', 'high', 'urgent')),
  "status" VARCHAR(20) DEFAULT 'todo' CHECK ("status" IN ('todo', 'in_progress', 'completed')),
  "dueDate" TIMESTAMP WITH TIME ZONE,
  "completedAt" TIMESTAMP WITH TIME ZONE,
  "projectId" UUID NOT NULL REFERENCES "Projects"("id") ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON "Tasks"("projectId");
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON "Tasks"("userId");
CREATE INDEX IF NOT EXISTS idx_tasks_status ON "Tasks"("status");
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON "Tasks"("dueDate");