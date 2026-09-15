ALTER TABLE "profiles" ADD COLUMN "parent_id" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_parent_id_parent_accounts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parent_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profiles_parent_idx" ON "profiles" USING btree ("parent_id");