import { useEffect } from 'react';
import { getDocs, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, getUserCollection } from '../firebase';

export default function FirebaseSetup() {
  useEffect(() => {
    const setupData = async () => {
      try {
        const chemicalsSnap = await getDocs(getUserCollection('chemicals'));
        if (chemicalsSnap.empty) {
          const initialChemicals = [
            { nameEn: 'Hydrochloric Acid', nameAr: 'حمض الهيدروكلوريك', formula: 'HCl', casNumber: '7647-01-0', storageTemp: '15-25°C', expiryDate: '2026-05-12', quantity: 5.2, unit: 'L', hazardClass: 'danger', state: 'liquid', ghs: ['GHS05', 'GHS07'], shelf: 'خزانة A-12', notes: 'تركيز 37%' },
            { nameEn: 'Sodium Hydroxide', nameAr: 'هيدروكسيد الصوديوم', formula: 'NaOH', casNumber: '1310-73-2', storageTemp: 'Room Temp', expiryDate: '2025-08-20', quantity: 2.5, unit: 'kg', hazardClass: 'danger', state: 'solid', ghs: ['GHS05'], shelf: 'خزانة B-04', notes: 'نقاوه 98%' },
            { nameEn: 'Ethanol', nameAr: 'إيثانول', formula: 'C2H5OH', casNumber: '64-17-5', storageTemp: 'Cool', expiryDate: '2026-06-20', quantity: 25, unit: 'L', hazardClass: 'danger', state: 'liquid', ghs: ['GHS02', 'GHS07'], shelf: 'خزانة F-01', notes: 'نقاوه 95%' },
            { nameEn: 'Silver Nitrate', nameAr: 'نترات الفضة', formula: 'AgNO3', casNumber: '7761-88-8', storageTemp: 'Dark', expiryDate: '2024-11-02', quantity: 0.5, unit: 'kg', hazardClass: 'danger', state: 'solid', ghs: ['GHS03', 'GHS05', 'GHS09'], shelf: 'خزانة C-02', notes: 'نقاوه 99.8%' },
          ];
          for (const chem of initialChemicals) {
            await addDoc(getUserCollection('chemicals'), chem);
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'chemicals');
      }

      try {
        const equipmentSnap = await getDocs(getUserCollection('equipment'));
        if (equipmentSnap.empty) {
          const initialEquipment = [
            { name: 'كؤوس زجاجية 250ml', type: 'glassware', serialNumber: 'PYREX-B250', status: 'functional', totalQuantity: 120, availableQuantity: 108, brokenQuantity: 12 },
            { name: 'مجهر ضوئي رقمي', type: 'tech', serialNumber: 'SN-882190-BZ', status: 'functional', totalQuantity: 4, availableQuantity: 4, brokenQuantity: 0, lastCalibration: '2023-10-12', nextCalibration: '2024-10-12' },
            { name: 'دوارق مخروطية 500ml', type: 'glassware', serialNumber: 'ER-FL500', status: 'functional', totalQuantity: 85, availableQuantity: 79, brokenQuantity: 6 },
          ];
          for (const eq of initialEquipment) {
            await addDoc(getUserCollection('equipment'), eq);
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'equipment');
      }
    };
    setupData();
  }, []);

  return null;
}
