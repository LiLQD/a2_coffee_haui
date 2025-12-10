#!/bin/bash

OUTPUT="codebase_full.txt"
> $OUTPUT

echo "=== PROJECT STRUCTURE ===" >> $OUTPUT
tree -I 'node_modules|dist|build|.git' -L 4 >> $OUTPUT
echo -e "\n\n" >> $OUTPUT

echo "=== BACKEND FILES ===" >> $OUTPUT
find backend/src -type f -name "*.js" | while read file; do
  echo "
==================== $file ====================" >> $OUTPUT
  cat "$file" >> $OUTPUT
  echo -e "\n\n" >> $OUTPUT
done

echo "=== FRONTEND FILES ===" >> $OUTPUT
find frontend/src -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.css" \) | while read file; do
  echo "
==================== $file ====================" >> $OUTPUT
  cat "$file" >> $OUTPUT
  echo -e "\n\n" >> $OUTPUT
done

echo "=== CONFIGURATION FILES ===" >> $OUTPUT
for file in backend/package.json frontend/package.json backend/.env.example; do
  if [ -f "$file" ]; then
    echo "
==================== $file ====================" >> $OUTPUT
    cat "$file" >> $OUTPUT
    echo -e "\n\n" >> $OUTPUT
  fi
done

echo "✅ Created $OUTPUT"
