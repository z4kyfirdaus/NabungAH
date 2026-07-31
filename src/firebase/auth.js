import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithRedirect, 
  GoogleAuthProvider, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged 
} from 'firebase/auth';
import { app } from './config'; // Pastikan app diimport dari config firebase kamu

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 1. Register Email & Password
export const registerUser = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// 2. Login Email & Password
export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// 3. Login Google
export const loginWithGoogle = async () => {
  return await signInWithRedirect(auth, googleProvider);
};

// 4. Logout
export const logoutUser = async () => {
  return await signOut(auth);
};

// 5. Lupa Password
export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

// 6. Monitor Status Login (Auto Login Check)
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};
