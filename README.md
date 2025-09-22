# UIT Kutubxona - Raqamli Kutubxona Tizimi

UIT (Innovatsion Texnologiyalar Universiteti) uchun raqamli kutubxona tizimi. Bu tizim Next.js 15 va TypeScript yordamida yaratilgan.

## 🚀 Xususiyatlar

### Foydalanuvchi Xususiyatlari

* 📚 **Kitoblar katalogi** - Barcha kitoblarni ko'rish va qidirish
* 🔍 **Kuchli qidiruv** - Kitob nomi, muallif va kategoriya bo'yicha qidirish
* 📂 **Kategoriyalar** - Kitoblarni kategoriyalar bo'yicha guruhlash
* 👤 **Foydalanuvchi profili** - Shaxsiy ma'lumotlarni boshqarish
* 🔐 **Xavfsiz autentifikatsiya** - Login va registratsiya

### Admin Xususiyatlari

* 📖 **Kitoblar boshqaruvi** - Yangi kitob qo'shish, tahrirlash va o'chirish
* 📁 **Kategoriyalar boshqaruvi** - Kategoriyalar yaratish, tahrirlash va o'chirish
* 👥 **Foydalanuvchilar boshqaruvi** - Foydalanuvchilarni ko'rish va boshqarish
* 📊 **Statistika** - Kutubxona statistikasi
* ⚙️ **Profil sozlamalari** - Admin profilini yangilash

## 🛠️ Texnologiyalar

* **Frontend**: Next.js 15, React 19, TypeScript
* **Styling**: Tailwind CSS 3.4.0
* **Icons**: Lucide React
* **Forms**: React Hook Form
* **HTTP Client**: Fetch API
* **State Management**: React Context API
* **UI Components**: Radix UI + shadcn/ui

## 📦 O'rnatish

1. **Repositoryni klonlash**:
   ```bash
   git clone https://github.com/Ilhomjon565/kutubxona-uit.git
   cd kutubxona-uit
   ```

2. **Dependencies o'rnatish**:
   ```bash
   npm install
   ```

3. **Development server ishga tushirish**:
   ```bash
   npm run dev
   ```

4. **Production build**:
   ```bash
   npm run build
   npm start
   ```

## 🌐 Demo

Loyiha onlayn ko'rish uchun: [kutubxona-uit.vercel.app](https://kutubxona-uit.vercel.app)

## 📡 API Endpoints

Backend API `localhost:5002` portida ishlaydi:

### Autentifikatsiya

* `POST /api/auth/register` - Ro'yxatdan o'tish
* `POST /api/auth/login` - Kirish
* `GET /api/profile` - Profil ma'lumotlari
* `PUT /api/profile` - Profil yangilash

### Kitoblar

* `GET /api/books` - Barcha kitoblar
* `POST /api/books` - Yangi kitob qo'shish
* `PUT /api/books/:id` - Kitob yangilash
* `DELETE /api/books/:id` - Kitob o'chirish

### Kategoriyalar

* `GET /api/category` - Barcha kategoriyalar
* `POST /api/category` - Yangi kategoriya
* `PUT /api/category/:id` - Kategoriya yangilash
* `DELETE /api/category/:id` - Kategoriya o'chirish

## 📁 Loyiha Tuzilishi

```
uit-kutubxona-frontend/
├── app/                    # Next.js app router
│   ├── admin/             # Admin panel sahifalari
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── books/         # Kitoblar boshqaruvi
│   │   ├── categories/    # Kategoriyalar boshqaruvi
│   │   ├── profile/       # Admin profil sozlamalari
│   │   └── login/         # Admin login
│   ├── books/             # Kitoblar sahifasi
│   ├── categories/        # Kategoriyalar sahifasi
│   ├── login/             # Foydalanuvchi login
│   ├── register/          # Registratsiya
│   ├── profile/           # Foydalanuvchi profili
│   ├── globals.css        # Global stillar
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Bosh sahifa
├── components/            # React komponentlari
│   ├── ui/               # UI komponentlari (shadcn/ui)
│   ├── navbar.tsx        # Navbar komponenti
│   ├── footer.tsx        # Footer komponenti
│   ├── admin-layout.tsx  # Admin layout
│   └── admin-guard.tsx   # Admin authentication guard
├── lib/                   # Utility funksiyalar
│   ├── api.ts            # API service
│   ├── auth.ts           # Authentication utilities
│   └── utils.ts          # Helper funksiyalar
├── hooks/                 # Custom React hooks
├── public/               # Static fayllar
└── types/                # TypeScript tiplari
```

## 🎨 Dizayn Xususiyatlari

* **Responsive Design** - Barcha qurilmalarda mukammal ishlaydi
* **Modern UI** - Zamonaviy va foydalanuvchi-do'st interfeys
* **Animatsiyalar** - Smooth animatsiyalar va hover effektlari
* **University Branding** - UIT universiteti brendingiga mos dizayn
* **Dark/Light Mode** - Tema o'zgartirish imkoniyati

## 🔧 Foydalanish

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
5. Profil sozlamalarini yangilang

## 🚀 Rivojlantirish

Loyihani rivojlantirish uchun:

1. **Yangi xususiyat qo'shish**:
   * Komponentlarni `components/` papkasida yarating
   * Sahifalarni `app/` papkasida yarating
   * API funksiyalarini `lib/api.ts` da qo'shing

2. **Styling**:
   * Tailwind CSS klasslarini ishlatish
   * Custom CSS `globals.css` da qo'shish

3. **TypeScript**:
   * Yangi tiplarni `types/` papkasida qo'shing
   * Komponentlarda to'g'ri tiplarni ishlatish

## 🐛 Muammolar va Yechimlar

### Umumiy muammolar:

1. **API ga ulanishda xatolik**:
   * Backend server ishlayotganini tekshiring
   * API URL to'g'ri ekanligini tekshiring

2. **Authentication xatoliklari**:
   * Token localStorage da saqlanayotganini tekshiring
   * Token muddati tugamaganini tekshiring

3. **Build xatoliklari**:
   * TypeScript xatolarini tekshiring
   * Import/export xatolarini tekshiring

## 📄 Litsenziya

Bu loyiha MIT litsenziyasi ostida tarqatiladi.

## 📞 Aloqa

Savollar yoki takliflar uchun:

* **Email**: info@uit.uz
* **Telefon**: +998 (61) 225 65 66
* **GitHub**: [@Ilhomjon565](https://github.com/Ilhomjon565)

## 🙏 Minnatdorchilik

* [Next.js](https://nextjs.org/) - React framework
* [Tailwind CSS](https://tailwindcss.com/) - CSS framework
* [shadcn/ui](https://ui.shadcn.com/) - UI komponentlari
* [Lucide](https://lucide.dev/) - Icons
* [Radix UI](https://www.radix-ui.com/) - Headless UI komponentlari

---

**UIT Kutubxona** - Zamonaviy ta'lim va innovatsion texnologiyalar asosida malakali mutaxassislar tayyorlash

![UIT Logo](https://uit.uz/logo.png)
