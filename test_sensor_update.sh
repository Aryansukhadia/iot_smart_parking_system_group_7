#!/bin/bash

# Test script for IR sensor database update fix
# This script helps verify that the backend is working correctly

BACKEND_URL="http://192.168.1.6:3000/api"

echo "=========================================="
echo "IR Sensor Update Test Script"
echo "=========================================="
echo ""

# Test 1: Check backend health
echo "Test 1: Checking backend health..."
curl -s "${BACKEND_URL}/health" | python -m json.tool 2>/dev/null || curl -s "${BACKEND_URL}/health"
echo -e "\n"

# Test 2: Check current slot status
echo "Test 2: Checking current slot statuses..."
curl -s "${BACKEND_URL}/slots" | python -m json.tool 2>/dev/null || curl -s "${BACKEND_URL}/slots"
echo -e "\n"

# Test 3: Check debug endpoint
echo "Test 3: Checking debug slot information..."
curl -s "${BACKEND_URL}/debug/slots" | python -m json.tool 2>/dev/null || curl -s "${BACKEND_URL}/debug/slots"
echo -e "\n"

# Test 4: Simulate sensor update (all slots occupied)
echo "Test 4: Simulating sensor update - all slots occupied..."
curl -s -X POST "${BACKEND_URL}/updateSlots" \
  -H "Content-Type: application/json" \
  -d '{"S1":1,"S2":1,"S3":1}' | python -m json.tool 2>/dev/null || \
  curl -s -X POST "${BACKEND_URL}/updateSlots" \
  -H "Content-Type: application/json" \
  -d '{"S1":1,"S2":1,"S3":1}'
echo -e "\n"

# Wait a moment
echo "Waiting 2 seconds..."
sleep 2

# Test 5: Check slots again after update
echo "Test 5: Checking slots after update..."
curl -s "${BACKEND_URL}/slots" | python -m json.tool 2>/dev/null || curl -s "${BACKEND_URL}/slots"
echo -e "\n"

# Test 6: Simulate sensor update (all slots free)
echo "Test 6: Simulating sensor update - all slots free..."
curl -s -X POST "${BACKEND_URL}/updateSlots" \
  -H "Content-Type: application/json" \
  -d '{"S1":0,"S2":0,"S3":0}' | python -m json.tool 2>/dev/null || \
  curl -s -X POST "${BACKEND_URL}/updateSlots" \
  -H "Content-Type: application/json" \
  -d '{"S1":0,"S2":0,"S3":0}'
echo -e "\n"

# Wait a moment
echo "Waiting 2 seconds..."
sleep 2

# Test 7: Check slots again after second update
echo "Test 7: Checking slots after second update..."
curl -s "${BACKEND_URL}/slots" | python -m json.tool 2>/dev/null || curl -s "${BACKEND_URL}/slots"
echo -e "\n"

echo "=========================================="
echo "Test Complete!"
echo "=========================================="
echo ""
echo "Expected Results:"
echo "- After Test 4: All slots should show status 'occupied'"
echo "- After Test 6: All slots should show status 'free'"
echo ""
echo "Check the backend console for detailed logs with emojis:"
echo "  📡 Received slot update from sensors"
echo "  🚗 Slot X: free → occupied (car detected)"
echo "  ✅ Slot X updated in database"
echo ""
