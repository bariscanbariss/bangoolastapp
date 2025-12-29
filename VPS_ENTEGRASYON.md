# VPS Backend Entegrasyonu - Adım Adım Rehber

Bu rehber, React Native Bangoo uygulamanızı VPS sunucunuzdaki Medusa backend'e nasıl bağlayacağınızı açıklar.

## 🚀 Hızlı Başlangıç

### 1. VPS Bilgilerinizi Toplayın

Aşağıdaki bilgilere ihtiyacınız olacak:
- **VPS IP Adresi** veya **Domain Adı**: Örnek: `123.45.67.89` veya `api.bangoo.com`
- **Backend Portu**: Medusa genellikle port `9000` kullanır
- **SSL Sertifikası**: HTTPS kullanıyor musunuz? (Önerilir)
- **Publishable API Key**: Medusa Admin Panel'den alacaksınız

### 2. Medusa Admin Panel'den API Key Alın

1. VPS'inizdeki Medusa Admin Panel'e giriş yapın
   ```
   https://your-domain.com/app veya http://your-ip:7001/app
   ```

2. Sol menüden **Settings** → **Publishable API Keys** bölümüne gidin

3. **Create Publishable API Key** butonuna tıklayın

4. Key'e bir isim verin (örn: "Mobile App")

5. Key'i kopyalayın (örnek: `pk_01HXXX...`)

### 3. .env Dosyasını Güncelleyin

`.env` dosyasını açın ve şu değerleri güncelleyin:

#### HTTPS Kullanıyorsanız (Önerilir - SSL Sertifikanız varsa):
```bash
MEDUSA_BACKEND_URL=https://api.yourdomain.com
PUBLISHABLE_API_KEY=pk_01HXXXXXXXXXXXXXXXXXXXXXXXXXX
DEFAULT_LOCALE=en-US
```

#### HTTP Kullanıyorsanız (SSL Sertifikanız yoksa):
```bash
MEDUSA_BACKEND_URL=http://123.45.67.89:9000
PUBLISHABLE_API_KEY=pk_01HXXXXXXXXXXXXXXXXXXXXXXXXXX
DEFAULT_LOCALE=en-US
```

**Önemli Notlar:**
- Domain kullanıyorsanız port numarasına gerek yok (HTTPS için 443, HTTP için 80)
- IP adresi kullanıyorsanız ve port 9000'deyse: `http://IP:9000`
- Sonunda `/` koymayın!

### 4. VPS Firewall Ayarlarını Kontrol Edin

VPS'nizde Medusa backend'inin dışarıdan erişilebilir olması gerekiyor:

```bash
# VPS'nize SSH ile bağlanın
ssh user@your-vps-ip

# Firewall'da port 9000'i açın (UFW kullanıyorsanız)
sudo ufw allow 9000

# Veya iptables kullanıyorsanız
sudo iptables -A INPUT -p tcp --dport 9000 -j ACCEPT

# Firewall durumunu kontrol edin
sudo ufw status
```

### 5. Medusa Backend CORS Ayarlarını Yapılandırın

VPS'nizdeki Medusa backend'de CORS ayarlarını güncelleyin:

```bash
# VPS'nizde Medusa backend klasörüne gidin
cd /path/to/your/medusa-backend

# medusa-config.js dosyasını düzenleyin
nano medusa-config.js
```

`medusa-config.js` içinde CORS ayarlarını ekleyin/güncelleyin:

```javascript
module.exports = {
  projectConfig: {
    // ... diğer ayarlar

    http: {
      // CORS ayarları
      cors: "*", // Tüm domainlere izin ver (development için)
      // Veya production için spesifik domainler:
      // cors: "http://localhost:8081,http://localhost:19006",
    },
  },

  // ... diğer ayarlar
}
```

**Production için önerilen CORS ayarı:**
```javascript
http: {
  cors: process.env.STORE_CORS || "*",
},
```

`.env` dosyanızda (VPS'deki Medusa backend):
```bash
STORE_CORS=*
```

### 6. Medusa Backend'i Yeniden Başlatın

```bash
# PM2 kullanıyorsanız
pm2 restart medusa-backend

# Veya doğrudan
npm run start

# Veya development mode
npm run develop
```

### 7. Backend Bağlantısını Test Edin

Tarayıcınızdan veya Postman'den test edin:

```bash
# Health check
https://api.yourdomain.com/health

# Store API test
https://api.yourdomain.com/store/products
```

Başarılı yanıt alıyorsanız backend hazır! ✅

## 📱 React Native App'i Çalıştırın

### Tüm Paketleri Yeniden Yükleyin

```bash
# Node modules temizliği
rm -rf node_modules
npm install

# iOS için (Mac kullanıyorsanız)
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Cache temizliği
npm start -- --reset-cache
```

### Uygulamayı Başlatın

```bash
# Android
npm run android

# iOS
npm run ios
```

## 🔧 Sorun Giderme

### Problem 1: "Network Request Failed" Hatası

**Çözüm:**
1. `.env` dosyasındaki URL'i kontrol edin
2. VPS'den backend'in çalıştığından emin olun:
   ```bash
   curl http://localhost:9000/health
   ```
3. Firewall portlarının açık olduğunu doğrulayın

### Problem 2: CORS Hatası

**Çözüm:**
```bash
# VPS'de medusa-config.js CORS ayarlarını yapın
cors: "*"  # Development için
```

Backend'i yeniden başlatın.

### Problem 3: Android'de "Cleartext Traffic Not Permitted"

**Çözüm:** HTTP kullanıyorsanız, AndroidManifest.xml'e eklendi:
```xml
android:usesCleartextTraffic="true"
```

### Problem 4: iOS'ta HTTP Bağlantısı Çalışmıyor

**Çözüm:** iOS Info.plist'e ATS exception ekleyin:

```bash
# ios/BangooApp/Info.plist dosyasını düzenleyin
```

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

**UYARI:** Production'da HTTPS kullanın, bu sadece development için!

### Problem 5: "401 Unauthorized" Hatası

**Çözüm:**
1. `PUBLISHABLE_API_KEY`'in doğru olduğunu kontrol edin
2. Medusa Admin'den key'in aktif olduğunu doğrulayın
3. `.env` dosyasını güncelledikten sonra uygulamayı yeniden başlatın

### Problem 6: Ürünler Görünmüyor

**Çözüm:**
1. VPS'deki Medusa backend'de ürün var mı kontrol edin:
   ```bash
   curl https://api.yourdomain.com/store/products
   ```
2. Region ayarlarını kontrol edin
3. Ürünlerin published olduğundan emin olun

## 🔐 Güvenlik Önerileri

### 1. HTTPS Kullanın (Zorunlu - Production)

Let's Encrypt ile ücretsiz SSL sertifikası alın:

```bash
# Certbot yükleyin
sudo apt install certbot

# Nginx için SSL sertifikası
sudo certbot --nginx -d api.yourdomain.com

# Veya standalone
sudo certbot certonly --standalone -d api.yourdomain.com
```

### 2. CORS Ayarlarını Production için Sıkılaştırın

```javascript
// medusa-config.js
http: {
  cors: process.env.STORE_CORS || "https://yourdomain.com",
},
```

### 3. Environment Variables'ı Güvenli Tutun

- `.env` dosyasını asla git'e commit etmeyin
- Production keys'i kimseyle paylaşmayın
- Key rotation yapın (düzenli olarak yeni key oluşturun)

### 4. Rate Limiting Ekleyin

VPS'nizde nginx veya medusa-config'de rate limiting yapılandırın.

## 📊 Backend Durumunu Kontrol Etme

### VPS'de Log'ları İzleyin

```bash
# PM2 kullanıyorsanız
pm2 logs medusa-backend

# Veya
tail -f /path/to/logs/medusa.log
```

### Sistem Kaynaklarını Kontrol Edin

```bash
# CPU ve Memory kullanımı
htop

# Disk kullanımı
df -h

# Medusa process kontrolü
ps aux | grep medusa
```

## 🎯 Performans İyileştirmeleri

### 1. Redis Cache Kullanın

VPS'nizde Redis kurulu değilse:

```bash
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

Medusa config'de Redis'i aktif edin.

### 2. PostgreSQL Optimizasyonu

```bash
# PostgreSQL performans ayarları
sudo nano /etc/postgresql/*/main/postgresql.conf
```

### 3. Nginx Reverse Proxy Kullanın

```nginx
# /etc/nginx/sites-available/medusa
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ✅ Tamamlandı Checklist

Backend entegrasyonu tamamlandı mı kontrol edin:

- [ ] VPS'de Medusa backend çalışıyor
- [ ] Firewall portları açık
- [ ] CORS yapılandırıldı
- [ ] `.env` dosyası güncellendi
- [ ] PUBLISHABLE_API_KEY eklendi
- [ ] Backend'den health check başarılı
- [ ] React Native app backend'e bağlanıyor
- [ ] Login/Register çalışıyor
- [ ] Ürünler listeleniyor
- [ ] Add to cart çalışıyor
- [ ] Checkout flow test edildi

## 📞 Destek

Sorun yaşıyorsanız:
1. Backend loglarını kontrol edin: `pm2 logs`
2. Network bağlantısını test edin: `curl https://api.yourdomain.com/health`
3. React Native debug konsolu: Metro bundler çıktısını kontrol edin
4. Medusa dokümantasyonu: https://docs.medusajs.com

---

**Not:** Bu rehber, VPS'nizde Medusa v2 çalıştırdığınızı varsayar. Versiyon farklıysa dokümantasyonu kontrol edin.
