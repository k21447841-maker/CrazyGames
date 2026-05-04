import { db, auth } from '../firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, writeBatch, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { OperationType, handleFirestoreError } from '../firebaseUtils';

export const api = {
  // Games
  getGames: async () => {
    try {
      const q = query(collection(db, 'games'), where('active', '==', true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
    } catch (error) {
      return handleFirestoreError(error, OperationType.GET, 'games');
    }
  },
  getAdminGames: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'games'));
      return querySnapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
    } catch (error) {
      return handleFirestoreError(error, OperationType.GET, 'games');
    }
  },
  getGame: async (id: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'games', id));
      if (!docSnap.exists()) throw new Error('Game not found');
      return { _id: docSnap.id, id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      return handleFirestoreError(error, OperationType.GET, `games/${id}`);
    }
  },
  createGame: async (data: any) => {
    try {
      // Just manually construct the document using doc with empty string (auto-ID)
      const newDocRef = doc(collection(db, 'games'));
      const newGame = {
        ...data,
        createdAt: Date.now()
      };
      await setDoc(newDocRef, newGame);
      return { _id: newDocRef.id, id: newDocRef.id, ...newGame };
    } catch (error) {
      return handleFirestoreError(error, OperationType.CREATE, 'games');
    }
  },
  updateGame: async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'games', id), data);
      return { success: true };
    } catch (error) {
      return handleFirestoreError(error, OperationType.UPDATE, `games/${id}`);
    }
  },
  bulkUpdateGames: async (ids: string[], data: any) => {
    try {
      const batch = writeBatch(db);
      ids.forEach(id => {
         batch.update(doc(db, 'games', id), data);
      });
      await batch.commit();
      return { success: true };
    } catch (error) {
      return handleFirestoreError(error, OperationType.UPDATE, 'games/bulk');
    }
  },
  deleteGame: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'games', id));
      return { success: true };
    } catch (error) {
      return handleFirestoreError(error, OperationType.DELETE, `games/${id}`);
    }
  },
  rateGame: async (id: string, rating: number) => {
    try {
      const gRef = doc(db, 'games', id);
      const snap = await getDoc(gRef);
      if (!snap.exists()) throw new Error('Game not found');
      const data = snap.data();
      const currentRatingMsg = data.rating * data.ratingCount;
      const newCount = data.ratingCount + 1;
      const newRating = (currentRatingMsg + rating) / newCount;
      await updateDoc(gRef, { rating: newRating, ratingCount: newCount, plays: data.plays });
      return { _id: id, id, ...data, rating: newRating, ratingCount: newCount };
    } catch (error) {
      return handleFirestoreError(error, OperationType.UPDATE, `games/${id}`);
    }
  },
  
  // Auth
  login: async () => {
    try {
      const { signInWithPopup } = await import('firebase/auth');
      const { auth, googleProvider } = await import('../firebase');
      const cred = await signInWithPopup(auth, googleProvider);
      
      // Ensure admin bootstrap
      const { ensureAdmin } = await import('../firebase');
      await ensureAdmin(cred.user);
      
      return { token: cred.user.uid, user: { id: cred.user.uid, email: cred.user.email, role: 'admin' } };
    } catch (err) {
      console.error(err);
      throw new Error('Google Login Failed');
    }
  },
  
  // Ads
  getAdSettings: async () => {
    try {
      const snap = await getDoc(doc(db, 'settings', 'ads'));
      if (snap.exists()) return snap.data();
      return { videoEnabled: true, bannerEnabled: true, videoCooldown: 30, bannerInterval: 60 };
    } catch (error) {
      return handleFirestoreError(error, OperationType.GET, 'settings/ads');
    }
  },
  updateAdSettings: async (data: any) => {
    try {
      await setDoc(doc(db, 'settings', 'ads'), { ...data, updatedAt: Date.now() }, { merge: true });
      return { success: true };
    } catch (error) {
      return handleFirestoreError(error, OperationType.UPDATE, 'settings/ads');
    }
  },
};
