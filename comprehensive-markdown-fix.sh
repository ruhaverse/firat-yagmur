#!/bin/bash

echo "🔧 Markdown dosyalarını düzeltiliyor..."

# Fix all markdown files
for file in *.md backend/*.md Shareup-frontend/*.md 2>/dev/null; do
    if [ -f "$file" ]; then
        echo "Processing: $file"
        
        # Create temp file
        temp="${file}.tmp"
        
        # Read and process line by line
        awk '
        BEGIN { prev_blank = 1; in_code = 0; }
        
        # Track code blocks
        /^```/ || /^````/ { 
            if (in_code == 0) {
                if (prev_blank == 0) print "";
                in_code = 1;
            } else {
                in_code = 0;
                print;
                print "";
                next;
            }
        }
        
        # Headings need blank lines
        /^###/ || /^####/ || /^#####/ {
            if (prev_blank == 0 && in_code == 0) print "";
            print;
            print "";
            prev_blank = 1;
            next;
        }
        
        # Lists need blank lines before/after
        /^[0-9]+\./ || /^[-*]/ {
            if (prev_blank == 0 && in_code == 0 && NR > 1) print "";
        }
        
        # Track blank lines
        /^$/ { prev_blank = 1; }
        !/^$/ { prev_blank = 0; }
        
        { print }
        ' "$file" > "$temp"
        
        # Replace original
        mv "$temp" "$file"
        
        # Fix language-less code blocks
        sed -i 's/^```$/```text/' "$file"
        
        # Clean multiple blanks
        sed -i '/^$/N;/^\n$/D' "$file"
        
        # Ensure single trailing newline
        sed -i -e '$a\' "$file"
    fi
done

echo "✅ Tüm markdown dosyaları düzeltildi!"
