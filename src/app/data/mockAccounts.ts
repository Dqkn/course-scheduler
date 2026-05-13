import { NAMED_LECTURERS } from './algorithmData';

export type UserRole = 'dean' | 'department_secretary' | 'academic';

export interface Account {
  id: string;
  name: string;
  password: string;
  role: UserRole;
  department?: string; // e.g. "Bilgisayar Mühendisliği"
}

// Map Turkish characters to English equivalents for username generation
function slugify(text: string): string {
  const trMap: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U',
  };
  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/\s+/g, '');
}

/**
 * Generates username logic:
 * First letter of first name + last name
 * Example: 'çağatay berke erdaş' -> 'cerdas'
 */
export function generateUsername(fullName: string): string {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return slugify(parts[0]);
  
  const firstNameInit = parts[0][0];
  const lastName = parts[parts.length - 1];
  return slugify(firstNameInit + lastName);
}

// 1. Static Admin Accounts
export const STATIC_ADMIN_ACCOUNTS: Account[] = [
  {
    id: 'dekan',
    name: 'Prof. Dr. Dekan',
    password: 'dekan',
    role: 'dean',
  },
  {
    id: 'dekan_yrd',
    name: 'Dekan Yardımcısı',
    password: 'dekan',
    role: 'dean',
  },
  {
    id: 'bil_sekreter',
    name: 'Ayşe Yılmaz (BİL Sekreteri)',
    password: 'bil',
    role: 'department_secretary',
    department: 'Bilgisayar Mühendisliği',
  },
  {
    id: 'yaz_sekreter',
    name: 'Mehmet Kaya (YAZ Sekreteri)',
    password: 'yaz',
    role: 'department_secretary',
    department: 'Yazılım Mühendisliği',
  }
];

// 2. Generate Academic Accounts
export const ACADEMIC_ACCOUNTS: Account[] = NAMED_LECTURERS.map(lecturerName => {
  const id = generateUsername(lecturerName);
  return {
    id,
    name: lecturerName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    password: `${id}123`,
    role: 'academic' as const,
  };
});

// 3. Combined Export
export const ALL_ACCOUNTS: Account[] = [...STATIC_ADMIN_ACCOUNTS, ...ACADEMIC_ACCOUNTS];
