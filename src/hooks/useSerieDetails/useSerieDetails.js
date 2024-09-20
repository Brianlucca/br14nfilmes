import { get, onValue, push, ref, remove, set } from 'firebase/database'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/authContext/AuthContext'
import { database } from '../../services/firebaseConfig/FirebaseConfig'

const useSeriesDetails = (id) => {
  const [series, setSeries] = useState(null)
  const [comments, setComments] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const { user } = useContext(AuthContext)
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
        `users/${user.uid}/favorites/serie/${id}`,
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
      await push(ref(database, `series/${id}/comments`), comment)
      toast.success('Comentário enviado com sucesso!')
    } catch (error) {
      toast.error('Erro ao enviar comentário')
    }
  }

  const handleDeleteComment = async (commentKey) => {
    try {
      await remove(ref(database, `series/${id}/comments/${commentKey}`))
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
