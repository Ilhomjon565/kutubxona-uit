# UIT Kutubxona - Raqamli Kutubxona Tizimi

UIT (Innovatsion Texnologiyalar Universiteti) uchun raqamli kutubxona tizimi. Bu tizim Next.js 15 va TypeScript yordamida yaratilgan.

## Xususiyatlar

### Foydalanuvchi Xususiyatlari
- 📚 **Kitoblar katalogi** - Barcha kitoblarni ko'rish va qidirish
- 🔍 **Kuchli qidiruv** - Kitob nomi, muallif va kategoriya bo'yicha qidirish
- 📂 **Kategoriyalar** - Kitoblarni kategoriyalar bo'yicha guruhlash
- 👤 **Foydalanuvchi profili** - Shaxsiy ma'lumotlarni boshqarish
- 🔐 **Xavfsiz autentifikatsiya** - Login va registratsiya

### Admin Xususiyatlari
- 📖 **Kitoblar boshqaruvi** - Yangi kitob qo'shish, tahrirlash va o'chirish
- 📁 **Kategoriyalar boshqaruvi** - Kategoriyalar yaratish va boshqarish
- 👥 **Foydalanuvchilar boshqaruvi** - Foydalanuvchilarni ko'rish va boshqarish
- 📊 **Statistika** - Kutubxona statistikasi

## Texnologiyalar

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **State Management**: React Context API

## O'rnatish

1. **Dependencies o'rnatish**:
   ```bash
   npm install
   ```

2. **Development server ishga tushirish**:
   ```bash
   npm run dev
   ```

3. **Production build**:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

Backend API `localhost:5002` portida ishlaydi:

### Autentifikatsiya
- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Kirish
- `GET /api/auth/profile` - Profil ma'lumotlari
- `PUT /api/auth/profile` - Profil yangilash

### Kitoblar
- `GET /api/books` - Barcha kitoblar
- `POST /api/books` - Yangi kitob qo'shish
- `PUT /api/books/:id` - Kitob yangilash
- `DELETE /api/books/:id` - Kitob o'chirish

### Kategoriyalar
- `GET /api/category` - Barcha kategoriyalar
- `POST /api/category` - Yangi kategoriya
- `PUT /api/category/:id` - Kategoriya yangilash
- `DELETE /api/category/:id` - Kategoriya o'chirish

## Loyiha Tuzilishi

```
uit-kutubxona-frontend/
├── app/                    # Next.js app router
│   ├── admin/             # Admin panel sahifalari
│   ├── books/             # Kitoblar sahifasi
│   ├── categories/        # Kategoriyalar sahifasi
│   ├── login/             # Login sahifasi
│   ├── profile/           # Profil sahifasi
│   ├── register/          # Registratsiya sahifasi
│   ├── globals.css        # Global stillar
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Bosh sahifa
├── components/            # React komponentlari
│   ├── admin/             # Admin komponentlari
│   ├── Header.tsx         # Header komponenti
│   ├── Footer.tsx         # Footer komponenti
│   ├── Layout.tsx         # Layout komponenti
│   ├── BookCard.tsx       # Kitob karta komponenti
│   └── SearchBar.tsx      # Qidiruv komponenti
├── contexts/              # React Context
│   └── AuthContext.tsx    # Autentifikatsiya context
├── lib/                   # Utility funksiyalar
│   ├── api.ts            # API service
│   └── utils.ts          # Helper funksiyalar
├── types/                 # TypeScript tiplari
│   └── index.ts          # Barcha tiplar
└── public/               # Static fayllar
```

## Foydalanish

### Foydalanuvchi sifatida:
1. Bosh sahifada kitoblarni ko'ring
2. Qidiruv yoki filtrlar yordamida kerakli kitobni toping
3. Profil yaratish uchun ro'yxatdan o'ting
4. Shaxsiy ma'lumotlaringizni yangilang

### Admin sifatida:
1. Admin panelga kirish uchun admin huquqiga ega hisob yarating
2. Kitoblar bo'limida yangi kitoblar qo'shing
3. Kategoriyalar bo'limida kitob kategoriyalarini boshqaring
4. Foydalanuvchilarni ko'ring va boshqaring

## Rivojlantirish

Loyihani rivojlantirish uchun:

1. **Yangi xususiyat qo'shish**:
   - Komponentlarni `components/` papkasida yarating
   - Sahifalarni `app/` papkasida yarating
   - API funksiyalarini `lib/api.ts` da qo'shing

2. **Styling**:
   - Tailwind CSS klasslarini ishlatish
   - Custom CSS `globals.css` da qo'shish

3. **TypeScript**:
   - Yangi tiplarni `types/index.ts` da qo'shing
   - Komponentlarda to'g'ri tiplarni ishlatish

## Muammolar va Yechimlar

### Umumiy muammolar:

1. **API ga ulanishda xatolik**:
   - Backend server ishlayotganini tekshiring
   - API URL to'g'ri ekanligini tekshiring

2. **Authentication xatoliklari**:
   - Token localStorage da saqlanayotganini tekshiring
   - Token muddati tugamaganini tekshiring

3. **Build xatoliklari**:
   - TypeScript xatolarini tekshiring
   - Import/export xatolarini tekshiring

## Litsenziya

Bu loyiha MIT litsenziyasi ostida tarqatiladi.

## Aloqa

Savollar yoki takliflar uchun:
- Email: info@nukusii.uz
- Telefon: +998 (61) 225 65 66

---

**UIT Kutubxona** - Zamonaviy ta'lim va innovatsion texnologiyalar asosida malakali mutaxassislar tayyorlash