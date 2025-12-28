#!/bin/sh
set -e

required_vars="DATABASE_URL JWT_SECRET PORT"
missing=0
for v in $required_vars; do
  if [ -z "$(printenv $v)" ]; then
    echo "Missing required env: $v"
    missing=1
  fi
done

if [ "$missing" -eq 1 ]; then
  echo "Aborting: set required environment variables or supply a .env file." >&2
  exit 1
fi

# Warn on default JWT_SECRET
if [ "$JWT_SECRET" = "change_this_to_a_strong_secret" ] || [ "$JWT_SECRET" = "secret" ]; then
  echo "WARNING: Using default JWT_SECRET. Replace with a strong secret." >&2
fi

exec node index.js
