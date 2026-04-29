export const SCHOOL_ID_KEY = 'algeria_lab_school_id';
export const DEFAULT_SCHOOL_ID = 'school_001';

export function getCurrentSchoolId(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(SCHOOL_ID_KEY) || DEFAULT_SCHOOL_ID;
  }
  return DEFAULT_SCHOOL_ID;
}

export function setCurrentSchoolId(schoolId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SCHOOL_ID_KEY, schoolId);
  }
}
