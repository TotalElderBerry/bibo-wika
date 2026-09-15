CREATE TABLE IF NOT EXISTS "parent_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parent_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"parent_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parent_sessions" ADD CONSTRAINT "parent_sessions_parent_id_parent_accounts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parent_accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "parent_accounts_email_idx" ON "parent_accounts" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "parent_sessions_parent_idx" ON "parent_sessions" USING btree ("parent_id");
