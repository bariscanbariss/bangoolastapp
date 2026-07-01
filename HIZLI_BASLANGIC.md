# 🚀 Hızlı Başlangıç - VPS Backend Bağlantısı

## 3 Adımda Kurulum

### 1️⃣ Backend Bilgilerini Toplayın

VPS'nizden bu bilgilere ihtiyacınız var:
- Backend URL: `https://api.yourdomain.com` veya `http://IP:9000`
- Publishable API Key: Medusa Admin → Settings → Publishable API Keys

### 2️⃣ Otomatik Kurulum (Önerilen)

Terminal'de şu komutu çalıştırın:
```bash
./setup-vps.sh
```

Script sizi adım adım yönlendirecek! ✨

### 3️⃣ Manuel Kurulum

`.env` dosyasını düzenleyin:
```bash
MEDUSA_BACKEND_URL=https://api.yourdomain.com
PUBLISHABLE_API_KEY=pk_01HXXXXXXXXX
DEFAULT_LOCALE=en-US
```

## Uygulamayı Başlatın

```bash
# Android
npm run android

# iOS
npm run ios
```

## ⚠️ Önemli Kontroller

### VPS'de Backend Çalışıyor mu?

```bash
# SSH ile VPS'e bağlanın
ssh user@your-vps-ip

# Backend durumunu kontrol edin
pm2 list
# veya
ps aux | grep medusa

# Backend loglarını görün
pm2 logs medusa-backend
```

### Backend'e Dışarıdan Erişilebiliyor mu?

Tarayıcınızdan test edin:
```
https://api.yourdomain.com/health
```

Yanıt olmalı: `{"status":"ok"}`

### Firewall Açık mı?

```bash
# VPS'de firewall kontrolü
sudo ufw status

# Port 9000 açık mı kontrol edin
sudo ufw allow 9000
```

### CORS Ayarları Yapıldı mı?

VPS'de `medusa-config.js`:
```javascript
module.exports = {
  projectConfig: {
    http: {
      cors: "*", // Development için
    },
  },
}
```

Backend'i yeniden başlatın:
```bash
pm2 restart medusa-backend
```

## 🐛 Hızlı Sorun Çözümleri

| Hata | Çözüm |
|------|-------|
| Network Request Failed | `.env`'deki URL'i kontrol et, VPS'de backend çalışıyor mu? |
| CORS Error | VPS'de `medusa-config.js`'te CORS ayarla ve restart et |
| 401 Unauthorized | API Key'i kontrol et, Medusa Admin'den aktif mi? |
| Cleartext Traffic (Android) | `AndroidManifest.xml`'e `usesCleartextTraffic="true"` eklendi ✅ |
| Ürünler yüklenmiyor | Backend'de ürün var mı? `/store/products` test et |

## 📁 İhtiyacınız Olabilecek Dosyalar

- **VPS_ENTEGRASYON.md** - Detaylı entegrasyon rehberi
- **SETUP.md** - Genel kurulum rehberi
- **IMPLEMENTATION.md** - Uygulama özeti
- **.env** - Backend yapılandırması

## 🔐 Production Checklist

- [ ] HTTPS kullanıyorum (SSL sertifikası var)
- [ ] CORS sadece mobil app'e izin veriyor
- [ ] Publishable API Key production key'i
- [ ] Firewall sadece gerekli portlar açık
- [ ] Backend logları izleniyor
- [ ] Rate limiting aktif
- [ ] Database backup düzenli alınıyor

## 💡 İpuçları

1. **Development**: HTTP kullanabilirsiniz ama `usesCleartextTraffic="true"` gerekli
2. **Production**: Mutlaka HTTPS kullanın!
3. **Test**: Her değişiklik sonrası cache temizleyin: `npm start -- --reset-cache`
4. **Debug**: Metro bundler çıktısını izleyin
5. **VPS**: Backend logları için `pm2 logs` kullanın

## 📞 Yardım Gerekirse

1. Backend durumunu kontrol et: `curl https://api.yourdomain.com/health`
2. React Native console'u kontrol et
3. VPS loglarını oku: `pm2 logs`
4. **VPS_ENTEGRASYON.md** dosyasını oku - tüm detaylar orada!

---

**Başarılar!** 🎉 Sorularınız için VPS_ENTEGRASYON.md dosyasına bakın.
