#!/usr/bin/env sh
set -e

# Run DB migrations then start the app. Useful as container entrypoint.
echo "Running migrations..."
if [ -f ./node_modules/.bin/ ]; then
  # migrate script uses node
  npm run migrate || echo "Migrate command failed or no DB available yet"
fi

echo "Starting application..."
node src/index.js
