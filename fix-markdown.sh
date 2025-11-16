#!/bin/bash
# Fix FRONTEND-CLEANUP-REPORT.md markdown formatting issues

FILE="FRONTEND-CLEANUP-REPORT.md"

# Backup
cp "$FILE" "${FILE}.bak"

# Fix: Add blank lines around headings (MD022)
# Fix: Add blank lines around code fences (MD031)
# Fix: Add blank lines around lists (MD032)

sed -i 's/^###/\n###/g' "$FILE"
sed -i 's/^####/\n####/g' "$FILE"
sed -i '/^```/i\\' "$FILE"
sed -i '/^```/a\\' "$FILE"
sed -i '/^````/i\\' "$FILE"
sed -i '/^````/a\\' "$FILE"

# Fix: Add language to fences (MD040)
sed -i 's/^```$/```text/g' "$FILE"

# Clean up multiple blank lines
sed -i '/^$/N;/^\n$/D' "$FILE"

echo "✅ Fixed markdown formatting in $FILE"
