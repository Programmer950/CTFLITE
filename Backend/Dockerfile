# ---------- BUILD STAGE ----------
FROM golang:1.26.1 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

COPY config.json /app/config.json

RUN go build -o main ./cmd

# ---------- RUN STAGE ----------
FROM debian:bookworm-slim

WORKDIR /app

COPY --from=builder /app/main .

# 🔥 ADD THIS LINE (THIS IS THE FIX)
COPY --from=builder /app/config.json ./config.json

EXPOSE 8080

CMD ["./main"]