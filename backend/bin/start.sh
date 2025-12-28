#!/usr/bin/env sh
set -e

# Run DB migrations then start the app. Useful as container entrypoint.
echo "Running migrations..."

# Try running migrations with retries while DB may be coming up.
MAX_RETRIES=15
SLEEP_SECONDS=2
COUNT=0
until [ "$COUNT" -ge "$MAX_RETRIES" ]
do
  if npm run migrate; then
    echo "Migrations succeeded"
    break
  else
    COUNT=$((COUNT+1))
    echo "Migrate attempt $COUNT/$MAX_RETRIES failed; retrying in $SLEEP_SECONDS seconds..."
    sleep $SLEEP_SECONDS
  fi
done

if [ "$COUNT" -ge "$MAX_RETRIES" ]; then
  echo "Migrations did not succeed after $MAX_RETRIES attempts; continuing to start the app"
fi

echo "Starting application..."
exec node src/index.js
