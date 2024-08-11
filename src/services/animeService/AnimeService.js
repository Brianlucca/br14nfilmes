import { get, push, ref, set } from 'firebase/database'
import { database } from '../firebaseConfig/FirebaseConfig'

export const addAnime = async (animeData) => {
  try {
    const animeRef = push(ref(database, 'animes'))
    await set(animeRef, animeData)
    return animeRef.key
  } catch (error) {
    throw new Error(
      'Não foi possível adicionar o anime. Tente novamente mais tarde.',
    )
  }
}

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
