#!/bin/bash
cd /home/kavia/workspace/code-generation/ticket-metrics-dashboard-91904-91913/frontend_react_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

