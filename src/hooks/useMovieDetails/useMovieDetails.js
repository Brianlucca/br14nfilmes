import { get, onValue, push, ref, remove, set } from 'firebase/database'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/authContext/AuthContext'
import { database } from '../../services/firebaseConfig/FirebaseConfig'

const useMovieDetails = (id) => {
  const [movie, setMovie] = useState(null)
  const [comments, setComments] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const { user } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieRef = ref(database, `movies/${id}`)
        const snapshot = await get(movieRef)
        if (snapshot.exists()) {
          setMovie(snapshot.val())
        } else {
          toast.error('Filme não encontrado')
        }
      } catch (error) {
        toast.error('Erro ao buscar detalhes do filme')
      }
    }

    fetchMovieDetails()
  }, [id])

  useEffect(() => {
    const commentsRef = ref(database, `movies/${id}/comments`)
    onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val()
      if (commentsData) {
        setComments(Object.entries(commentsData))
      } else {
        setComments([])
      }
    })
  }, [id])

  useEffect(() => {
    if (user) {
      const favoritesRef = ref(
        database,
        `users/${user.uid}/favorites/movie/${id}`,
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
      await push(ref(database, `movies/${id}/comments`), comment)
      toast.success('Comentário enviado com sucesso!')
    } catch (error) {
      toast.error('Erro ao enviar comentário')
    }
  }

  const handleDeleteComment = async (commentKey) => {
    try {
      await remove(ref(database, `movies/${id}/comments/${commentKey}`))
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

    const favoriteRef = ref(database, `users/${user.uid}/favorites/movie/${id}`)

    try {
      if (isFavorite) {
        await remove(favoriteRef)
        toast.success('Filme removido dos favoritos')
        setIsFavorite(false)
      } else {
        await set(favoriteRef, {
          id,
          title: movie.name,
          imageUrl: movie.imageUrl,
          gif: movie.gif,
          addedAt: new Date().toISOString(),
        })
        toast.success('Filme adicionado aos favoritos')
        setIsFavorite(true)
      }
    } catch (error) {
      toast.error('Erro ao atualizar favoritos')
    }
  }

  return {
    movie,
    comments,
    isFavorite,
    handleCommentSubmit,
    handleDeleteComment,
    toggleFavorite,
  }
}

export default useMovieDetails
