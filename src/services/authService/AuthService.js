import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebaseConfig/FirebaseConfig'

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);
    return user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user
      return user
    })
    .catch((error) => {
      throw error
    })
}

export const logout = () => {
  return signOut(auth)
    .then(() => {
      localStorage.clear()
    })
    .catch((error) => {
      throw error
    })
}
