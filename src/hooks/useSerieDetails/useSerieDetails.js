import { get, onValue, push, ref, remove, set, off } from 'firebase/database'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/authContext/AuthContext'
import { database } from '../../services/firebaseConfig/FirebaseConfig'

const useSeriesDetails = (id) => {
  const [series, setSeries] = useState(null)
  const [comments, setComments] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const { user, loading: authLoading } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      try {
        const seriesRef = ref(database, `series/${id}`)
        const snapshot = await get(seriesRef)
        if (snapshot.exists()) {
          setSeries(snapshot.val())
        } else {
          toast.error('Série não encontrada')
        }
      } catch (error) {
        toast.error('Erro ao buscar detalhes da série')
      }
    }

    fetchSeriesDetails()
  }, [id])

  useEffect(() => {
    const commentsRef = ref(database, `series/${id}/comments`)
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val()
      setComments(commentsData ? Object.entries(commentsData) : [])
    })

    return () => off(commentsRef, 'value', unsubscribe)
  }, [id])

  useEffect(() => {
    if (user && user.uid) {
      const favoritesRef = ref(
        database,
        `users/${user.uid}/favorites/serie/${id}`,
      )
      const unsubscribe = onValue(favoritesRef, (snapshot) => {
        setIsFavorite(snapshot.exists())
      })

      return () => off(favoritesRef, 'value', unsubscribe)
    }
  }, [id, user])

  const handleCommentSubmit = async (commentText, replyingTo) => {
    if (authLoading) {
      toast.info('Aguardando informações do perfil...')
      return
    }
    if (!user || !user.uid) {
      toast.error('Você precisa estar logado para comentar.')
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    const defaultNicknamePattern = `Usuário_${user.uid.substring(0, 5)}`

    if (!user.nickname || user.nickname === defaultNicknamePattern) {
      toast.warn('Por favor, defina um nickname no seu perfil para comentar.')
      navigate('/profile', {
        state: { from: location.pathname, needsNickname: true },
      })
      return
    }

    const comment = {
      text: commentText,
      userName: user.nickname,
      userId: user.uid,
      userPhotoURL: user.photoURL,
      createdAt: new Date().toISOString(),
      replyingToName: replyingTo
        ? comments.find(([key]) => key === replyingTo)?.[1]?.userName
        : null,
    }

    try {
      await push(ref(database, `series/${id}/comments`), comment)
      toast.success('Comentário enviado com sucesso!')
    } catch (error) {
      toast.error('Erro ao enviar comentário')
    }
  }

  const handleDeleteComment = async (commentKey) => {
    if (authLoading) {
      toast.info('Aguardando informações do perfil...')
      return
    }
    if (!user || !user.uid) {
      toast.error('Você precisa estar logado para deletar um comentário.')
      return
    }
    try {
      await remove(ref(database, `series/${id}/comments/${commentKey}`))
      toast.success('Comentário deletado com sucesso!')
    } catch (error) {
      toast.error('Erro ao deletar comentário')
    }
  }

  const toggleFavorite = async () => {
    if (authLoading) {
      toast.info('Aguardando informações do perfil...')
      return
    }
    if (!user || !user.uid) {
      toast.error('Você precisa estar logado para adicionar aos favoritos')
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    const favoriteRef = ref(database, `users/${user.uid}/favorites/serie/${id}`)

    try {
      if (isFavorite) {
        await remove(favoriteRef)
        toast.success('Série removida dos favoritos')
        setIsFavorite(false)
      } else {
        await set(favoriteRef, {
          id,
          title: series.name,
          imageUrl: series.imageUrl,
          gif: series.gif,
          addedAt: new Date().toISOString(),
        })
        toast.success('Série adicionada aos favoritos')
        setIsFavorite(true)
      }
    } catch (error) {
      toast.error('Erro ao atualizar favoritos')
    }
  }

  return {
    series,
    comments,
    isFavorite,
    handleCommentSubmit,
    handleDeleteComment,
    toggleFavorite,
  }
}

export default useSeriesDetails
