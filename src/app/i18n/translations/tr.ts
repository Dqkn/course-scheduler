export const tr = {
  // ── Genel ──
  beta: 'BETA',
  published: 'Yayınlandı',
  close: 'Kapat',
  reset: 'Sıfırla',

  // ── Gün isimleri ──
  days: {
    Mon: 'Pazartesi',
    Tue: 'Salı',
    Wed: 'Çarşamba',
    Thu: 'Perşembe',
    Fri: 'Cuma',
  } as Record<string, string>,

  // ── Landing ──
  landing: {
    subtitle: 'Modern Üniversiteler için Akıllı Ders Programı Yönetimi.\nBaşlamak için rolünüzü seçin.',
    termBadge: 'Bahar Dönemi 2026 · 15 haftanın 10\'uncusu',
    adminLabel: 'Yönetim',
    adminSublabel: 'Dekanlık & Sekreterlik',
    adminDesc: 'Ders programını bir bakışta görüntüleyin, şubeleri yönetin ve nihai programı yayınlayın.',
    adminFeatures: ['Haftalık program görünümü', 'Şube yönetimi & çakışma çözümü', 'Yayınla & dışa aktar'],
    adminTag: 'YÖNETİM',
    adminEnter: 'Yönetim olarak giriş yap',
    academicLabel: 'Akademik',
    academicSublabel: 'Öğretim Üyesi Portalı',
    academicDesc: 'Haftalık ders programınızı, saat ve derslik bilgileriyle birlikte görüntüleyin.',
    academicFeatures: ['Kişisel takvim görünümü', 'Ders & derslik bilgileri', 'Haftalık ders özeti'],
    academicTag: 'AKADEMİK',
    academicEnter: 'Akademik olarak giriş yap',
    courseCatalog: 'Ders Kataloğu',
    courseCatalogDesc: '12 bölümde 962 dersi inceleyin',
    footer: 'OptiSched v1.0 · Bahar 2026 · Bilgisayar Fakültesi',
  },

  // ── Header ──
  header: {
    dashboard: 'Kontrol Paneli',
    courses: 'Dersler',
    signOut: 'Çıkış Yap',
    lightMode: 'Açık Temaya Geç',
    darkMode: 'Koyu Temaya Geç',
  },

  // ── Login ──
  login: {
    adminTitle: 'Yönetim Portalı',
    academicTitle: 'Akademik Portal',
    adminSubtitle: 'Fakülte ders programını yönetmek için giriş yapın',
    academicSubtitle: 'Ders programınızı görüntülemek için giriş yapın',
    accountId: 'Kullanıcı Adı',
    password: 'Şifre',
    signIn: 'Giriş Yap',
    invalidCredentials: 'Geçersiz kimlik bilgileri. Lütfen tekrar deneyin.',
    disclaimer: 'Giriş yaparak üniversitenin akademik politikalarını ve gizlilik şartlarını kabul etmiş olursunuz.',
    placeholder: 'örn. cberdas',
  },

  // ── Admin Dashboard ──
  admin: {
    title: 'Haftalık Ders Programı',
    sessions: 'oturum',
    manageCourses: 'Ders Yönetimi',
    export: 'Dışa Aktar',
    running: 'Çalışıyor...',
    runAlgorithm: 'Algoritmayı Çalıştır',
  },

  // ── Academic View ──
  academic: {
    title: 'Öğretim Üyesi Ders Programı',
    hoursPerWeek: 'saat / hafta',
    sessions: 'oturum',
    students: 'öğrenci',
    dailySummary: 'Günlük Özet',
    weeklyTotal: 'Haftalık Toplam',
    teachingHours: 'Ders saati',
    freeDay: 'Boş gün',
  },

  // ── Filters ──
  filters: {
    label: 'Filtreler',
    searchPlaceholder: 'Ders, kod ara…',
    allDepartments: 'Tüm Bölümler',
    allLecturers: 'Tüm Öğretim Üyeleri',
    allClasses: 'Tüm Sınıflar',
    allBlocks: 'Tüm Bloklar',
    block: 'Blok',
    allRoomsIn: 'Tüm {block} Derslikleri',
    room: 'Derslik',
  },

  // ── Status Panel ──
  status: {
    title: 'Durum Paneli',
    clear: 'Temiz',
    issues: 'sorun',
    algorithmResult: 'Algoritma Sonucu',
    calculating: 'Hesaplanıyor...',
    executionTime: 'Çalışma süresi',
    placed: 'Yerleşen',
    conflicts: 'Çakışmalar',
    warnings: 'Uyarılar',
    scheduleStats: 'Program İstatistikleri',
    totalSessions: 'Toplam Oturum',
    studentSessions: 'Öğrenci Oturumları',
    roomsUsed: 'Kullanılan Derslik',
    lecturerHours: 'Öğretim Üyesi Saatleri',
    publishProgramme: 'Programı Yayınla',
    resolveFirst: 'Önce çakışmaları çözün',
    fixConflicts: 'Yayınlamak için {n} çakışmayı düzeltin',
  },

  // ── Course Detail Modal ──
  courseDetail: {
    conflict: 'Çakışma',
    lecturer: 'Öğretim Üyesi',
    department: 'Bölüm',
    class: 'Sınıf',
    room: 'Derslik',
    dayTime: 'Gün & Saat',
    enrolment: 'Kayıt Durumu',
    conflictDetected: 'Ders Programı Çakışması Tespit Edildi',
    editCourse: 'Dersi Düzenle',
  },

  // ── Course Management Modal ──
  courseManage: {
    title: 'Ders Şubelerini Yönet',
    description: 'Dersler için paralel şube ekleyin veya kaldırın. \'0\' olarak ayarlayarak dersi tamamen kapatabilirsiniz. Değişiklikleri uygulamak için "Algoritmayı Çalıştır" butonuna basmalısınız.',
    searchPlaceholder: 'Kod, isim ara...',
    noCourses: 'Ders bulunamadı',
    hoursPerWeek: 'Saat/Hafta',
    semester: 'Dönem',
    sections: 'Şube',
    totalActive: 'Aktif ders sayısı:',
    applyAndRun: 'Uygula & Algoritmayı Çalıştır',
  },

  // ── Course Data Table ──
  courseTable: {
    title: 'Ders Kataloğu',
    loading: 'Dersler yükleniyor…',
    coursesOf: 'dersin',
    coursesCount: 'tanesi',
    refresh: 'Yenile',
    retry: 'Tekrar Dene',
    searchPlaceholder: 'Kod veya isimle ara…',
    allDepartments: 'Tüm Bölümler',
    noCourses: 'Ders bulunamadı',
    noCoursesDesc: 'Katalogda henüz ders bulunmuyor. Veriler veritabanından yüklendiğinde burada görünecektir.',
    noMatching: 'Eşleşen ders bulunamadı',
    noMatchingDesc: 'Arama veya filtre kriterlerinizi değiştirmeyi deneyin.',
    dept: 'Bölüm',
    code: 'Kod',
    courseName: 'Ders Adı',
    theory: 'Teori',
    lab: 'Lab',
    sem: 'Dönem',
    statusLabel: 'Durum',
    hr: 'sa',
    online: 'Çevrimiçi',
    inClass: 'Yüz yüze',
    service: 'Servis Dersi',
    showing: 'gösteriliyor',
    departments: 'bölüm',
    welcomePrefix: 'Üniversite ders veritabanı · Hoş geldiniz',
  },

  // ── Tooltip ──
  tooltip: {
    capacity: 'Kontenjan',
  },
} as const;

export type Translations = typeof tr;
