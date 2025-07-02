CREATE TABLE IF NOT EXISTS "TimeEntries" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
  "endTime" TIMESTAMP WITH TIME ZONE,
  "duration" INTEGER, -- Duration in seconds
  "description" TEXT,
  "taskId" UUID NOT NULL REFERENCES "Tasks"("id") ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_time_entries_task_id ON "TimeEntries"("taskId");
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON "TimeEntries"("userId");
CREATE INDEX IF NOT EXISTS idx_time_entries_start_time ON "TimeEntries"("startTime");