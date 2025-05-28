import { get, push, ref, set } from 'firebase/database'
import { database } from '../firebaseConfig/FirebaseConfig'

export const fetchMovies = async () => {
  try {
    const moviesRef = ref(database, 'movies')
    const snapshot = await get(moviesRef)
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      return {}
    }
  } catch (error) {
    throw new Error(
      'Não foi possível buscar os filmes. Tente novamente mais tarde.',
    )
  }
}
