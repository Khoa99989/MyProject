#!/usr/bin/env bash
# Deploy frontend lên Vercel
# Lần đầu: chạy "npx vercel login" và đăng nhập trên browser, rồi chạy script này.

set -e
cd "$(dirname "$0")"

echo "Building..."
npm run build

echo "Deploying to Vercel..."
npx vercel --prod --yes

echo "Done. Check the URL in the output above."
