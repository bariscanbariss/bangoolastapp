#!/bin/bash

# Bangoo React Native App - VPS Backend Bağlantı Scripti
# Bu script, uygulamanızı VPS backend'inize bağlamak için gerekli adımları atar

echo "🎉 Bangoo VPS Backend Entegrasyon Scripti"
echo "=========================================="
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# .env dosyasının varlığını kontrol et
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env dosyası bulunamadı!${NC}"
    echo "Lütfen .env dosyasını oluşturun."
    exit 1
fi

echo -e "${GREEN}✅ .env dosyası bulundu${NC}"
echo ""

# Backend URL'i sor
echo "📡 VPS Backend URL'inizi girin:"
echo "Örnek: https://api.bangoo.com veya http://123.45.67.89:9000"
read -p "Backend URL: " BACKEND_URL

# Boş girdi kontrolü
if [ -z "$BACKEND_URL" ]; then
    echo -e "${RED}❌ Backend URL boş olamaz!${NC}"
    exit 1
fi

# Publishable API Key sor
echo ""
echo "🔑 Medusa Publishable API Key'inizi girin:"
echo "Medusa Admin Panel -> Settings -> Publishable API Keys"
read -p "API Key: " API_KEY

# Boş girdi kontrolü
if [ -z "$API_KEY" ]; then
    echo -e "${YELLOW}⚠️  API Key boş bırakıldı. Daha sonra .env dosyasına eklemeyi unutmayın!${NC}"
fi

# .env dosyasını güncelle
echo ""
echo "📝 .env dosyası güncelleniyor..."

cat > .env << EOF
# Medusa Backend Configuration - VPS Server
# Updated: $(date)

MEDUSA_BACKEND_URL=${BACKEND_URL}
PUBLISHABLE_API_KEY=${API_KEY}
DEFAULT_LOCALE=en-US
EOF

echo -e "${GREEN}✅ .env dosyası güncellendi${NC}"
echo ""

# Backend bağlantısını test et
echo "🧪 Backend bağlantısı test ediliyor..."
echo "URL: ${BACKEND_URL}/health"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" ${BACKEND_URL}/health 2>/dev/null)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Backend bağlantısı başarılı! (HTTP $HTTP_CODE)${NC}"
elif [ "$HTTP_CODE" = "000" ]; then
    echo -e "${RED}❌ Backend'e ulaşılamıyor. URL'i kontrol edin.${NC}"
    echo "   VPS'nizde backend'in çalıştığından emin olun."
else
    echo -e "${YELLOW}⚠️  Backend yanıt verdi ama beklenmeyen kod: HTTP $HTTP_CODE${NC}"
fi

echo ""

# Store products endpoint'ini test et
echo "🧪 Store API test ediliyor..."
echo "URL: ${BACKEND_URL}/store/products"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" ${BACKEND_URL}/store/products 2>/dev/null)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Store API çalışıyor! (HTTP $HTTP_CODE)${NC}"
elif [ "$HTTP_CODE" = "000" ]; then
    echo -e "${RED}❌ Store API'ye ulaşılamıyor.${NC}"
else
    echo -e "${YELLOW}⚠️  Store API yanıt: HTTP $HTTP_CODE${NC}"
fi

echo ""
echo "=========================================="
echo "📋 Sonraki Adımlar:"
echo "=========================================="
echo ""
echo "1. 🧹 Cache temizliği yapın:"
echo "   npm start -- --reset-cache"
echo ""
echo "2. 📱 Uygulamayı çalıştırın:"
echo "   npm run android    # Android için"
echo "   npm run ios        # iOS için"
echo ""
echo "3. 🔍 Sorun yaşıyorsanız:"
echo "   - VPS_ENTEGRASYON.md dosyasını okuyun"
echo "   - VPS'de backend loglarını kontrol edin"
echo "   - Firewall ayarlarını kontrol edin"
echo ""
echo "=========================================="
echo ""

# İsteğe bağlı: Node modules yeniden yükle
read -p "Node modules'ı yeniden yüklemek ister misiniz? (y/n): " REINSTALL

if [ "$REINSTALL" = "y" ] || [ "$REINSTALL" = "Y" ]; then
    echo ""
    echo "📦 Node modules yeniden yükleniyor..."
    rm -rf node_modules
    npm install
    echo -e "${GREEN}✅ Node modules yüklendi${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Kurulum tamamlandı!${NC}"
echo "Artık uygulamanızı çalıştırabilirsiniz."
