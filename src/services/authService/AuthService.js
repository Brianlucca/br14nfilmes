import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebaseConfig/FirebaseConfig'

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user
      return user
    })
    .catch((error) => {
      throw error
    })
}

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

export const loginAdmin = () => {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

  return signInWithEmailAndPassword(auth, adminEmail, adminPassword)
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
