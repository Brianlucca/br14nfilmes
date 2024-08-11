import { get, push, ref, set } from 'firebase/database'
import { database } from '../firebaseConfig/FirebaseConfig'

export const addMusic = async (musicData) => {
  try {
    const musicRef = push(ref(database, 'musics'))
    await set(musicRef, musicData)
    return musicRef.key
  } catch (error) {
    throw new Error(
      'Não foi possível adicionar a música. Tente novamente mais tarde.',
    )
  }
}

export const fetchMusic = async () => {
  try {
    const musicRef = ref(database, 'musics')
    const snapshot = await get(musicRef)
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      return {}
    }
  } catch (error) {
    throw new Error(
      'Não foi possível buscar as músicas. Tente novamente mais tarde.',
    )
  }
}
