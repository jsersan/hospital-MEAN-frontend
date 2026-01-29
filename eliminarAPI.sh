#!/bin/bash

# Script para encontrar referencias a la API antigua de Google (GAPI)

echo "🔍 Buscando referencias a GAPI (API antigua de Google)..."
echo ""

echo "📁 Buscando en archivos HTML..."
grep -r "platform.js" src/ 2>/dev/null
grep -r "gapi" src/ 2>/dev/null | grep -v "node_modules"

echo ""
echo "📁 Buscando en archivos TypeScript..."
grep -r "auth2" src/ 2>/dev/null | grep -v "node_modules"
grep -r "googleInit" src/ 2>/dev/null | grep -v "node_modules"

echo ""
echo "📁 Buscando meta tags de Google..."
grep -r "google-signin-client_id" src/ 2>/dev/null

echo ""
echo "✅ Búsqueda completada"