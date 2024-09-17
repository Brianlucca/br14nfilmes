import { get, push, ref, set } from 'firebase/database'
import { database } from '../firebaseConfig/FirebaseConfig'

export const addDocumentary = async (documentaryData) => {
  try {
    const docRef = push(ref(database, 'documentaries'))
    await set(docRef, documentaryData)
    return docRef.key
  } catch (error) {
    throw new Error(
      'Não foi possível adicionar o documentário. Tente novamente mais tarde.',
    )
  }
}

export const fetchDocumentary = async () => {
  try {
    const docRef = ref(database, 'documentaries')
    const snapshot = await get(docRef)
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      return {}
    }
  } catch (error) {
    throw new Error(
      'Não foi possível buscar os documentários. Tente novamente mais tarde.',
    )
  }
}
