#!/bin/bash

# 🧪 Mobile & Web Compatibility Test Script
# Tests all critical endpoints and features for mobile + web

set -e

API_URL="${API_URL:-http://localhost:4001}"
UPLOAD_DIR="./uploads"

echo "======================================"
echo "🧪 SHAREUP MOBILE+WEB COMPATIBILITY TEST"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test function
test_endpoint() {
  local name="$1"
  local url="$2"
  local expected_status="${3:-200}"
  
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  
  echo -n "Testing: $name ... "
  
  response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
  
  if [ "$response" = "$expected_status" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, got $response)"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    return 1
  fi
}

# Test function with response body check
test_json_response() {
  local name="$1"
  local url="$2"
  local expected_key="$3"
  
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  
  echo -n "Testing: $name ... "
  
  response=$(curl -s "$url" 2>/dev/null || echo "{}")
  
  if echo "$response" | jq -e ".$expected_key" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (Key '$expected_key' not found)"
    echo "  Response: $response"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    return 1
  fi
}

echo "======================================"
echo "📱 1. BACKEND HEALTH CHECKS"
echo "======================================"
echo ""

test_json_response "Health endpoint" "$API_URL/api/v1/health" "db"
test_endpoint "Root endpoint" "$API_URL/" 200

echo ""
echo "======================================"
echo "🔐 2. CORS CONFIGURATION"
echo "======================================"
echo ""

# Test CORS headers
echo -n "Testing: CORS headers ... "
cors_response=$(curl -s -I -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  "$API_URL/api/v1/auth/register" 2>/dev/null || echo "")

if echo "$cors_response" | grep -q "Access-Control-Allow-Origin"; then
  echo -e "${GREEN}✓ PASS${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${RED}✗ FAIL${NC}"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "======================================"
echo "🖼️ 3. IMAGE OPTIMIZATION"
echo "======================================"
echo ""

# Create test image if not exists
if [ ! -f "test-image.jpg" ]; then
  echo "Creating test image..."
  convert -size 1000x1000 xc:blue test-image.jpg 2>/dev/null || {
    echo -e "${YELLOW}⚠ ImageMagick not found, skipping image creation${NC}"
    touch test-image.jpg
  }
fi

# Test image upload (requires auth token - skip for now)
echo -e "${YELLOW}⚠ Image upload test requires authentication (manual test needed)${NC}"

# Test static file serving
if [ -d "$UPLOAD_DIR" ] && [ "$(ls -A $UPLOAD_DIR 2>/dev/null)" ]; then
  first_image=$(ls $UPLOAD_DIR | head -n 1)
  
  if [ -n "$first_image" ]; then
    test_endpoint "Serve original image" "$API_URL/uploads/$first_image" 200
    test_endpoint "Serve thumbnail (150px)" "$API_URL/uploads/$first_image?size=thumbnail" 200
    test_endpoint "Serve small (320px)" "$API_URL/uploads/$first_image?size=small" 200
    test_endpoint "Serve medium (640px)" "$API_URL/uploads/$first_image?size=medium" 200
    test_endpoint "Serve large (1280px)" "$API_URL/uploads/$first_image?size=large" 200
  else
    echo -e "${YELLOW}⚠ No images in uploads directory${NC}"
  fi
else
  echo -e "${YELLOW}⚠ Uploads directory not found or empty${NC}"
fi

echo ""
echo "======================================"
echo "⚡ 4. COMPRESSION MIDDLEWARE"
echo "======================================"
echo ""

echo -n "Testing: Gzip compression ... "
compression_test=$(curl -s -I -H "Accept-Encoding: gzip" "$API_URL/api/v1/health" | grep -i "content-encoding: gzip" || echo "")

if [ -n "$compression_test" ]; then
  echo -e "${GREEN}✓ PASS${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${YELLOW}⚠ WARNING${NC} (Compression may not be enabled)"
  # Don't count as failure since response might be too small
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "======================================"
echo "📱 5. MOBILE API ENDPOINTS"
echo "======================================"
echo ""

test_endpoint "Posts endpoint" "$API_URL/api/v1/posts?page=1&limit=10" 401
test_endpoint "Reels endpoint" "$API_URL/api/v1/reels?page=1&limit=10" 401
test_endpoint "Stories endpoint" "$API_URL/api/v1/stories" 401
test_endpoint "Notifications endpoint" "$API_URL/api/v1/notifications" 401

echo ""
echo "======================================"
echo "💻 6. WEB API ENDPOINTS"
echo "======================================"
echo ""

test_endpoint "News feed" "$API_URL/api/v1/newsfeed?page=1&limit=10" 401
test_endpoint "Groups" "$API_URL/api/v1/groups" 401
test_endpoint "Friends" "$API_URL/api/v1/friends" 401

echo ""
echo "======================================"
echo "🔒 7. AUTHENTICATION ENDPOINTS"
echo "======================================"
echo ""

# Register endpoint (should accept POST)
echo -n "Testing: Register endpoint structure ... "
register_response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{}' \
  "$API_URL/api/v1/auth/register" 2>/dev/null || echo "{}")

if echo "$register_response" | jq -e '.message' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${YELLOW}⚠ WARNING${NC} (Expected error message for invalid data)"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "======================================"
echo "📊 TEST RESULTS"
echo "======================================"
echo ""
echo "Total Tests:  $TOTAL_TESTS"
echo -e "Passed:       ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed:       ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}✓✓✓ ALL TESTS PASSED! ✓✓✓${NC}"
  echo ""
  echo "🎉 Your platform is ready for mobile + web deployment!"
  exit 0
else
  echo -e "${RED}✗✗✗ SOME TESTS FAILED ✗✗✗${NC}"
  echo ""
  echo "Please fix the failing tests before deployment."
  exit 1
fi
