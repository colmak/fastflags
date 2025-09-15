-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."GameSessionType" AS ENUM ('LEARNING', 'MULTIPLAYER', 'TOURNAMENT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."GameSessionStatus" AS ENUM ('WAITING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."LeaderboardPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'ALL_TIME', 'SEASONAL');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "preferences" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_active" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMP(3),
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_stats" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_games" INTEGER NOT NULL DEFAULT 0,
    "total_wins" INTEGER NOT NULL DEFAULT 0,
    "total_losses" INTEGER NOT NULL DEFAULT 0,
    "best_score" INTEGER NOT NULL DEFAULT 0,
    "best_streak" INTEGER NOT NULL DEFAULT 0,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER NOT NULL DEFAULT 1200,
    "rating_history" JSONB,
    "time_played" INTEGER NOT NULL DEFAULT 0,
    "flags_mastered" INTEGER NOT NULL DEFAULT 0,
    "perfect_games" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."content_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "region" TEXT,
    "population" BIGINT,
    "area_km2" DOUBLE PRECISION,
    "capital" TEXT,
    "languages" TEXT[],
    "currencies" TEXT[],
    "metadata" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."content_items" (
    "id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "content_type_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "primary_url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "alternative_urls" JSONB,
    "difficulty" INTEGER NOT NULL,
    "tags" TEXT[],
    "properties" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."game_sessions" (
    "id" TEXT NOT NULL,
    "type" "public"."GameSessionType" NOT NULL,
    "mode" TEXT,
    "status" "public"."GameSessionStatus" NOT NULL,
    "room_code" TEXT,
    "max_players" INTEGER NOT NULL DEFAULT 2,
    "time_limit" INTEGER NOT NULL DEFAULT 60,
    "question_count" INTEGER NOT NULL DEFAULT 10,
    "content_type_id" TEXT NOT NULL,
    "settings" JSONB,
    "metadata" JSONB,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."game_participants" (
    "id" TEXT NOT NULL,
    "game_session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "correct_answers" INTEGER NOT NULL DEFAULT 0,
    "wrong_answers" INTEGER NOT NULL DEFAULT 0,
    "bonus_points" INTEGER NOT NULL DEFAULT 0,
    "final_rank" INTEGER,
    "rating_change" INTEGER NOT NULL DEFAULT 0,
    "performance_data" JSONB,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "game_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."game_questions" (
    "id" TEXT NOT NULL,
    "game_session_id" TEXT NOT NULL,
    "content_item_id" TEXT NOT NULL,
    "question_order" INTEGER NOT NULL,
    "question_text" TEXT,
    "answer_options" JSONB,
    "correct_answers" TEXT[],
    "points_value" INTEGER NOT NULL DEFAULT 1,
    "time_limit" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_answers" (
    "id" TEXT NOT NULL,
    "game_participant_id" TEXT NOT NULL,
    "game_question_id" TEXT NOT NULL,
    "user_answer" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "is_partial" BOOLEAN NOT NULL DEFAULT false,
    "confidence_score" DOUBLE PRECISION,
    "time_taken" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "hint_used" BOOLEAN NOT NULL DEFAULT false,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."learning_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content_item_id" TEXT NOT NULL,
    "times_seen" INTEGER NOT NULL DEFAULT 0,
    "times_correct" INTEGER NOT NULL DEFAULT 0,
    "times_incorrect" INTEGER NOT NULL DEFAULT 0,
    "last_seen" TIMESTAMP(3) NOT NULL,
    "last_correct" TIMESTAMP(3),
    "best_time" INTEGER,
    "average_time" INTEGER,
    "mastery_level" INTEGER NOT NULL DEFAULT 0,
    "next_review" TIMESTAMP(3),
    "difficulty_override" INTEGER,
    "notes" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."leaderboards" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "period" "public"."LeaderboardPeriod" NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "additional_metrics" JSONB,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaderboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_accessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."achievements" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon_url" TEXT,
    "category" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "reward_type" TEXT,
    "reward_value" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_secret" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_achievements" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "achievement_id" TEXT NOT NULL,
    "progress" JSONB,
    "earned_at" TIMESTAMP(3),
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "session_id" TEXT,
    "event_type" TEXT NOT NULL,
    "event_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "public"."accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "public"."accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_stats_user_id_key" ON "public"."user_stats"("user_id");

-- CreateIndex
CREATE INDEX "user_stats_rating_idx" ON "public"."user_stats"("rating");

-- CreateIndex
CREATE INDEX "user_stats_total_games_idx" ON "public"."user_stats"("total_games");

-- CreateIndex
CREATE UNIQUE INDEX "content_types_name_key" ON "public"."content_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "public"."countries"("code");

-- CreateIndex
CREATE INDEX "countries_continent_idx" ON "public"."countries"("continent");

-- CreateIndex
CREATE INDEX "countries_region_idx" ON "public"."countries"("region");

-- CreateIndex
CREATE INDEX "content_items_content_type_id_idx" ON "public"."content_items"("content_type_id");

-- CreateIndex
CREATE INDEX "content_items_difficulty_idx" ON "public"."content_items"("difficulty");

-- CreateIndex
CREATE INDEX "content_items_tags_idx" ON "public"."content_items"("tags");

-- CreateIndex
CREATE UNIQUE INDEX "content_items_country_id_content_type_id_key" ON "public"."content_items"("country_id", "content_type_id");

-- CreateIndex
CREATE INDEX "game_sessions_type_status_idx" ON "public"."game_sessions"("type", "status");

-- CreateIndex
CREATE INDEX "game_sessions_room_code_idx" ON "public"."game_sessions"("room_code");

-- CreateIndex
CREATE INDEX "game_participants_user_id_idx" ON "public"."game_participants"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_participants_game_session_id_user_id_key" ON "public"."game_participants"("game_session_id", "user_id");

-- CreateIndex
CREATE INDEX "game_questions_game_session_id_question_order_idx" ON "public"."game_questions"("game_session_id", "question_order");

-- CreateIndex
CREATE INDEX "user_answers_game_participant_id_idx" ON "public"."user_answers"("game_participant_id");

-- CreateIndex
CREATE INDEX "user_answers_is_correct_idx" ON "public"."user_answers"("is_correct");

-- CreateIndex
CREATE INDEX "learning_progress_user_id_mastery_level_idx" ON "public"."learning_progress"("user_id", "mastery_level");

-- CreateIndex
CREATE INDEX "learning_progress_next_review_idx" ON "public"."learning_progress"("next_review");

-- CreateIndex
CREATE UNIQUE INDEX "learning_progress_user_id_content_item_id_key" ON "public"."learning_progress"("user_id", "content_item_id");

-- CreateIndex
CREATE INDEX "leaderboards_category_period_rank_idx" ON "public"."leaderboards"("category", "period", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboards_user_id_category_period_period_start_key" ON "public"."leaderboards"("user_id", "category", "period", "period_start");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "public"."sessions"("session_token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "public"."sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_expires_idx" ON "public"."sessions"("expires");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_key_key" ON "public"."achievements"("key");

-- CreateIndex
CREATE INDEX "achievements_category_idx" ON "public"."achievements"("category");

-- CreateIndex
CREATE INDEX "user_achievements_user_id_earned_at_idx" ON "public"."user_achievements"("user_id", "earned_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_user_id_achievement_id_key" ON "public"."user_achievements"("user_id", "achievement_id");

-- CreateIndex
CREATE INDEX "settings_user_id_category_idx" ON "public"."settings"("user_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "settings_user_id_category_key_key" ON "public"."settings"("user_id", "category", "key");

-- CreateIndex
CREATE INDEX "events_event_type_created_at_idx" ON "public"."events"("event_type", "created_at");

-- CreateIndex
CREATE INDEX "events_user_id_created_at_idx" ON "public"."events"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_stats" ADD CONSTRAINT "user_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."content_items" ADD CONSTRAINT "content_items_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."content_items" ADD CONSTRAINT "content_items_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "public"."content_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_sessions" ADD CONSTRAINT "game_sessions_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "public"."content_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_sessions" ADD CONSTRAINT "game_sessions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_participants" ADD CONSTRAINT "game_participants_game_session_id_fkey" FOREIGN KEY ("game_session_id") REFERENCES "public"."game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_participants" ADD CONSTRAINT "game_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_questions" ADD CONSTRAINT "game_questions_game_session_id_fkey" FOREIGN KEY ("game_session_id") REFERENCES "public"."game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_questions" ADD CONSTRAINT "game_questions_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "public"."content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_answers" ADD CONSTRAINT "user_answers_game_participant_id_fkey" FOREIGN KEY ("game_participant_id") REFERENCES "public"."game_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_answers" ADD CONSTRAINT "user_answers_game_question_id_fkey" FOREIGN KEY ("game_question_id") REFERENCES "public"."game_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."learning_progress" ADD CONSTRAINT "learning_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."learning_progress" ADD CONSTRAINT "learning_progress_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "public"."content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."leaderboards" ADD CONSTRAINT "leaderboards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_achievements" ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."settings" ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

