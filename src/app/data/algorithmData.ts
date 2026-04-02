/**
 * ─── Algorithm Input Data ───────────────────────────────────────────────────
 * Converted from bil 2.xlsx (OptiSched-Shared repository)
 * 45 courses from BİL (Computer Engineering) department curriculum
 *
 * Fields:
 *   code     — Course code (e.g. "BİL110")
 *   name     — Full course name
 *   hour     — Total weekly hours
 *   semester — Curriculum semester (1–8)
 *   section  — Number of parallel sections (şube)
 *   lecturer — Instructor name ("anonim" = TBA/pool)
 * ────────────────────────────────────────────────────────────────────────────
 */

export interface AlgorithmInput {
  code: string;
  name: string;
  hour: number;
  semester: number;
  section: number;
  lecturer: string;
}

export const ALGORITHM_COURSES: AlgorithmInput[] = [
  // ── Semester 1 ─────────────────────────────────────────────────────────
  { code: 'BİL110', name: 'BİLGİSAYAR MÜHENDİSLİĞİNE GİRİŞ', hour: 2, semester: 1, section: 1, lecturer: 'emre sümer' },
  { code: 'MAT151', name: 'MATEMATİKSEL ANALİZ I', hour: 5, semester: 1, section: 3, lecturer: 'anonim' },
  { code: 'BİL101', name: 'BİLGİSAYAR YAZILIMI I', hour: 4, semester: 1, section: 3, lecturer: 'anonim' },
  { code: 'BİL105', name: 'PROGRAMLAMA LABORATUVARI I', hour: 2, semester: 1, section: 5, lecturer: 'anonim' },
  { code: 'ENG199', name: 'ADVANCED ENGLISH I', hour: 4, semester: 1, section: 4, lecturer: 'anonim' },
  { code: 'FİZ103', name: 'MEKANİK LABORATUVARI', hour: 2, semester: 1, section: 2, lecturer: 'anonim' },
  { code: 'FİZ105', name: 'GENEL FİZİK I', hour: 4, semester: 1, section: 2, lecturer: 'anonim' },

  // ── Semester 2 ─────────────────────────────────────────────────────────
  { code: 'BİL122', name: 'İLERİ PROGRAMLAMA', hour: 4, semester: 2, section: 1, lecturer: 'çağatay berke erdaş' },
  { code: 'BİL124', name: 'İLERİ PROGRAMLAMA UYGULAMALARI', hour: 2, semester: 2, section: 5, lecturer: 'çağatay berke erdaş' },
  { code: 'BİL172', name: 'YAŞAM BİLİMLERİ VE BİLGİSAYAR MÜHENDİSLİĞİ', hour: 3, semester: 2, section: 2, lecturer: 'tolga tarkan ölmez' },
  { code: 'MAT152', name: 'MATEMATİKSEL ANALİZ II', hour: 5, semester: 2, section: 3, lecturer: 'anonim' },
  { code: 'MAT210', name: 'DOĞRUSAL CEBİR', hour: 3, semester: 2, section: 2, lecturer: 'anonim' },
  { code: 'FİZ104', name: 'ELEKTRİK LABORATUVARI', hour: 2, semester: 2, section: 2, lecturer: 'anonim' },
  { code: 'FİZ110', name: 'GENEL FİZİK II', hour: 4, semester: 2, section: 2, lecturer: 'anonim' },

  // ── Semester 3 ─────────────────────────────────────────────────────────
  { code: 'BİL231', name: 'AYRIK YAPILAR', hour: 4, semester: 3, section: 2, lecturer: 'nizami gasilov' },
  { code: 'BİL265', name: 'VERİ YAPILARI', hour: 4, semester: 3, section: 2, lecturer: 'oğul göçmen' },
  { code: 'BİL275', name: 'SAYISAL MANTIK TASARIMI', hour: 5, semester: 3, section: 2, lecturer: 'iclal çetin taş' },
  { code: 'ENG200', name: 'ADVANCED ENGLISH II', hour: 4, semester: 3, section: 4, lecturer: 'anonim' },

  // ── Semester 4 ─────────────────────────────────────────────────────────
  { code: 'BİL210', name: 'ELEKTRONİĞE GİRİŞ', hour: 5, semester: 4, section: 2, lecturer: 'oğul göçmen' },
  { code: 'BİL218', name: 'BİLGİSAYAR ORGANİZASYONU', hour: 4, semester: 4, section: 2, lecturer: 'iclal çetin taş' },
  { code: 'BİL240', name: 'PROGRAMLAMA DİLLERİ', hour: 4, semester: 4, section: 1, lecturer: 'emre sümer' },
  { code: 'MAT250', name: 'OLASILIK VE İSTATİSTİK', hour: 4, semester: 4, section: 2, lecturer: 'elmas burcu mamak ekinci' },
  { code: 'MAT286', name: 'BİLGİSAYAR MÜHENDİSLİĞİ İÇİN MATEMATİK', hour: 4, semester: 4, section: 2, lecturer: 'nizami gasilov' },
  { code: 'SOS203', name: 'EKONOMİ', hour: 3, semester: 4, section: 1, lecturer: 'anonim' },

  // ── Semester 5 ─────────────────────────────────────────────────────────
  { code: 'BİL324', name: 'MİKROİŞLEMCİLER', hour: 5, semester: 5, section: 2, lecturer: 'emre sümer' },
  { code: 'BİL343', name: 'NESNE YÖNELİMLİ PROGRAMLAMA', hour: 4, semester: 5, section: 1, lecturer: 'murat hacıömeroğlu' },
  { code: 'BİL367', name: 'ALGORİTMALAR', hour: 4, semester: 5, section: 2, lecturer: 'didem ölçer' },
  { code: 'MAT311', name: 'SAYISAL ANALİZ TEKNİKLERİ', hour: 5, semester: 5, section: 2, lecturer: 'elmas burcu mamak ekinci' },
  { code: 'SOS204', name: 'İŞLETME', hour: 3, semester: 5, section: 1, lecturer: 'alperen öztürk' },

  // ── Semester 6 ─────────────────────────────────────────────────────────
  { code: 'BİL001', name: 'TEKNİK SEÇİMLİK I', hour: 3, semester: 6, section: 1, lecturer: 'anonim' },
  { code: 'BİL007', name: 'SOSYAL SEÇİMLİK', hour: 3, semester: 6, section: 1, lecturer: 'anonim' },
  { code: 'BİL332', name: 'İŞLETİM SİSTEMLERİ', hour: 4, semester: 6, section: 2, lecturer: 'mehmet dikmen' },
  { code: 'BİL344', name: 'VERİTABANI SİSTEMLERİ', hour: 5, semester: 6, section: 1, lecturer: 'murat hacıömeroğlu' },
  { code: 'BİL386', name: 'YAZILIM MÜHENDİSLİĞİNE GİRİŞ', hour: 5, semester: 6, section: 2, lecturer: 'didem ölçer' },
  { code: 'ENG330', name: 'DEVELOPING ENGLISH LANGUAGE SKILLS', hour: 4, semester: 6, section: 4, lecturer: 'anonim' },

  // ── Semester 7 ─────────────────────────────────────────────────────────
  { code: 'BİL002', name: 'TEKNİK SEÇİMLİK II', hour: 3, semester: 7, section: 1, lecturer: 'anonim' },
  { code: 'BİL003', name: 'TEKNİK SEÇİMLİK III', hour: 3, semester: 7, section: 1, lecturer: 'anonim' },
  { code: 'BİL499', name: 'BİLGİSAYAR AĞLARI', hour: 5, semester: 7, section: 2, lecturer: 'çağatay berke erdaş' },
  { code: 'ENG460', name: 'PRESENTATION SKILLS', hour: 4, semester: 7, section: 4, lecturer: 'anonim' },

  // ── Semester 8 ─────────────────────────────────────────────────────────
  { code: 'BİL004', name: 'TEKNİK SEÇİMLİK IV', hour: 3, semester: 8, section: 1, lecturer: 'anonim' },
  { code: 'BİL005', name: 'TEKNİK SEÇİMLİK V', hour: 3, semester: 8, section: 1, lecturer: 'anonim' },
  { code: 'BİL006', name: 'TEKNİK SEÇİMLİK VI', hour: 3, semester: 8, section: 1, lecturer: 'anonim' },
  { code: 'BİL482', name: 'ETİK,TOPLUM VE MESLEK', hour: 3, semester: 8, section: 1, lecturer: 'atilla aşçıoğlu' },
  { code: 'SOS321', name: 'İLETİŞİM', hour: 3, semester: 8, section: 1, lecturer: 'anonim' },
  { code: 'SOS322', name: 'İŞLETME YÖNETİMİNE GİRİŞ', hour: 3, semester: 8, section: 1, lecturer: 'anonim' },
];

/** All named (non-anonymous) lecturers in the dataset */
export const NAMED_LECTURERS = [
  'emre sümer',
  'çağatay berke erdaş',
  'tolga tarkan ölmez',
  'nizami gasilov',
  'oğul göçmen',
  'iclal çetin taş',
  'elmas burcu mamak ekinci',
  'murat hacıömeroğlu',
  'didem ölçer',
  'alperen öztürk',
  'mehmet dikmen',
  'atilla aşçıoğlu',
];
