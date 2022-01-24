#!/bin/bash

# backend
cd api && python3 api.py &

# frontend
npm run build && npm run start