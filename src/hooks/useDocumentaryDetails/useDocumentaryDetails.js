import { get, onValue, push, ref, remove, set, off } from 'firebase/database'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/authContext/AuthContext'
import { database } from '../../services/firebaseConfig/FirebaseConfig'

const useDocumentaryDetails = (id) => {
  const [documentary, setDocumentary] = useState(null)
  const [comments, setComments] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const { user, loading: authLoading } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchDocumentaryDetails = async () => {
      try {
        const docRef = ref(database, `documentaries/${id}`)
        const snapshot = await get(docRef)
        if (snapshot.exists()) {
          setDocumentary(snapshot.val())
        } else {
          toast.error('Documentário não encontrado')
        }
      } catch (error) {
        toast.error('Erro ao buscar detalhes do documentário')
      }
    }

    fetchDocumentaryDetails()
  }, [id])

  useEffect(() => {
    const commentsRef = ref(database, `documentaries/${id}/comments`)
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val()
      if (commentsData) {
        setComments(Object.entries(commentsData))
      } else {
        setComments([])
      }
    })

    return () => off(commentsRef, 'value', unsubscribe)
  }, [id])

  useEffect(() => {
    if (user && user.uid) {
      const favoritesRef = ref(
        database,
        `users/${user.uid}/favorites/documentary/${id}`,
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
      await push(ref(database, `documentaries/${id}/comments`), comment)
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
      await remove(ref(database, `documentaries/${id}/comments/${commentKey}`))
      toast.success('Comentário deletado com sucesso!')
    } catch (error) {
      toast.error('Erro ao deletar comentário')
    }
  }

  const handleToggleFavorite = async () => {
    if (authLoading) {
      toast.info('Aguardando informações do perfil...')
      return
    }
    if (!user || !user.uid) {
      toast.error('Você precisa estar logado para adicionar aos favoritos')
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    const favoriteRef = ref(
      database,
      `users/${user.uid}/favorites/documentary/${id}`,
    )

    try {
      if (isFavorite) {
        await remove(favoriteRef)
        setIsFavorite(false)
        toast.success('Documentário removido dos favoritos')
      } else {
        await set(favoriteRef, {
          id,
          title: documentary.name,
          imageUrl: documentary.imageUrl,
          gif: documentary.gif,
          addedAt: new Date().toISOString(),
        })
        setIsFavorite(true)
        toast.success('Documentário adicionado aos favoritos')
      }
    } catch (error) {
      toast.error('Erro ao atualizar favoritos')
    }
  }

  return {
    documentary,
    comments,
    isFavorite,
    handleCommentSubmit,
    handleDeleteComment,
    handleToggleFavorite,
  }
}

export default useDocumentaryDetails
