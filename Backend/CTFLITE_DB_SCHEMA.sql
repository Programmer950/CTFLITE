-- =========================================
-- CTF PLATFORM DATABASE SCHEMA
-- Supports: Individual + Team Mode
-- =========================================

-- =====================
-- USERS
-- =====================
CREATE TABLE users (
id SERIAL PRIMARY KEY,
username TEXT UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- TEAMS
-- =====================
CREATE TABLE teams (
id SERIAL PRIMARY KEY,
name TEXT UNIQUE NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- TEAM MEMBERS
-- =====================
CREATE TABLE team_members (
user_id INT REFERENCES users(id) ON DELETE CASCADE,
team_id INT REFERENCES teams(id) ON DELETE CASCADE,
role TEXT DEFAULT 'member',
PRIMARY KEY (user_id, team_id)
);

-- =====================
-- PARTICIPANTS (CORE ABSTRACTION)
-- =====================
CREATE TABLE participants (
id SERIAL PRIMARY KEY,
type TEXT NOT NULL CHECK (type IN ('user', 'team')),
user_id INT UNIQUE,
team_id INT UNIQUE
);

-- =====================
-- EVENTS
-- =====================
CREATE TABLE events (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
mode TEXT CHECK (mode IN ('individual', 'team')),
start_time TIMESTAMP,
end_time TIMESTAMP
);

-- =====================
-- CHALLENGES
-- =====================
CREATE TABLE challenges (
id SERIAL PRIMARY KEY,
event_id INT REFERENCES events(id) ON DELETE CASCADE,
title TEXT NOT NULL,
description TEXT,
points INT NOT NULL,
flag_hash TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- SUBMISSIONS
-- =====================
CREATE TABLE submissions (
id SERIAL PRIMARY KEY,
participant_id INT REFERENCES participants(id) ON DELETE CASCADE,
challenge_id INT REFERENCES challenges(id) ON DELETE CASCADE,
is_correct BOOLEAN NOT NULL,
submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- CONSTRAINTS
-- =====================

-- Prevent duplicate correct solves
CREATE UNIQUE INDEX unique_correct_submission
ON submissions(participant_id, challenge_id)
WHERE is_correct = true;

-- =====================
-- INDEXES (PERFORMANCE)
-- =====================
CREATE INDEX idx_submissions_participant ON submissions(participant_id);
CREATE INDEX idx_submissions_challenge ON submissions(challenge_id);
