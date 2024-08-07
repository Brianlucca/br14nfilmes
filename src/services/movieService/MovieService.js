import { get, push, ref, set } from 'firebase/database'
import { database } from '../firebaseConfig/FirebaseConfig'

export const addMovie = async (movieData) => {
  try {
    const movieRef = push(ref(database, 'movies'))
    await set(movieRef, movieData)
    return movieRef
  } catch (error) {
    console.error('Erro ao adicionar filme:', error)
    throw error
  }
}

export const fetchMovies = async () => {
  try {
    const moviesRef = ref(database, 'movies')
    const snapshot = await get(moviesRef)
    return snapshot.exists() ? snapshot.val() : []
  } catch (error) {
    console.error('Erro ao buscar filmes:', error)
    throw error
  }
}
