# ملف المتطلبات الإنتاجي الشامل (PRD)
# أصيل الرميلي — بورتفوليو ويب사이트 + منصة SaaS

**الإصدار:** 4.0.0
**التاريخ:** 2026-07-27
**المشروع:** asil-portfolio
**الرابط:** https://aseelalrumili.vercel.app/

---

## جدول المحتويات

**الجزء الأول: المشروع الحالي**
1. [ملخص تنفيذي](#1-ملخص-تنفيذي)
2. [المتطلبات التقنية](#2-المتطلبات-التقنية)
3. [بنية المشروع (Architecture)](#3-بنية-المشروع)
4. [خريطة الملفات الكاملة](#4-خريطة-الملفات)
5. [نظام البيانات والتخزين](#5-نظام-البيانات)
6. [واجهة API الخادمية](#6-واجهة-api)
7. [الواجهة الأمامية — الصفحات](#7-الصفحات)
8. [لوحة التحكم الإدارية](#8-لوحة-التحكم)
9. [نظام المصادقة والأمان](#9-المصادقة)
10. [التدويل والدعم اللغوي](#10-التدويل)
11. [التصميم المتجاوب والمسافات](#11-التصميم)
12. [المشاكل التي تم حلها](#12-المشاكل)
13. [المميزات المُنجزة](#13-المميزات)

**الجزء الثاني: العملية التقنية**
14. [ربط المشروع مع Vercel](#14-ربط-مع-vercel)
15. [خطوات إنشاء مشروع جديد مشابه](#15-مشروع-جديد)
16. [الأخطاء المعروفة والتحذيرات](#16-الأخطاء)

**الجزء الثالث: التحسينات والمستقبل**
17. [التحسينات المستقبلية](#17-التحسينات)
18. [تحويل المشروع لمنصة SaaS](#18-تحويل-لمنصة)
19. [البنية التحتية للمنصة](#19-البنية-التحتية)

---

# الجزء الأول: المشروع الحالي

---

## 1. ملخص تنفيذي

### الوصف
موقع بورتفوليو شخصي متكامل مع لوحة تحكم إدارية، نظام مصادقة، تخزين سحابي، بناء سيرة ذاتية متعدد الإصدارات، ودعم كامل للعربية والإنجليزية.

### إحصائيات المشروع
| البند | العدد |
|-------|-------|
| ملفات TypeScript | 50+ |
| ملفات CSS | 27 |
| مكونات React | 40+ |
| نقاط نهاية API | 8 |
| تبويبات إدارية | 14 |
| ترجمات | 436 مفتاح × 2 لغة |
| أسطر كود تقريبية | 8000+ |
| المشاكل المحلولة | 41 |
| المميزات المُنجزة | 35+ |

### Tech Stack
```
Frontend:  React 18 + TypeScript + Vite 5 + Framer Motion 11
Backend:   Vercel Serverless Functions (Node.js)
Storage:   Vercel Blob (JSON file)
Auth:      JWT (jsonwebtoken) + bcryptjs
i18n:      i18next (AR + EN)
Deploy:    Vercel (Auto-deploy from GitHub)
```

---

## 2. المتطلبات التقنية

### للتشغيل المحلي
```
- Node.js v24+
- npm v10+
- حساب Vercel مجاني
- Vercel CLI: npm i -g vercel
```

### متغيرات البيئة المطلوبة
| المتغير | الوصف | مثال |
|---------|-------|------|
| `ADMIN_EMAIL` | بريد المشرف | `asylalrmyly49@gmail.com` |
| `ADMIN_PASSWORD_HASH` | bcrypt hash لكلمة المرور | `$2a$10$...` |
| `JWT_SECRET` | سر JWT (32+ حرف) | `aseel-portfolio-jwt-...` |
| `PORTFOLIO_READ_WRITE_TOKEN` | توكن Vercel Blob | `vercel_blob_rw_...` |
| `PORTFOLIO_STORE_ID` | معرف المتجر | (اختياري) |
| `BLOB_WEBHOOK_PUBLIC_KEY` | مفتاح Webhook | (اختياري) |

### أوامر الإعداد
```bash
# 1. تثبيت التبعيات
npm install

# 2. إنشاء ملف البيئة
cp .env.example .env
# ثم عدّل القيم

# 3. تشفير كلمة المرور
npx tsx scripts/hash-password.ts "كلمة_مرورك"

# 4. التشغيل المحلي
npm run dev

# 5. البناء للإنتاج
npm run build

# 6. النشر على Vercel
vercel --prod
```

---

## 3. بنية المشروع (Architecture)

### المخطط العام
```
my-profile/
├── api/                        # Vercel Serverless Functions (Backend)
│   ├── auth/
│   │   └── login.ts            # POST /api/auth/login
│   ├── data/
│   │   ├── index.ts            # GET/PUT /api/data
│   │   ├── upload.ts           # POST /api/data/upload
│   │   └── image.ts            # GET /api/data/image
│   ├── lib/
│   │   └── blobUtils.ts        # أدوات Blob المشتركة
│   ├── messages/
│   │   └── index.ts            # POST /api/messages
│   ├── reviews/
│   │   └── index.ts            # POST /api/reviews
│   ├── visitors/
│   │   └── index.ts            # POST/GET/DELETE /api/visitors
│   └── analytics/
│       └── index.ts            # POST/GET/DELETE /api/analytics
│
├── src/                        # كود الواجهة الأمامية (Frontend)
│   ├── api/                    # عملاء API (Frontend)
│   │   ├── client.ts           # Axios instance + interceptors
│   │   ├── api.ts              # Barrel exports
│   │   ├── profile.ts          # CRUD للملف الشخصي
│   │   ├── projects.ts         # CRUD للمشاريع
│   │   ├── blog.ts             # CRUD للمدونة
│   │   ├── certifications.ts   # CRUD للشهادات
│   │   ├── testimonials.ts     # CRUD للشهادات
│   │   ├── reviews.ts          # التقييمات
│   │   ├── resume.ts           # إدارة السيرة الذاتية
│   │   └── import.ts           # استيراد البيانات
│   │
│   ├── core/
│   │   ├── types/              # TypeScript interfaces
│   │   │   ├── app.ts          # AppData (النوع الرئيسي)
│   │   │   ├── profile.ts      # Profile, SocialLink, Skill, Experience, Education
│   │   │   ├── project.ts      # Project, MediaItem
│   │   │   ├── certification.ts# Certification
│   │   │   ├── blog.ts         # BlogPost, BlogComment
│   │   │   ├── testimonial.ts  # Testimonial
│   │   │   ├── review.ts       # Review
│   │   │   ├── message.ts      # Message, Visitor
│   │   │   └── resume.ts       # ResumeVersion, ResumeSettings
│   │   ├── store.ts            # حالة البيانات العامة + enqueueWrite
│   │   └── i18n/
│   │       ├── en.json         # ترجمات إنجليزية (436 مفتاح)
│   │       └── ar.json         # ترجمات عربية (436 مفتاح)
│   │
│   ├── features/
│   │   ├── portfolio/          # الصفحة الرئيسية
│   │   │   └── components/
│   │   │       ├── Hero.tsx
│   │   │       ├── HeroFloatingShapes.tsx
│   │   │       ├── About.tsx
│   │   │       ├── Skills.tsx
│   │   │       ├── Projects.tsx
│   │   │       ├── ProjectCard.tsx
│   │   │       ├── ProjectModal.tsx
│   │   │       ├── Experience.tsx
│   │   │       ├── Contact.tsx
│   │   │       └── PortfolioPage.tsx
│   │   │
│   │   ├── admin/              # لوحة التحكم
│   │   │   ├── components/
│   │   │   │   ├── AdminPanel.tsx
│   │   │   │   ├── LoginModal.tsx
│   │   │   │   ├── helpers.tsx
│   │   │   │   └── tabs/       # 14 تبويب إداري
│   │   │   ├── hooks/
│   │   │   │   └── useVisitorTracking.ts
│   │   │   ├── context/
│   │   │   │   └── TrackingContext.tsx
│   │   │   ├── types/
│   │   │   │   └── analytics.ts
│   │   │   └── utils/
│   │   │       └── visitorTracking.ts
│   │   │
│   │   ├── blog/               # المدونة
│   │   │   └── components/
│   │   │       ├── BlogPage.tsx
│   │   │       ├── BlogPost.tsx
│   │   │       └── CommentSection.tsx
│   │   │
│   │   ├── certifications/     # الشهادات
│   │   │   └── components/
│   │   │       ├── Certifications.tsx
│   │   │       └── CertificationsPage.tsx
│   │   │
│   │   ├── resume/             # السيرة الذاتية
│   │   │   └── components/
│   │   │       ├── ResumePage.tsx
│   │   │       ├── AtsResumeBuilder.tsx
│   │   │       └── RegularResumeBuilder.tsx
│   │   │
│   │   ├── reviews/            # التقييمات
│   │   │   └── components/
│   │   │       ├── Reviews.tsx
│   │   │       └── ReviewForm.tsx
│   │   │
│   │   └── testimonials/       # شهادات العملاء
│   │       └── components/
│   │           └── Testimonials.tsx
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── UI/
│   │   │   │   ├── LoadingScreen.tsx
│   │   │   │   ├── SplashScreen.tsx
│   │   │   │   ├── LazyImage.tsx
│   │   │   │   ├── SectionHeader.tsx
│   │   │   │   └── Page404.tsx
│   │   │   ├── Layout/
│   │   │   │   ├── PageLayout.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   └── Effects/
│   │   │       ├── PageTransition.tsx
│   │   │       ├── Particles.tsx
│   │   │       ├── SectionDivider.tsx
│   │   │       └── ErrorBoundary.tsx
│   │   ├── context/
│   │   │   ├── ThemeContext.tsx
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   ├── useLocale.ts
│   │   │   ├── useCrudTab.ts
│   │   │   ├── useCountUp.ts
│   │   │   └── useConfirmDelete.ts
│   │   ├── styles/             # 27 ملف CSS
│   │   └── utils/
│   │       └── safeStorage.ts
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx       # جميع المسارات
│   │
│   ├── fallbackData.ts         # بيانات افتراضية
│   ├── types.ts                # التصنيفات الرئيسية
│   ├── App.tsx                 # المكون الجذري
│   └── main.tsx                # نقطة الدخول
│
├── public/                     # ملفات ثابتة
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   └── hash-password.ts        # أداة تشفير كلمات المرور
├── vercel.json                 # إعدادات Vercel
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### نمط التصميم
- **Feature-based architecture:** كل ميزة في مجلد منفصل
- **Shared components:** مكونات مشتركة في `shared/`
- **Barrel exports:** ملفات index.ts للتصدير
- **Path aliases:** `@/` → `src/`
- **Lazy loading:** صفحات ثانوية محمّلة بشكل كسول

### تدفق البيانات
```
المستخدم → React Component → API Client (Axios)
    → /api/data (Vercel Serverless)
    → Vercel Blob (JSON file)
    → Response → Component State → UI
```

### Provider Nesting Order
```
<ErrorBoundary>
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <TrackingContext.Provider>
          <AppRoutes />
        </TrackingContext.Provider>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
</ErrorBoundary>
```

---

## 4. خريطة الملفات الكاملة

### ملفات TypeScript المهمة (50+ ملف)

| الملف | الأسطر | الغرض |
|-------|--------|-------|
| `src/types.ts` | 17 | التصنيفات الرئيسية + barrel exports |
| `src/core/types/app.ts` | 24 | واجهة AppData الكاملة |
| `src/core/types/profile.ts` | 67 | Profile, SocialLink, Skill, Experience, Education |
| `src/core/types/resume.ts` | 62 | ResumeVersion, ResumeSettings, ResumeLayout |
| `src/core/types/project.ts` | 29 | Project, MediaItem |
| `src/core/types/blog.ts` | 26 | BlogPost, BlogComment |
| `src/core/store.ts` | 119 | حالة البيانات العامة + enqueueWrite |
| `src/fallbackData.ts` | 57 | بيانات افتراضية |
| `src/api/profile.ts` | 33 | CRUD للملف الشخصي |
| `src/api/projects.ts` | 42 | CRUD للمشاريع |
| `src/api/blog.ts` | 54 | CRUD للمدونة |
| `src/api/resume.ts` | 93 | إدارة إصدارات السيرة الذاتية |
| `src/api/reviews.ts` | 26 | التقييمات |
| `src/api/client.ts` | 74 | Axios instance + interceptors |
| `src/routes/AppRoutes.tsx` | 156 | جميع المسارات |
| `src/App.tsx` | 31 | المكون الجذري |

### ملفات API الخادمية (9 ملفات)

| الملف | HTTP | الغرض |
|-------|------|-------|
| `api/data/index.ts` | GET/PUT | قراءة/كتابة البيانات |
| `api/data/upload.ts` | POST | رفع الصور |
| `api/data/image.ts` | GET | عرض الصور |
| `api/auth/login.ts` | POST | تسجيل الدخول |
| `api/messages/index.ts` | POST | إرسال رسائل |
| `api/reviews/index.ts` | POST | إرسال تقييمات |
| `api/visitors/index.ts` | POST/GET/DELETE | تتبع الزوار |
| `api/analytics/index.ts` | POST/GET/DELETE | التحليلات |
| `api/lib/blobUtils.ts` | — | أدوات Blob |

### ملفات CSS (27 ملف)

جميعها في `src/shared/styles/`:

| الملف | الغرض |
|-------|-------|
| `global.css` | الاستيراد الجماعي |
| `variables.css` | المتغيرات (ألوان، خطوط، مسافات) |
| `base.css` | إعادة تعيين الأنماط |
| `nav.css` | شريط التنقل |
| `hero.css` | قسم البطل |
| `about.css` | قسم عني |
| `skills.css` | المهارات |
| `projects.css` | المشاريع |
| `experience.css` | الخبرات |
| `certifications.css` | الشهادات |
| `testimonials.css` | شهادات العملاء |
| `reviews.css` | التقييمات |
| `contact.css` | نموذج التواصل |
| `blog.css` | المدونة |
| `resume.css` | السيرة الذاتية |
| `admin.css` | لوحة التحكم |
| `admin-utility.css` | أدوات لوحة التحكم |
| `splash.css` | شاشة التحميل |
| `footer.css` | التذييل |
| `responsive.css` | المتجاوب |
| `rtl.css` | RTL |
| `buttons.css` | الأزرار |
| `animations.css` | الحركات |
| `utils.css` | أدوات مساعدة |
| `lightbox.css` | عارض الصور |
| `print.css` | الطباعة |
| `404.css` | صفحة 404 |

### Hooks (6)

| الملف | الغرض |
|-------|-------|
| `useLocale` | تحديد اللغة الحالية + local() |
| `useCrudTab` | حالة CRUD عامة للتابات |
| `useCountUp` | عداد متحرك |
| `useConfirmDelete` | تأكيد الحذف |
| `useVisitorTracking` | تتبع الزوار (admin) |

### Contexts (3)

| الملف | الغرض |
|-------|-------|
| `ThemeContext` | الثيم الداكن/الفاتح |
| `AuthContext` | حالة المصادقة |
| `TrackingContext` | تتبع الأحداث |

---

## 5. نظام البيانات والتخزين

### بنية البيانات (AppData)
```typescript
interface AppData {
  profile: Profile;             // الملف الشخصي
  socialLinks: SocialLink[];    // روابط التواصل
  skills: Skill[];              // المهارات
  experience: Experience[];     // الخبرات
  education: Education[];       // التعليم
  projects: Project[];          // المشاريع
  certifications: Certification[]; // الشهادات
  blogPosts: BlogPost[];        // المقالات
  testimonials: Testimonial[];  // الشهادات
  reviews: Review[];            // التقييمات
  messages: Message[];          // الرسائل
  settings: Record<string, string>; // الإعدادات
  resumeVersions: ResumeVersion[]; // إصدارات السيرة الذاتية
}
```

### Profile Interface
```typescript
interface Profile {
  id: number;
  fullName: string;
  fullNameAr: string;
  firstName: string;
  firstNameAr: string;
  middleName: string;
  middleNameAr: string;
  lastName: string;
  lastNameAr: string;
  jobTitle: string;
  jobTitleAr: string;
  bio: string;
  bioAr: string;
  photoUrl: string;
  email: string;
  location: string;
  locationAr: string;
  heroEffect: 'Parallax' | '3D' | 'None';
  themeColor: string;
  customStats?: { label: string; labelAr: string; value: string }[];
}
```

### التخزين
- **النوع:** Vercel Blob (ملف JSON واحد)
- **المفتاح:** `portfolio/data.json`
- **الوصول:** خاص (Private)
- **النسخ الاحتياطي:** لا يوجد (يُنصح بإضافته)

### نمط الكتابة (Write Pattern)
```
1. قراءة البيانات الحالية (readBlob)
2. الدمج مع التغييرات (spread/merge)
3. الكتابة (writeBlob with allowOverwrite)
4. التحقق من الكتابة (retry read)
```

### نظام الطابور (Queue System)
```typescript
// src/core/store.ts
let pendingWrite: Promise<void> = Promise.resolve();

function enqueueWrite<T>(fn: () => Promise<T>): Promise<T> {
  const chained = pendingWrite.then(() => fn(), () => fn());
  pendingWrite = chained.then(() => {}, () => {});
  return chained;
}
```
- يضمن أن الكتابات متتالية
- يمنع تعارض الكتابات المتزامنة
- **ملاحظة:** بعض المسارات تتجاوز الطابور (resume, import)

---

## 6. واجهة API الخادمية

### المصادقة
```
POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string, email: string } | { error: string }
```

### البيانات
```
GET  /api/data                → AppData | null (عام)
PUT  /api/data                → AppData (محمي بـ JWT)
POST /api/data/upload         → { url: string } (محمي بـ JWT)
GET  /api/data/image?file=xxx → صورة (عام)
```

### الرسائل
```
POST /api/messages
Body: { name, phone, subject, messageText }
Response: { success: true, message: Message }
```

### التقييمات
```
POST /api/reviews
Body: { name, rating, comment, avatarUrl }
Response: { success: true, review: Review }
```

### الزوار
```
POST   /api/visitors    → تتبع زيارة (عام)
GET    /api/visitors    → إحصائيات (admin)
DELETE /api/visitors    → حذف (admin)
```

### التحليلات
```
POST   /api/analytics   → تتبع ( عام)
GET    /api/analytics   → تفاصيل (admin)
DELETE /api/analytics   → حذف (admin)
```

---

## 7. الواجهة الأمامية — الصفحات

### الصفحة الرئيسية (`/`)
```
┌─────────────────────────────────────┐
│  Hero: صورة + اسم + وصف + أزرار CTA │
│  + إحصائيات مخصصة                   │
├─────────────────────────────────────┤
│  About: نبذة شخصية + معلومات تواصل  │
├─────────────────────────────────────┤
│  Skills: المهارات + أشرطة تقدم      │
├─────────────────────────────────────┤
│  Projects: شبكة مشاريع + تصفية      │
├─────────────────────────────────────┤
│  Experience: خط زمني للخبرات        │
├─────────────────────────────────────┤
│  Certifications: الشهادات (3 فقط)   │
├─────────────────────────────────────┤
│  Reviews: تقييمات الزوار            │
├─────────────────────────────────────┤
│  Testimonials: شهادات العملاء       │
├─────────────────────────────────────┤
│  Contact: نموذج إرسال رسائل         │
├─────────────────────────────────────┤
│  Footer: تذييل مع روابط             │
└─────────────────────────────────────┘
```

### صفحة السيرة الذاتية (`/resume`)
```
┌─────────────────────────────────────┐
│  [ATS] [العادية]   ← تبويبان       │
├─────────────────────────────────────┤
│  السيرة الذاتية (A4)               │
│  - تصدير PDF                        │
│  - نسخ نص                           │
│  - RTL + LTR                        │
└─────────────────────────────────────┘
```

### صفحة الشهادات (`/certifications`)
- جميع الشهادات مع البحث

### صفحة المحفظة (`/portfolio`)
- جميع المشاريع مع التصفية

### صفحة المدونة (`/blog`)
- قائمة المقالات + مقال فردي + تعليقات

### صفحة التواصل (`/contact`)
- نموذج إرسال رسائل

### صفحة 404 (`/*`)
- صفحة خطأ مخصصة

---

## 8. لوحة التحكم الإدارية

### 14 تبويب إداري

| # | التبويب | المكون | الوظيفة |
|---|---------|--------|---------|
| 1 | Profile | `ProfileTab.tsx` | تعديل الاسم، الصورة، الوصف، المهنة، الموقع، لون الثيم |
| 2 | Social | `SocialTab.tsx` | إدارة روابط التواصل (15 منصة) |
| 3 | Skills | `SkillsTab.tsx` | إضافة/تعديل/حذف/ترتيب المهارات (10 فئات) |
| 4 | Experience | `ExperienceTab.tsx` | إدارة الخبرات العملية |
| 5 | Education | `EducationTab.tsx` | إدارة التعليم |
| 6 | Projects | `ProjectsTab.tsx` | إدارة المشاريع مع الوسائط + 3D |
| 7 | Certifications | `CertificationsTab.tsx` | إدارة الشهادات مع الصور |
| 8 | Blog | `BlogTab.tsx` | إنشاء/تعديل/حذف المقالات |
| 9 | Testimonials | `TestimonialsTab.tsx` | إدارة شهادات العملاء |
| 10 | Reviews | `ReviewsTab.tsx` | مراجعة تقييمات الزوار |
| 11 | Messages | `MessagesTab.tsx` | عرض/حذف رسائل التواصل |
| 12 | Resume | `ResumeTab.tsx` | إدارة إصدارات السيرة الذاتية |
| 13 | Settings | `SettingsTab.tsx` | إعدادات الأقسام، الثيم، كلمة المرور |
| 14 | Analytics | `AnalyticsTab.tsx` | لوحة تحليلات الزوار |

### تبويب السيرة الذاتية الفرعي (5 تبويبات)
| التبويب | المكون | المحتوى |
|---------|--------|---------|
| Layout | `LayoutTab.tsx` | نوع التخطيط، الهوامش، الفجوات |
| Photo | `PhotoTab.tsx` | إظهار/إخفاء الصورة، الحجم، الشكل |
| Colors | `ColorsTab.tsx` | تخصيص الألوان |
| Fonts | `FontsTab.tsx` | نوع الخط وحجمه |
| Sections | `SectionsTab.tsx` | ترتيب الأقسام |

### ميزات لوحة التحكم
- تعديل فوري مع حفظ تلقائي
- سحب وإفلات للترتيب
- تصدير/استيراد JSON
- تأكيد قبل الحذف
- إشعارات نجاح/فشل
- تحديث يدوي للبيانات

---

## 9. نظام المصادقة والأمان

### نمط المصادقة
```
1. المشرف يدخل البريد + كلمة المرور
2. الخادم يتحقق bcrypt hash
3. يُنشأ JWT token (صلاحية 24 ساعة)
4. يُخزن في localStorage
5. Axios interceptor يضيف Authorization header
6. كل طلب PUT يتحقق من JWT
```

### الأمان
- كلمات المرور مشفّرة بـ bcrypt
- JWT مع صلاحية محدودة
- CORS headers
- Blob storage خاص (Private)
- لا بيانات حساسة في الكود

---

## 10. التدويل والدعم اللغوي

### اللغات المدعومة
- **العربية (ar):** الافتراضية، RTL
- **الإنجليزية (en):** LTR

### نظام التدويل
- **i18next** + **react-i18next**
- ملفان: `en.json` + `ar.json` (436 سطر لكل منهما)
- Hook مخصص: `useLocale()` مع دالة `local(obj, field)`
- تبديل اللغة يُخزن في localStorage

---

## 11. التصميم المتجاوب والمسافات

### نقاط التوقف (Breakpoints)
```css
/* جوال صغير */
@media (max-width: 480px) { ... }

/* جوال */
@media (max-width: 768px) { ... }

/* تابلت */
@media (max-width: 1024px) { ... }

/* كمبيوتر */
@media (min-width: 769px) { ... }
```

### نظام التباعد (Spacing System)
```css
/* المتغيرات في variables.css */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.5rem;    /* 24px */
--space-6: 2rem;      /* 32px */
--space-7: 2.5rem;    /* 40px */
--space-8: 3rem;      /* 48px */
```

### نظام الألوان
```css
/* الثيم الداكن (الافتراضي) */
--bg: #0a0e1a;
--bg-card: #111827;
--text: #f3f4f6;
--text-secondary: #9ca3af;
--accent: #c9a84c;
--border: #1f2937;

/* الثيم الفاتح */
[data-theme="light"] {
  --bg: #ffffff;
  --bg-card: #f9fafb;
  --text: #111827;
  --text-secondary: #6b7280;
  --accent: #c9a84c;
  --border: #e5e7eb;
}
```

### المكونات المتجاوبة
- شريط تنقل جوال مع قائمة جانبية
- صورة البطل تصغر على الجوال
- شبكة الأقسام تتحول لعمود واحد
- السيرة الذاتية تُصغّر بـ `zoom` على الجوال
- تبويبات تتناسب مع عرض الشاشة
- زر العودة للأعلى فوق الشريط السفلي

---

## 12. المشاكل التي تم حلها

### Phase 1-5: تحسين الكود (7 مشاكل)
| # | المشكلة | الحل |
|---|---------|------|
| 1 | عدم وجود hook للـ CRUD | إنشاء `useCrudTab` |
| 2 | لا يوجد تأكيد قبل الحذف | إنشاء `useConfirmDelete` |
| 3 | stale closures في callbacks | استخدام refs |
| 4 | عدم ترتيب العناصر | إضافة `sortOrder` + `SortArrows` |
| 5 | عدم مزامنة الملف الشخصي | إضافة `useProfileSync` |
| 6 | تأخير غير ضروري في الإعدادات | إزالة debounce |
| 7 | أخطاء السيرة الذاتية | تحسين معالجة الأخطاء |

### Phase 6: إصلاحات حرجة (6 مشاكل)
| # | المشكلة | الحل |
|---|---------|------|
| 8 | `getErrorMessage` لا يتعامل مع الأرقام | إضافة `String()` coercion |
| 9 | لا يمكن إرسال رسائل عامة | إنشاء POST endpoint بدون مصادقة |
| 10 | Axios يعيد تحميل الصفحة على 401 | تجاهل إذا لا يوجد token |
| 11 | ReviewForm لا يعرض أخطاء API | تحسين معالجة الأخطاء |
| 12 | store.ts يكتب fallback data | رمي خطأ بدل الكتابة |
| 13 | PUT يكتب حتى لو فشل القراءة | إضافة null-check |

### Phase 7-8: ERR_MODULE_NOT_FOUND + PDF (2 مشكلة)
| # | المشكلة | الحل |
|---|---------|------|
| 14 | serverless functions تفشل | إضافة `.js` extensions للـ imports |
| 15 | PDF نصي فقط | استخدام `window.print()` |

### Phase 9: مشاكل الواجهة (12 مشكلة)
| # | المشكلة | الحل |
|---|---------|------|
| 16 | Footer خلف الشريط السفلي | padding-bottom |
| 17 | بطاقات الإحصائيات مكررة | إزالة المكررة |
| 18 | ترجمة الهاتف مفقودة | إضافة الترجمة |
| 19 | خطوط أقسام الصفحة الرئيسية | إزالة الخطوط |
| 20 | لون شريط المهارات | تحسين اللون |
| 21 | أيقونات اللغة/الثيم في الجوال | إزالتها من القائمة |
| 22 | عناوين السيرة الذاتية | إضافة fallback |
| 23 | تأثير البطل | تحسين hologram |
| 24 | حقول الإحصائيات | تحسين الأنواع |
| 25 | منصات التواصل | توسيع لـ 15 منصة |
| 26 | فئات المهارات | توسيع لـ 10 فئات |
| 27 | صور الشهادات | إضافة أسهم التنقل |

### Phase 10: مشاكل المدونة والزوار (4 مشاكل)
| # | المشكلة | الحل |
|---|---------|------|
| 28 | slug المدونة يدوي | إنشاء تلقائي من العنوان |
| 29 | ترجمات فئات المهارات | إضافة ترجمات مفقودة |
| 30 | زر التحديث لا يعمل | إصلاح |
| 31 | إحصائيات مخصصة | إنشاء نظام customStats |

### Phase 11: تحليلات الزوار (1 مشكلة)
| # | المشكلة | الحل |
|---|---------|------|
| 32 | لا يوجد تتبع زوار | إنشاء نظام analytics كامل |

### Phase 12-13: فقدان البيانات + شاشة التحميل (3 مشاكل)
| # | المشكلة | الحل |
|---|---------|------|
| 33 | messages/reviews تمسح البيانات | null-check + حماية |
| 34 | fetchAll يُرجع fallback بصمت | رمي خطأ |
| 35 | صفحة تحميل غير جذابة | إعادة تصميم كاملة |

### Phase 14: السيرة الذاتية في الجوال (3 مشاكل)
| # | المشكلة | الحل |
|---|---------|------|
| 36 | السيرة الذاتية كبيرة في الجوال | zoom scaling |
| 37 | التبويبات خلف الشريط العلوي | padding-top |
| 38 | السيرة الذاتية غير متوسطة | زيادة max-width |

### Phase 15: إصلاح فقدان البيانات (3 مشاكل)
| # | المشكلة | الحل |
|---|---------|------|
| 39 | `messages/index.ts` يمسح كل البيانات | null-check + إيقاف الكتابة |
| 40 | `reviews/index.ts` نفس المشكلة | null-check + إيقاف الكتابة |
| 41 | `fetchAll` يُرجع fallback data | رمي خطأ |

---

## 13. المميزات المُنجزة

### الميزات الأساسية (25)
- [x] موقع بورتفوليو متكامل
- [x] لوحة تحكم إدارية (14 تبويب)
- [x] نظام مصادقة (JWT + bcrypt)
- [x] تخزين سحابي (Vercel Blob)
- [x] بناء سيرة ذاتية متعدد الإصدارات (ATS + عادي)
- [x] دعم RTL + LTR
- [x] تصميم متجاوب (جوال + تابلت + كمبيوتر)
- [x] ثيم داكن/فاتح
- [x] تدويل (عربي + إنجليزي)
- [x] حركات وتأثيرات (Framer Motion)
- [x] مدونة مع تعليقات
- [x] نموذج تواصل
- [x] تقييمات الزوار
- [x] شهادات العملاء
- [x] تتبع الزوار + تحليلات
- [x] شاشة تحميل احترافية
- [x] تصدير PDF للسيرة الذاتية
- [x] رفع الصور مع تحويل WebP
- [x] إشعارات Toast
- [x] صفحة 404 مخصصة
- [x] SEO (sitemap, robots.txt, structured data)
- [x] تصدير/استيراد JSON
- [x] تحديث يدوي للبيانات
- [x] حماية من فقدان البيانات (null-check)

### الميزات التقنية (10)
- [x] Code splitting (lazy loading)
- [x] Manual chunks (vendor-react, vendor-motion, etc.)
- [x] Path aliases (`@/`)
- [x] Write queue (enqueueWrite)
- [x] Retry verification for blob writes
- [x] Image proxy (private blob → public URL)
- [x] Safe storage (localStorage wrapper)
- [x] Error boundary
- [x] TypeScript strict mode
- [x] Vite optimizations

---

# الجزء الثاني: العملية التقنية

---

## 14. ربط المشروع مع Vercel

### الخطوة 1: إعداد Vercel CLI
```bash
npm install -g vercel
vercel login
```

### الخطوة 2: إنشاء مشروع Vercel
```bash
cd my-profile
vercel
# اختر: Create new project
# اختر: aselalrumili
```

### الخطوة 3: إعداد متغيرات البيئة
```bash
# عبر واجهة Vercel Dashboard
# Settings → Environment Variables

ADMIN_EMAIL=your_email@gmail.com
ADMIN_PASSWORD_HASH=$2a$10$...
JWT_SECRET=your_secret_key
PORTFOLIO_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### الخطوة 4: إنشاء Vercel Blob Store
```bash
# عبر Vercel Dashboard
# Storage → Create Store → Blob
# اختر: Private
# اختر الاسم: portfolio
# اختر Prefix: PORTFOLIO
# انسخ TOKEN إلى متغيرات البيئة
```

### الخطوة 5: النشر
```bash
# نشر تجريبي
vercel

# نشر إنتاجي
vercel --prod
```

### الخطوة 6: إعداد Domain (اختياري)
```bash
# عبر Dashboard → Settings → Domains
# أضف: aseelalrumili.vercel.app
```

### ملاحظات مهمة
- `vercel.json` يحتوي على SPA rewrite rules
- `package.json` يجب أن يحتوي `"type": "module"` لـ ESM
- imports في `api/` يجب أن تستخدم `.js` extensions
- لا تحفظ secrets في الكود

---

## 15. خطوات إنشاء مشروع جديد مشابه

### الخطوة 1: إنشاء المشروع
```bash
npm create vite@latest my-portfolio -- --template react-ts
cd my-portfolio
npm install
```

### الخطوة 2: تثبيت التبعيات
```bash
npm install framer-motion i18next react-i18next react-icons react-router-dom react-toastify axios @vercel/blob bcryptjs jsonwebtoken
npm install -D @vercel/node @types/bcryptjs @types/jsonwebtoken
```

### الخطوة 3: إعداد المشروع
```bash
# إنشاء المجلدات
mkdir -p api/auth api/data api/lib api/messages api/reviews api/visitors api/analytics
mkdir -p src/core/types src/features/{portfolio,admin,blog,certifications,reviews,testimonials,resume}/components
mkdir -p src/shared/{components/{UI,Layout,Effects},context,hooks,styles,utils}
mkdir -p src/routes src/api scripts
```

### الخطوة 4: إعداد TypeScript
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

### الخطوة 5: إعداد Vite
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['react-icons'],
          'vendor-i18n': ['i18next', 'react-i18next'],
          'vendor-toast': ['react-toastify'],
        },
      },
    },
  },
})
```

### الخطوة 6: إعداد API
```bash
# نسخ api/lib/blobUtils.ts
# إنشاء endpoints حسب الحاجة
# إضافة .js extensions لجميع imports
```

### الخطوة 7: إعداد Vercel
```bash
# 1. vercel.json — SPA rewrites
# 2. Environment variables
# 3. Blob store
# 4. vercel --prod
```

### الخطوة 8: إعداد Git
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

### الخطوة 9: CI/CD (اختياري)
```yaml
# .github/workflows/deploy.yml
name: Deploy
on: push: { branches: [main] }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

### الخطوة 10: التحقق
```bash
npm run build
vercel --prod
# اختبار جميع الصفحات
# اختبار لوحة التحكم
# اختبار إرسال رسائل
# اختبار الجوال
```

---

## 16. الأخطاء المعروفة والتحذيرات

### أخطاء حرجة
1. ** فقدان البيانات** — `messages/index.ts` و `reviews/index.ts` يمكنهما مسح جميع البيانات إذا فشل قراءة Blob
2. **缺少 `.js` extensions** — يجب أن تستخدم جميع imports في `api/` صيغة `.js`
3. **`"type": "module"`** — `package.json` يجب أن يحتوي هذا السطر

### أخطاء غير حرجة
4. **Firefox لا يدعم `zoom`** — السيرة الذاتية قد تظهر بحجم غير صحيح
5. **localStorage قد يحذف** — clear cache يحذف token المصادقة
6. **限速 Vercel Blob** — قد تفشل الكتابات المتكررة السريعة

### تحذيرات
7. ** لا توجد نسخ احتياطي تلقائي** — يُنصح بعمل نسخ يدوية دورية
8. ** JWT expiry = 24 ساعة** — يجب تجديد الدخول يومياً
9. ** Vercel Hobby plan** — ~100 deployments/day فقط

---

# الجزء الثالث: التحسينات والمستقبل

---

## 17. التحسينات المستقبلية

### أولوية عالية
- [ ] **نسخ احتياطي تلقائي للبيانات** — حفظ نسخة قبل كل كتابة
- [ ] **إصلاح مشكلة فقدان البيانات** — حماية messages/reviews
- [ ] **إضافة Google Analytics** — بجانب النظام المخصص
- [ ] **تحسين SEO** — meta tags لكل صفحة
- [ ] **PWA** — Progressive Web App مع offline support

### أولوية متوسطة
- [ ] ** نظام تعليقات المدونة** — موافقة المشرف
- [ ] **بحث في المشاريع** — بحث نصي كامل
- [ ] **إشعارات push** — للزوار العائدين
- [ ] **تحسين الأداء** — Core Web Vitals
- [ ] **إضافة لغة ثالثة** — (اختياري)

### أولوية منخفضة
- [ ] **وضع offline** — عرض محتوى مخزن
- [ ] **ترجمة تلقائية** — DeepL API
- [ ] **تحليلات متقدمة** — Heatmaps
- [ ] **A/B testing** — اختبار التصميم
- [ ] **دعم الويب** — Web Components

---

## 18. تحويل المشروع لمنصة SaaS

### الفكرة
تحويل `asil-portfolio` من موقع شخصي إلى **منصة SaaS** تتيح لأي شخص إنشاء بورتفوليو احترافي في دقائق.

### ما تحتاجه لبناء المنصة

#### أولاً: Backend مخصص
| المكون | التقنية | الوصف |
|--------|---------|-------|
| **قاعدة البيانات** | PostgreSQL + Prisma | تخزين بيانات المستخدمين والمحتوى |
| **Cache** | Redis | تسريع الاستعلامات |
| **API Framework** | Next.js API Routes أو NestJS | REST API + WebSocket |
| **المصادقة** | NextAuth.js أو Clerk | OAuth + 2FA + sessions |
| **الملفات** | Cloudflare R2 / AWS S3 | تخزين الصور والملفات |
| **البريد** | Resend / SendGrid | إشعارات البريد الإلكتروني |
| **المراقبة** | Sentry + Datadog | متابعة الأخطاء والأداء |

#### ثانياً: نظام المستخدمين
| الميزة | الوصف |
|--------|-------|
| **التسجيل** | بريد + كلمة مرور + OAuth (Google, GitHub) |
| **الملف الشخصي** | صورة + معلومات + إعدادات |
| **الصلاحيات** | Free / Pro / Enterprise |
| **الجلسات** | إدارة الجلسات النشطة |
| **2FA** | المصادقة الثنائية |

#### ثالثاً: نظام الاشتراكات والدفع
| الخطة | المميزات | السعر |
|--------|----------|-------|
| **Free** | قالب واحد، صفحات 3، عرض محدود | $0/شهر |
| **Pro** | جميع القوالب، صفحات غير محدودة، domain مخصص | $9/شهر |
| **Business** | API access، white-label، دعم فني | $29/شهر |

| المكون | التقنية |
|--------|---------|
| **الدفع** | Stripe Checkout + Billing Portal |
| **الفواتير** | Stripe Invoicing |
| **الضرائب** | Stripe Tax |
| **الاسترجاع** | Stripe Refunds |

#### رابعاً: نظام القوالب
```
القالب الأساسي (الحالي):
├── Hero + About + Skills + Projects
├── Experience + Certifications
├── Reviews + Testimonials
├── Contact + Footer
└── Resume Builder

قوالبات إضافية:
├── Minimal (بسيط + أنيق)
├── Creative (تأثيرات بصرية)
├── Corporate (رسمي)
├── Developer (تقنية)
└── Photographer (صور)
```

| المكون | التقنية |
|--------|---------|
| **محرر القوالب** | React DnD + JSON Schema |
| **تخصيص الألوان** | CSS Variables + Color Picker |
| **تخصيص الخطوط** | Google Fonts API |
| **معاينة مباشرة** | Live Preview + Device Frames |
| **تصدير** | Static HTML + PDF |

#### خامساً: البنية التحتية
| المكون | التقنية | التكلفة الشهرية |
|--------|---------|-----------------|
| **الاستضافة** | Vercel Pro / AWS ECS | $20-100 |
| **قاعدة البيانات** | Supabase / Neon | $0-25 |
| **التخزين** | Cloudflare R2 | $0-10 |
| **الدفع** | Stripe | 2.9% + $0.30/tx |
| **البريد** | Resend | $0-20 |
| **المراقبة** | Sentry | $0-26 |
| **النطاق** | Cloudflare | $10/year |
| **الإجمالي** | | **$30-200/شهر** |

#### سادساً: الأمان والقوانين
| البند | الوصف |
|-------|-------|
| **تشفير** | TLS 1.3 + AES-256 للبيانات |
| **GDPR** | سياسة خصوصية +حقوق المستخدم |
| **SOC 2** | معايير أمان المؤسسات |
| **DDoS Protection** | Cloudflare |
| **WAF** | Web Application Firewall |
| **Backups** | نسخ احتياطي يومي |

### مراحل التطوير

| المرحلة | المدة | المحتوى |
|---------|-------|---------|
| **1: MVP** | 4-6 أسابيع | Backend + Auth + Template 1 |
| **2: Launch** | 2-4 أسابيع | Payments + Admin + Testing |
| **3: Growth** | 4-8 أسابيع | Templates 2-3 + Analytics + SEO |
| **4: Scale** | 8-12 أسبوع | Enterprise + API + White-label |
| **5: Optimize** | مستمر | Performance + Features |

### الفريق المطلوب
| الدور | العدد | المسؤولية |
|-------|-------|----------|
| **Full-stack Developer** | 1-2 | Backend + Frontend |
| **UI/UX Designer** | 1 | تصميم القوالب |
| **DevOps** | 0.5 | البنية التحتية |
| **Product Manager** | 0.5 | إدارة المنتج |

---

## 19. البنية التحتية للمنصة

### Tech Stack النهائي

#### Frontend
| الطبقة | التقنية | الإصدار |
|--------|---------|---------|
| **Web** | React + TypeScript + Vite | 18.3 + 5.4 |
| **Mobile** | React Native CLI + TypeScript | 0.74+ |
| **State Management** | React Query | 5.x |
| **UI Library** | React Native Paper / NativeBase | Latest |
| **Navigation** | React Navigation | 6.x |
| **HTTP Client** | Axios | 1.7 |
| ** Animations** | React Native Reanimated | 3.x |

#### Backend
| الطبقة | التقنية | الإصدار |
|--------|---------|---------|
| **Framework** | ASP.NET Core Web API | 8.0 |
| **ORM** | Entity Framework Core | 8.0 |
| **Database** | MySQL | 8.0 |
| **Auth** | ASP.NET Identity + JWT | 8.0 |
| **API Design** | REST API | OpenAPI 3.0 |
| **Documentation** | Swagger / Swashbuckle | 6.5 |
| **Validation** | FluentValidation | 11.x |
| **Logging** | Serilog | 3.x |
| **Caching** | Redis (StackExchange.Redis) | 2.x |

#### DevOps & Infrastructure
| البند | التقنية | الملاحظات |
|-------|---------|-----------|
| **CI/CD** | GitHub Actions | Build + Test + Deploy |
| **Hosting (حالياً)** | Hostinger VPS | .NET + MySQL |
| **Hosting (مستقبلي)** | Azure VM | Windows Server + IIS |
| **Storage** | Cloudflare R2 | S3-compatible + CDN |
| **Search** | Meilisearch | Self-hosted على Azure |
| **Email** | Resend / SMTP | Transactional emails |
| **Monitoring** | Sentry + Application Insights | Error tracking |
| **Payments** | Stripe | Subscriptions + Invoices |

### مخطط البنية التحتية
```
┌─────────────────────────────────────────────────────────┐
│                    المستخدم                              │
│              (Web Browser / Mobile App)                  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│                   Cloudflare CDN                         │
│              (Static Assets + DDoS Protection)           │
└──────────────────────┬───────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  React Web  │ │ React Native│ │  Swagger    │
│  (Vercel/   │ │   (Expo/    │ │   docs      │
│   Hostinger)│ │   Build)    │ │             │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │
       └───────────────┼───────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              .NET 8 Web API (Hostinger/Azure)             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Auth    │ │  CRUD    │ │ Payments │ │ Search   │   │
│  │ Controller│ │Controller│ │Controller│ │Controller│   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
│       │            │            │            │           │
│       └────────────┼────────────┼────────────┘           │
│                    │                                    │
│              ┌─────▼─────┐                              │
│              │    EF     │                              │
│              │   Core    │                              │
│              └─────┬─────┘                              │
└────────────────────┼────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┐
        │            │            │            │
        ▼            ▼            ▼            ▼
┌─────────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│  MySQL 8    │ │  Redis  │ │Cloudflare│ │Meilisearch│
│  (Azure)    │ │ (Cache) │ │   R2     │ │ (Search) │
└─────────────┘ └─────────┘ └─────────┘ └─────────┘
```

### هيكل المشروع (.NET Backend)
```
PortfolioPlatform/
├── src/
│   ├── PortfolioPlatform.Api/              # Web API Project
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs           # POST /api/auth/login, /register
│   │   │   ├── ProfileController.cs        # GET/PUT /api/profile
│   │   │   ├── SkillsController.cs         # CRUD /api/skills
│   │   │   ├── ExperienceController.cs     # CRUD /api/experience
│   │   │   ├── EducationController.cs      # CRUD /api/education
│   │   │   ├── ProjectsController.cs       # CRUD /api/projects
│   │   │   ├── CertificationsController.cs # CRUD /api/certifications
│   │   │   ├── BlogController.cs           # CRUD /api/blog
│   │   │   ├── TestimonialsController.cs   # CRUD /api/testimonials
│   │   │   ├── ReviewsController.cs        # CRUD /api/reviews
│   │   │   ├── MessagesController.cs       # CRUD /api/messages
│   │   │   ├── ResumeController.cs         # CRUD /api/resume
│   │   │   ├── FileController.cs           # Upload/Download files
│   │   │   ├── SearchController.cs         # Search via Meilisearch
│   │   │   └── AnalyticsController.cs      # GET /api/analytics
│   │   ├── Program.cs                      # Entry point + DI
│   │   ├── appsettings.json                # Configuration
│   │   └── appsettings.Development.json
│   │
│   ├── PortfolioPlatform.Core/             # Business Logic
│   │   ├── Entities/
│   │   │   ├── User.cs                     # ASP.NET Identity User
│   │   │   ├── Profile.cs
│   │   │   ├── Skill.cs
│   │   │   ├── Experience.cs
│   │   │   ├── Education.cs
│   │   │   ├── Project.cs
│   │   │   ├── Certification.cs
│   │   │   ├── BlogPost.cs
│   │   │   ├── Testimonial.cs
│   │   │   ├── Review.cs
│   │   │   ├── Message.cs
│   │   │   └── ResumeVersion.cs
│   │   ├── Interfaces/
│   │   │   ├── IRepository.cs              # Generic repository
│   │   │   ├── IUserService.cs
│   │   │   ├── IFileService.cs
│   │   │   └── ISearchService.cs
│   │   ├── Services/
│   │   │   ├── UserService.cs
│   │   │   ├── FileService.cs              # Cloudflare R2 integration
│   │   │   └── SearchService.cs            # Meilisearch integration
│   │   └── DTOs/
│   │       ├── Auth/
│   │       ├── Profile/
│   │       ├── Skills/
│   │       └── ...
│   │
│   ├── PortfolioPlatform.Infrastructure/   # Data Access
│   │   ├── Data/
│   │   │   ├── AppDbContext.cs             # EF Core DbContext
│   │   │   └── Migrations/                 # EF Core migrations
│   │   ├── Repositories/
│   │   │   ├── Repository.cs               # Generic CRUD
│   │   │   ├── UserRepository.cs
│   │   │   └── ...
│   │   └── Configurations/
│   │       ├── UserConfiguration.cs
│   │       └── ...
│   │
│   └── PortfolioPlatform.Tests/            # Unit Tests
│       ├── Controllers/
│       ├── Services/
│       └── Repositories/
│
├── docker-compose.yml                      # Local development
├── PortfolioPlatform.sln                   # Solution file
└── README.md
```

### هيكل مشروع React Native
```
mobile-app/
├── src/
│   ├── api/
│   │   ├── client.ts                       # Axios instance
│   │   ├── auth.ts                         # Auth API
│   │   ├── profile.ts                      # Profile API
│   │   └── ...
│   ├── components/
│   │   ├── common/                         # Shared components
│   │   ├── profile/                        # Profile components
│   │   ├── skills/                         # Skills components
│   │   └── ...
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── Main/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── SkillsScreen.tsx
│   │   │   ├── ProjectsScreen.tsx
│   │   │   ├── ExperienceScreen.tsx
│   │   │   ├── CertificationsScreen.tsx
│   │   │   ├── BlogScreen.tsx
│   │   │   ├── ContactScreen.tsx
│   │   │   └── ResumeScreen.tsx
│   │   └── Admin/
│   │       ├── DashboardScreen.tsx
│   │       ├── ProfileEditScreen.tsx
│   │       ├── SkillsEditScreen.tsx
│   │       ├── ProjectsEditScreen.tsx
│   │       ├── BlogEditScreen.tsx
│   │       ├── ReviewsManageScreen.tsx
│   │       ├── MessagesManageScreen.tsx
│   │       ├── SettingsScreen.tsx
│   │       └── AnalyticsScreen.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   └── AdminStackNavigator.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProfile.ts
│   │   └── useQuery.ts
│   ├── store/
│   │   ├── authStore.ts                    # React Query
│   │   └── queryClient.ts
│   ├── i18n/
│   │   ├── en.json
│   │   └── ar.json
│   ├── utils/
│   │   ├── storage.ts
│   │   └── theme.ts
│   └── types/
│       └── index.ts
├── android/                                # Android native code
├── ios/                                    # iOS native code
├── App.tsx
└── package.json
```

### API Endpoints النهائية

#### Authentication
```
POST   /api/auth/register          # تسجيل حساب جديد
POST   /api/auth/login             # تسجيل الدخول
POST   /api/auth/refresh           # تجديد JWT token
POST   /api/auth/logout            # تسجيل الخروج
POST   /api/auth/forgot-password   # نسيت كلمة المرور
POST   /api/auth/reset-password    # إعادة تعيين كلمة المرور
```

#### Profile
```
GET    /api/profile                # جلب الملف الشخصي
PUT    /api/profile                # تحديث الملف الشخصي
POST   /api/profile/photo          # رفع الصورة
```

#### Portfolio Sections (CRUD لكل قسم)
```
GET    /api/skills                 # جلب المهارات
POST   /api/skills                 # إضافة مهارة
PUT    /api/skills/{id}            # تحديث مهارة
DELETE /api/skills/{id}            # حذف مهارة
PUT    /api/skills/reorder         # إعادة ترتيب

GET    /api/experience             # جلب الخبرات
POST   /api/experience             # إضافة خبرة
PUT    /api/experience/{id}        # تحديث خبرة
DELETE /api/experience/{id}        # حذف خبرة

# نفس النمط لـ: education, projects, certifications,
# blog, testimonials, reviews, messages, resume
```

#### Files
```
POST   /api/files/upload           # رفع ملف
GET    /api/files/{fileName}       # جلب ملف
DELETE /api/files/{fileName}       # حذف ملف
```

#### Search
```
GET    /api/search?q={query}       # بحث شامل
GET    /api/search/skills?q={q}    # بحث في المهارات
GET    /api/search/projects?q={q}  # بحث في المشاريع
GET    /api/search/blog?q={q}      # بحث في المدونة
```

#### Analytics
```
GET    /api/analytics/dashboard    # إحصائيات لوحة التحكم
GET    /api/analytics/visitors     # بيانات الزوار
GET    /api/analytics/pages        # أكثر الصفحات زيارة
POST   /api/analytics/track        # تتبع حدث
```

### Stripe Integration

#### الخطوات
```
1. إنشاء حساب Stripe
2. إعداد Products + Prices
3. ربط Webhook endpoint
4. إنشاء Checkout Session
5. معالجة Payment Intents
6. إعداد Billing Portal
```

#### النماذج
```csharp
// Subscription Plans
public enum PlanType
{
    Free,       // $0/شهر - ميزات أساسية
    Pro,        // $9/شهر - جميع الميزات
    Business    // $29/شهر - API + White-label
}

// Stripe Products
// prod_xxx → Free Plan
// prod_yyy → Pro Plan
// prod_zzz → Business Plan
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Build & Deploy

on:
  push:
    branches: [main]

jobs:
  build-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with: { dotnet-version: '8.0.x' }
      - run: dotnet restore
      - run: dotnet build --no-restore
      - run: dotnet test --no-build
      - run: dotnet publish -c Release -o ./publish
      - uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_KEY }}
          source: "./publish/*"
          target: "/var/www/portfolio-api"

  build-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'

  build-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: cd mobile-app && npm ci
      - run: cd mobile-app && npx react-native build-android --mode=release
```

### هيكل قاعدة البيانات (MySQL 8)

```sql
-- المستخدمين
CREATE TABLE AspNetUsers (
    Id VARCHAR(36) PRIMARY KEY,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    FullName VARCHAR(255),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- الملف الشخصي
CREATE TABLE Profiles (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId VARCHAR(36) NOT NULL,
    FullName VARCHAR(255),
    FullNameAr VARCHAR(255),
    FirstName VARCHAR(255),
    FirstNameAr VARCHAR(255),
    JobTitle VARCHAR(255),
    JobTitleAr VARCHAR(255),
    Bio TEXT,
    BioAr TEXT,
    PhotoUrl VARCHAR(500),
    Email VARCHAR(255),
    Location VARCHAR(255),
    LocationAr VARCHAR(255),
    ThemeColor VARCHAR(7) DEFAULT '#c9a84c',
    FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id)
);

-- المهارات
CREATE TABLE Skills (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId VARCHAR(36) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    NameAr VARCHAR(255),
    Category VARCHAR(100),
    Level INT DEFAULT 0,
    SortOrder INT DEFAULT 0,
    FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id)
);

-- الخبرات
CREATE TABLE Experiences (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId VARCHAR(36) NOT NULL,
    Title VARCHAR(255) NOT NULL,
    TitleAr VARCHAR(255),
    Company VARCHAR(255),
    CompanyAr VARCHAR(255),
    Period VARCHAR(100),
    Description TEXT,
    DescriptionAr TEXT,
    SortOrder INT DEFAULT 0,
    FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id)
);

-- نفس النمط لـ: Educations, Projects, Certifications,
-- BlogPosts, Testimonials, Reviews, Messages, ResumeVersions
```

### التكلفة الشهرية المتوقعة

| البند | الخطة المجانية | الخطة المدفوعة |
|-------|---------------|---------------|
| **Hostinger VPS** | — | $5-10/شهر |
| **Azure VM (مستقبلي)** | — | $20-50/شهر |
| **MySQL (Azure)** | — | $0-15/شهر |
| **Cloudflare R2** | $0 (10GB مجاني) | $0.015/GB |
| **Meilisearch** | $0 (self-hosted) | $0 |
| **Stripe** | 2.9% + $0.30/tx | 2.9% + $0.30/tx |
| **Domain** | $10/سنة | $10/سنة |
| **Email (Resend)** | $0 (100/day) | $20/شهر |
| **Sentry** | $0 (5K events) | $26/شهر |
| **GitHub Actions** | $0 (2000 min) | $0 |
| **الإجمالي** | **~$15/شهر** | **~$50-100/شهر** |

---

**تم إنشاء هذا الملف بواسطة OpenCode AI**
**التاريخ:** 2026-07-27
**الإصدار:** 4.0.0
