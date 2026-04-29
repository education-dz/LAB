import { collection, query, getDocs, onSnapshot, doc, addDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp, orderBy, where, QueryConstraint } from 'firebase/firestore';
import { db, getUserCollection } from '../firebase';
import { Chemical } from '../types/chemical';

export class ChemicalsService {
  static getCollection(schoolId: string) {
    return getUserCollection(schoolId, 'chemicals');
  }

  static async getAll(schoolId: string): Promise<Chemical[]> {
    const q = query(this.getCollection(schoolId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Chemical));
  }
  
  static subscribe(schoolId: string, callback: (chemicals: Chemical[]) => void): () => void {
    const q = query(this.getCollection(schoolId));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Chemical)));
    });
  }

  static async add(schoolId: string, chemical: Omit<Chemical, 'id'>): Promise<string> {
    const docRef = await addDoc(this.getCollection(schoolId), {
      ...chemical,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  }

  static async update(schoolId: string, chemicalId: string, updates: Partial<Chemical>): Promise<void> {
    const docRef = doc(this.getCollection(schoolId), chemicalId);
    await updateDoc(docRef, updates);
  }

  static async delete(schoolId: string, chemicalId: string): Promise<void> {
    const docRef = doc(this.getCollection(schoolId), chemicalId);
    await deleteDoc(docRef);
  }
}
