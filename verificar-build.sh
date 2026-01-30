#!/bin/bash

# Script de Verificación Pre-Despliegue
# Ejecuta esto ANTES de subir al servidor

echo "🔍 ================================"
echo "🔍 VERIFICACIÓN PRE-DESPLIEGUE"
echo "🔍 ================================"
echo ""

# Verificar que existe dist/adminpro
if [ ! -d "dist/adminpro" ]; then
    echo "❌ ERROR: No existe dist/adminpro"
    echo "   Ejecuta: ng build --configuration=productionServer"
    exit 1
fi

echo "✅ Carpeta dist/adminpro existe"
echo ""

# Verificar index.html
if [ -f "dist/adminpro/index.html" ]; then
    echo "✅ index.html existe"
    
    # Verificar base href
    if grep -q 'base href="/angular/hospitalMEAN/"' dist/adminpro/index.html; then
        echo "✅ base href correcto: /angular/hospitalMEAN/"
    else
        echo "❌ ERROR: base href incorrecto"
        grep "base href" dist/adminpro/index.html
        exit 1
    fi
    
    # Verificar Google Script
    if grep -q 'accounts.google.com/gsi/client' dist/adminpro/index.html; then
        echo "✅ Google Identity Services incluido"
    else
        echo "⚠️  ADVERTENCIA: Google Identity Services no encontrado"
    fi
else
    echo "❌ ERROR: index.html no existe en dist/adminpro"
    exit 1
fi

echo ""

# Contar archivos JS
JS_COUNT=$(find dist/adminpro -name "*.js" | wc -l)
echo "📦 Archivos JavaScript: $JS_COUNT"

# Contar archivos CSS
CSS_COUNT=$(find dist/adminpro -name "*.css" | wc -l)
echo "🎨 Archivos CSS: $CSS_COUNT"

echo ""

# Verificar assets
if [ -d "dist/adminpro/assets" ]; then
    echo "✅ Carpeta assets existe"
    ASSETS_COUNT=$(find dist/adminpro/assets -type f | wc -l)
    echo "   Archivos en assets: $ASSETS_COUNT"
else
    echo "⚠️  ADVERTENCIA: Carpeta assets no existe"
fi

echo ""
echo "🔍 ================================"
echo "✅ VERIFICACIÓN COMPLETA"
echo "🔍 ================================"
echo ""
echo "📋 SIGUIENTE PASO:"
echo "   Sube todo el contenido de dist/adminpro/ a:"
echo "   /public_html/angular/hospitalMEAN/"
echo ""