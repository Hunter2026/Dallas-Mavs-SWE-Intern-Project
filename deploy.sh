#!/bin/bash
cd frontend
npm run build
rm -rf ../backend/static/assets/*
cp -r dist/assets ../backend/static/
cp dist/index.html ../backend/static/
cd ../backend
eb deploy && eb open