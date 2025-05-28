import { get, push, ref, set } from 'firebase/database'
import { database } from '../firebaseConfig/FirebaseConfig'

export const fetchSeries = async () => {
  try {
    const seriesRef = ref(database, 'series')
    const snapshot = await get(seriesRef)
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      return {}
    }
  } catch (error) {
    throw new Error(
      'Não foi possível buscar as séries. Tente novamente mais tarde.',
    )
  }
}
