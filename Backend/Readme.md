# 🏴‍☠️ CTF Platform Backend API Guide

## Running Backend Using Docker

- **Open Termninal in Backend directory and run command:**
```
docker compose up --build
```
- **Backend would be live at http://localhost:8080**

## 🌐 Base URL

### http://localhost:8080

## 🔐 Authentication

### All protected endpoints require:
### Authorization: Bearer <JWT_TOKEN>

# 🧑‍💻 AUTH APIs

## 🟢 Register

```
POST /api/register
```
```
Body
{
"username": "user1",
"password": "password123"
}
```
## 🔵 Login
```
POST /api/login
```
```
Body
{
"username": "user1",
"password": "password123"
}
```
### Response
```
{
"token": "JWT_TOKEN"
}
```

# 🧩 CHALLENGE APIs
## 🟢 Get All Challenges

```
GET /api/challenges
```

### Response
```
[
{
"id": 1,
"title": "SQL Injection",
"description": "Basic test",
"category": "web",
"difficulty": "easy",
"points": 100,
"solved": false,
"solve_count": 12
}
]
```
## 🔵 Get Challenge Details

```
GET /api/challenges/:id
```

## 🚩 SUBMISSION API
### 🟢 Submit Flag

```
POST /api/submit
```

```
Body
{
"challenge_id": 1,
"flag": "flag{example}"
}
Success Response
{
"result": "correct"
}
Failure Response
{
"result": "wrong or already solved"
}
Possible Errors
{
"error": "slow down"
}
{
"error": "too many attempts"
}
```

## 🏆 SCOREBOARD
### 🟢 Get Leaderboard

```
GET /api/scoreboard
```

```
Response
[
{
"rank": 1,
"name": "team1",
"type": "team",
"score": 500
}
]
```

# 👥 TEAM APIs (Only in Team Mode)
## 🟢 Create Team

```
POST /api/teams
```

```
Body
{
"name": "hackers"
}
```

## 🔵 Join Team

```
POST /api/teams/join
```
```
Body
{
"team_id": 1
}
```

## 🟡 Leave Team

```
POST /api/teams/leave
```

## 🔴 Delete Team (Owner Only)

```
DELETE /api/teams/:id
```

## 🟣 Get My Team

```
GET /api/teams/me
```

### Response
```
{
"team_id": 1,
"team_name": "hackers",
"members": [
{
"id": 1,
"username": "user1",
"role": "owner"
},
{
"id": 2,
"username": "user2",
"role": "member"
}
]
}
```
# ⚙️ ADMIN APIs (Admin Only)
## 🟢 Create Challenge

```
POST /admin/challenges
```
## 🔵 Get All Challenges

```
GET /admin/challenges
```

## 🟡 Update Challenge

```
PUT /admin/challenges/:id
```

## 🔴 Delete Challenge

```
DELETE /admin/challenges/:id
```

## 🟣 Reset Submissions

```
DELETE /admin/submissions
```

## 🟠 Reset Leaderboard

```
POST /admin/reset-leaderboard
```

# 🔵 Rebuild Leaderboard

```
POST /admin/rebuild-leaderboard
```

# Code	Meaning
- **400	Bad request**

- **401	Unauthorized**
- **403	Forbidden**
- **429	Rate limited**

# 5. Rate Limiting

## Response:
```
{ "error": "slow down" }
```