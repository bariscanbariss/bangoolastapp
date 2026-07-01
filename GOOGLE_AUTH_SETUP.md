# Google OAuth Kurulumu - MedusaJS Backend

Google OAuth entegrasyonu için backend tarafında yapmanız gereken adımlar:

## 1. Google Cloud Console Ayarları

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. "APIs & Services" > "Credentials" bölümüne gidin
4. "Create Credentials" > "OAuth client ID" seçin
5. Application type: "Web application"
6. Authorized redirect URIs:
   ```
   https://admin.bangoocyp.com/auth/google/callback
   http://localhost:9000/auth/google/callback (test için)
   ```
7. Client ID ve Client Secret'i kaydedin

## 2. MedusaJS Backend Yapılandırması

Backend'inizde `medusa-config.js` dosyasını güncelleyin:

```javascript
module.exports = {
  projectConfig: {
    // ... mevcut ayarlar
  },
  plugins: [
    // ... diğer pluginler
    {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth/google",
            id: "google",
            options: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              callbackUrl: `${process.env.MEDUSA_BACKEND_URL}/auth/google/callback`,
            },
          },
        ],
      },
    },
  ],
};
```

## 3. Environment Variables

Backend `.env` dosyasına ekleyin:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## 4. Gerekli Paketler

Backend'de şu paketlerin kurulu olduğundan emin olun:

```bash
npm install @medusajs/auth
npm install passport-google-oauth20
```

## 5. Callback Route

MedusaJS'de callback route otomatik olarak oluşturulur:
- Endpoint: `GET /auth/google/callback`
- Bu endpoint Google'dan gelen auth code'u işler
- Başarılı olursa customer oluşturur/günceller
- JWT token veya session cookie set eder

## 6. Test Etme

1. Mobile app'te "Continue with Google" butonuna tıklayın
2. WebView açılır ve Google login sayfası görünür
3. Google hesabınızla giriş yapın
4. Backend'e yönlendirilir ve auth işlemi tamamlanır
5. App anasayfaya yönlendirilir

## Sorun Giderme

Eğer Google Auth çalışmazsa:

1. Backend loglarını kontrol edin
2. Google Cloud Console'da redirect URI'larını doğrulayın
3. Client ID ve Secret'in doğru olduğundan emin olun
4. Backend'de `@medusajs/auth` paketinin doğru yapılandırıldığından emin olun
5. CORS ayarlarını kontrol edin

## Güvenlik Notları

- Production'da HTTPS kullanın
- Client Secret'i asla frontend'e expose etmeyin
- JWT token'ları güvenli şekilde saklayın (AsyncStorage)
- Session timeout ayarlarını yapın
