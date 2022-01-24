#!/bin/bash

# backend
python3 api/api.py &

# frontend
npm run build && npm run start