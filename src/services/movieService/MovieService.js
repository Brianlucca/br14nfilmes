import { get, push, ref, set } from 'firebase/database'
import { database } from '../firebaseConfig/FirebaseConfig'

export const addMovie = async (movieData) => {
  try {
    const movieRef = push(ref(database, 'movies'))
    await set(movieRef, movieData)
    return movieRef.key
  } catch (error) {
    console.error('Erro ao adicionar filme:', error)
    throw new Error(
      'Não foi possível adicionar o filme. Tente novamente mais tarde.',
    )
  }
}

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
    console.error('Erro ao buscar filmes:', error)
    throw new Error(
      'Não foi possível buscar os filmes. Tente novamente mais tarde.',
    )
  }
}
