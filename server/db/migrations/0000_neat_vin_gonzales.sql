CREATE TYPE "public"."audio_status" AS ENUM('pending', 'recorded', 'approved');--> statement-breakpoint
CREATE TYPE "public"."band" AS ENUM('usbong', 'puno');--> statement-breakpoint
CREATE TYPE "public"."lang" AS ENUM('tl', 'ceb', 'ilo', 'hil');--> statement-breakpoint
CREATE TABLE "concepts" (
	"id" text PRIMARY KEY NOT NULL,
	"topic" text NOT NULL,
	"bands" "band"[] NOT NULL,
	"en" text NOT NULL,
	"art" text NOT NULL,
	"ord" smallint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"concept_id" text NOT NULL,
	"lang" "lang" NOT NULL,
	"text" text NOT NULL,
	"respell" text NOT NULL,
	"ipa" text,
	"variants" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"audio_key" text,
	"status" "audio_status" DEFAULT 'pending' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "forms_concept_id_lang_pk" PRIMARY KEY("concept_id","lang")
);
--> statement-breakpoint
CREATE TABLE "parent_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parent_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"parent_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"band" "band" DEFAULT 'usbong' NOT NULL,
	"avatar" jsonb NOT NULL,
	"active_lang" "lang" DEFAULT 'tl' NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "progress" (
	"profile_id" text NOT NULL,
	"concept_id" text NOT NULL,
	"lang" "lang" NOT NULL,
	"box" smallint DEFAULT 1 NOT NULL,
	"due_at" timestamp with time zone DEFAULT now() NOT NULL,
	"seen" integer DEFAULT 0 NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"median_ms" integer,
	CONSTRAINT "progress_profile_id_concept_id_lang_pk" PRIMARY KEY("profile_id","concept_id","lang")
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"slug" text PRIMARY KEY NOT NULL,
	"en" text NOT NULL,
	"art" text NOT NULL,
	"title" jsonb NOT NULL,
	"ord" smallint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "concepts" ADD CONSTRAINT "concepts_topic_topics_slug_fk" FOREIGN KEY ("topic") REFERENCES "public"."topics"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_sessions" ADD CONSTRAINT "parent_sessions_parent_id_parent_accounts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parent_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "concepts_topic_idx" ON "concepts" USING btree ("topic");--> statement-breakpoint
CREATE INDEX "forms_status_idx" ON "forms" USING btree ("lang","status");--> statement-breakpoint
CREATE UNIQUE INDEX "parent_accounts_email_idx" ON "parent_accounts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "parent_sessions_parent_idx" ON "parent_sessions" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "progress_due_idx" ON "progress" USING btree ("profile_id","due_at");