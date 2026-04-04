import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, collection, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Enable Offline Persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence');
    }
  });
}

export const auth = getAuth(app);

// Set persistence to LOCAL to handle mobile redirects better
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.error("Error setting persistence:", err);
  });
}

export const storage = getStorage(app);

/**
 * Gets a user-scoped collection reference.
 * Path: users/{userId}/{collectionName}
 */
export const getUserCollection = (collectionName: string) => {
  if (!auth.currentUser) {
    throw new Error("User must be authenticated to access personal data");
  }
  return collection(db, 'users', auth.currentUser.uid, collectionName);
};

// Connection test as per critical guidelines
async function testConnection() {
  try {
    // Attempt to fetch a non-existent document from server to test connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('Permission denied'))) {
      const offlineMsg = "خطأ في الاتصال بقاعدة البيانات: يرجى التأكد من إنشاء قاعدة بيانات Firestore في Firebase Console (amatti-education-dz) وتفعيلها.";
      console.error("CRITICAL: " + offlineMsg);
      // We don't throw here to avoid crashing the whole app immediately if it's just a background check,
      // but the handleFirestoreError will catch it during actual data fetching.
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('the client is offline')) {
    const offlineMsg = "فشل الاتصال بقاعدة البيانات. يرجى التأكد من إنشاء قاعدة بيانات Firestore في Firebase Console (amatti-education-dz) وتفعيلها في وضع الإنتاج.";
    console.error(offlineMsg);
    throw new Error(JSON.stringify({
      error: offlineMsg,
      isOffline: true,
      operationType,
      path,
      originalError: errorMessage
    }));
  }

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default app;
