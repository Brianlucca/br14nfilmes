import { get, push, ref, set } from 'firebase/database'
import { database } from '../firebaseConfig/FirebaseConfig'


export const fetchAnimes = async () => {
  try {
    const animesRef = ref(database, 'animes')
    const snapshot = await get(animesRef)
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      return {}
    }
  } catch (error) {
    throw new Error(
      'Não foi possível buscar os animes. Tente novamente mais tarde.',
    )
  }
}
