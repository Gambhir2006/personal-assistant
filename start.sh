#!/bin/bash

echo "Starting AI Personal Assistant..."
echo ""

echo "Step 1: Starting Backend..."
python -m backend.main &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Step 2: Starting Frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "AI Personal Assistant is starting!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "API Docs: http://localhost:8000/docs"
echo "========================================"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
