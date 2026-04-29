export interface Chemical {
  id: string;
  nameEn: string;
  nameAr: string;
  formula: string;
  casNumber?: string;
  storageTemp?: string;
  unit: string;
  quantity: number;
  state: string;
  hazardClass: string;
  ghs: string[];
  shelf: string;
  expiryDate: string;
  notes: string;
}
