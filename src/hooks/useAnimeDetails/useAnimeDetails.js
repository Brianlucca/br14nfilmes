import { get, onValue, push, ref, remove, set } from 'firebase/database'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/authContext/AuthContext'
import { database } from '../../services/firebaseConfig/FirebaseConfig'
import { useLocation, useNavigate } from 'react-router-dom'

const useAnimeDetails = (id) => {
  const [anime, setAnime] = useState(null)
  const [comments, setComments] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const animeRef = ref(database, `animes/${id}`)
        const snapshot = await get(animeRef)
        if (snapshot.exists()) {
          setAnime(snapshot.val())
        } else {
          toast.error('Anime não encontrado')
        }
      } catch (error) {
        toast.error('Erro ao buscar detalhes do anime')
      }
    }

    fetchAnimeDetails()
  }, [id])

  useEffect(() => {
    const commentsRef = ref(database, `animes/${id}/comments`)
    onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val()
      setComments(commentsData ? Object.entries(commentsData) : [])
    })
  }, [id])

  useEffect(() => {
    if (user) {
      const favoritesRef = ref(
        database,
        `users/${user.uid}/favorites/anime/${id}`,
      )
      onValue(favoritesRef, (snapshot) => {
        setIsFavorite(snapshot.exists())
      })
    }
  }, [id, user])

  const handleCommentSubmit = async (commentText, replyingTo) => {
    if (!user) {
      toast.error('Usuário não autenticado')
      return
    }

    const roleRef = ref(database, `users/${user.uid}/updateNick/${user.uid}`)
    const roleSnapshot = await get(roleRef)
    const roleData = roleSnapshot.val()

    if (!roleData || !roleData.nickname) {
      toast.warn('Por favor, crie um nickname antes de comentar.')
      navigate('/profile', { state: { from: location.pathname } })
      return
    }

    const comment = {
      text: commentText,
      userName: roleData.nickname,
      createdAt: new Date().toISOString(),
      replyingToName: replyingTo
        ? comments.find(([key]) => key === replyingTo)[1].userName
        : null,
    }

    try {
      await push(ref(database, `animes/${id}/comments`), comment)
      toast.success('Comentário enviado com sucesso!')
    } catch (error) {
      toast.error('Erro ao enviar comentário')
    }
  }

  const handleDeleteComment = async (commentKey) => {
    try {
      await remove(ref(database, `animes/${id}/comments/${commentKey}`))
      toast.success('Comentário deletado com sucesso!')
    } catch (error) {
      toast.error('Erro ao deletar comentário')
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Usuário não autenticado')
      return
    }

    const favoriteRef = ref(database, `users/${user.uid}/favorites/anime/${id}`)

    try {
      if (isFavorite) {
        await remove(favoriteRef)
        setIsFavorite(false)
        toast.success('Anime removido dos favoritos')
      } else {
        await set(favoriteRef, {
          id,
          title: anime.name,
          imageUrl: anime.imageUrl,
          gif: anime.gif,
          addedAt: new Date().toISOString(),
        })
        setIsFavorite(true)
        toast.success('Anime adicionado aos favoritos')
      }
    } catch (error) {
      toast.error('Erro ao atualizar favoritos')
    }
  }

  return {
    anime,
    comments,
    isFavorite,
    handleCommentSubmit,
    handleDeleteComment,
    toggleFavorite,
  }
}

export default useAnimeDetails
