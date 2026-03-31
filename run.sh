#!/usr/bin/env bash
set -euo pipefail

echo "== Notes App Runner =="

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)

cd "$ROOT_DIR/backend"

if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    echo "Creating .env from .env.example"
    cp .env.example .env
  fi
fi

if command -v npm >/dev/null 2>&1; then
  echo "Installing backend dependencies..."
  npm ci || npm install
else
  echo "Error: npm is not installed or not in PATH" >&2
  exit 1
fi

echo "Starting backend in development mode on http://localhost:3001 ..."
npm run start:dev
