#!/bin/bash
# Script to restart the server

echo "Stopping any existing server on port 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "No process found on port 3001"

echo "Waiting 2 seconds..."
sleep 2

echo "Starting server..."
cd "$(dirname "$0")"
node server.js
