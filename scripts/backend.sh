#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

start() {
  echo "Starting backend..."
  docker compose up -d

  echo "Waiting for database (30 sec)..."
  sleep 30

  if curl -sf "http://localhost:3000/api/articles" | grep -q '"slug"'; then
    echo "Backend is ready: http://localhost:3000/api/articles"
    return
  fi

  echo "Initializing database..."
  docker compose run --rm api npm run db:reset

  echo "Backend is ready: http://localhost:3000/api/articles"
}

stop() {
  docker compose down
  echo "Backend stopped."
}

reset() {
  docker compose run --rm api npm run db:reset
  echo "Database reset."
}

case "${1:-start}" in
  start) start ;;
  stop) stop ;;
  reset) reset ;;
  *)
    echo "Usage: npm run backend -- [start|stop|reset]"
    exit 1
    ;;
esac
