# Keycloak Client Configuration

## Problem: "Geçersiz yönlendirme url'i" (Invalid Redirect URI)

Bu hata, Keycloak client'ında whitelist'e eklenmemiş bir redirect URI kullandığınızda oluşur.

## Çözüm

### 1. Keycloak Admin Console'a Git
```
https://sso.sayfa.page/admin/
```

### 2. Realm Seç
- Sol menüden **"sayfa"** realm'ini seç

### 3. Client Ayarlarını Aç
- Sol menüden **Clients** seç
- **"sayfa-nuxt"** client'ını bul ve tıkla

### 4. Valid Redirect URIs Ekle

**Settings** tab'inde şu URL'leri ekle:

```
http://localhost:3000/*
http://localhost:3000
https://sso.sayfa.page/*
https://yourdomain.com/*
```

**NOT:** Wildcard (`*`) kullanabilirsin ama production'da spesifik path'ler kullanmak daha güvenli.

### 5. Valid Post Logout Redirect URIs Ekle

```
http://localhost:3000/*
http://localhost:3000
https://yourdomain.com/*
```

### 6. Web Origins Ekle (CORS için)

```
http://localhost:3000
https://yourdomain.com
```

### 7. Diğer Önemli Ayarlar

**Access Type:** `public`

**Standard Flow Enabled:** `ON`

**Direct Access Grants Enabled:** `ON` (isteğe bağlı)

**Valid Post Logout Redirect URIs:** Yukarıdaki gibi

### 8. Save Et

Sayfanın en altındaki **Save** butonuna tıkla.

## Test Et

1. Uygulamayı yeniden başlat: `pnpm run dev`
2. Console'da şunu göreceksin:
   ```
   [nuxt-keycloak] Login redirect URI: http://localhost:3000/dashboard
   ```
3. Login butonuna tıkla
4. Artık hata almamalısın!

## Hala Hata Alıyorsan

Console'da gösterilen redirect URI'yi kontrol et ve Keycloak'ta **tam olarak** bu URL'nin whitelist'te olduğundan emin ol.

Örnek:
```
Console: http://localhost:3000/dashboard
Keycloak: http://localhost:3000/* ✅
```
