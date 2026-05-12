ALTER TABLE "videos" ALTER COLUMN "category" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "created_at" SET DEFAULT now();