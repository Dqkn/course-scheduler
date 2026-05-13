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
    reservations: 'Rezervasyon',
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

  // ── Reservation ──
  reservation: {
    title: 'Derslik Rezervasyon Sistemi',
    subtitle: 'Derslik rezervasyonu yapın veya mevcut rezervasyonlarınızı yönetin.',
    newReservation: 'Yeni Rezervasyon',
    newReservationDesc: 'Uygun derslik arayın ve rezervasyon yapın',
    activeReservations: 'Aktif Rezervasyonlarım',
    activeReservationsDesc: 'Mevcut rezervasyonlarınızı görüntüleyin',
    filterTitle: 'Rezervasyon Filtreleri',
    selectDate: 'Tarih Seçin',
    selectTime: 'Saat Seçin',
    roomType: 'Sınıf Tipi',
    minCapacity: 'Min. Kapasite',
    searchRooms: 'Uygun Derslikleri Ara',
    resultsTitle: 'Filtrelerinize Uygun Sınıflar',
    availableRooms: 'müsait derslik',
    noRooms: 'Uygun derslik bulunamadı',
    noRoomsDesc: 'Seçtiğiniz kriterlere uygun müsait derslik bulunamadı.',
    available: 'Müsait',
    occupied: 'Dolu',
    capacityLabel: 'Kapasite',
    typeLabel: 'Tip',
    blockLabel: 'Blok',
    floorLabel: 'Kat',
    roomLabel: 'Derslik',
    dateLabel: 'Tarih',
    timeLabel: 'Saat',
    person: 'kişi',
    confirmTitle: 'Rezervasyon Onayı',
    confirmQuestion: 'Bu rezervasyonu onaylıyor musunuz?',
    cancel: 'İptal',
    confirm: 'Onayla',
    saving: 'Rezervasyonunuz kaydediliyor...',
    successTitle: 'Başarılı!',
    successDesc: 'Rezervasyonunuz başarıyla kaydedildi.',
    conflictTitle: 'Çakışma!',
    conflictDesc: 'Bu derslik seçilen tarih ve saatte zaten rezerve edilmiş.',
    ok: 'Tamam',
    back: 'Geri',
    activeLabel: 'Aktif',
    cancelReservation: 'İptal Et',
    confirmCancel: 'Evet, İptal Et',
    noActiveReservations: 'Aktif rezervasyonunuz yok',
    noActiveReservationsDesc: 'Henüz bir rezervasyon yapmadınız.',
    createdBy: 'Oluşturan',
    errorNoDate: 'Lütfen bir tarih seçin.',
    errorNoTime: 'En az bir saat aralığı seçmelisiniz.',
    errorPastDate: 'Geçmiş bir tarih seçilemez. Lütfen bugün veya sonrası için bir tarih girin.',
    separateReservations: '{n} ayrı rezervasyon oluşturulacak (her saat dilimi için bir adet)',
    // Admin - All Reservations View
    allReservations: 'Tüm Rezervasyonları Görüntüle',
    allReservationsDesc: 'Tüm akademisyenlerin yaptığı derslik rezervasyonlarını haftalık görünümde inceleyin.',
    allReservationsTitle: 'Tüm Derslik Rezervasyonları',
    allReservationsSubtitle: 'Bu ekranda öğretim elemanları tarafından yapılan tüm derslik rezervasyonlarını haftalık görünümde inceleyebilirsiniz.',
    prevWeek: 'Önceki Hafta',
    nextWeek: 'Sonraki Hafta',
    thisWeek: 'Bu Hafta',
    noReservationsThisWeek: 'Seçili haftada yapılmış derslik rezervasyonu bulunmamaktadır.',
    filterLecturer: 'Öğretim Elemanı',
    filterRoom: 'Derslik',
    filterRoomType: 'Sınıf Tipi',
    filterAll: 'Tümü',
    clearFilters: 'Temizle',
    createdAtLabel: 'Oluşturulma',
  },

  // ── Tooltip ──
  tooltip: {
    capacity: 'Kontenjan',
  },
} as const;

// Recursively convert all readonly string-literal leaf values to `string`
// so that the EN translation file can use different wording while keeping
// the same structural shape.
type DeepStringify<T> =
  T extends readonly string[]
    ? readonly string[]
    : T extends readonly (infer U)[]
      ? readonly DeepStringify<U>[]
      : T extends Record<string, unknown>
        ? { readonly [K in keyof T]: DeepStringify<T[K]> }
        : T extends string
          ? string
          : T;

export type Translations = DeepStringify<typeof tr>;
