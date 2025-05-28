import { get, push, ref, set } from 'firebase/database'
import { database } from '../firebaseConfig/FirebaseConfig'

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
