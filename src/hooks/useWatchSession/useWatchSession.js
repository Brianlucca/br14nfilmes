import { get, onValue, ref, remove, update } from 'firebase/database'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/authContext/AuthContext'
import { database } from '../../services/firebaseConfig/FirebaseConfig'

const useWatchSession = (sessionCode) => {
  const [session, setSession] = useState(null)
  const [progress, setProgress] = useState({})
  const [participants, setParticipants] = useState([])
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      toast.error('Você precisa estar logado para participar.')
      navigate('/login')
      return
    }

    const sessionRef = ref(database, `sessions/${sessionCode}`)

    const fetchSession = async () => {
      try {
        const snapshot = await get(sessionRef)

        if (snapshot.exists()) {
          const sessionData = snapshot.val()
          setSession(sessionData)

          setProgress(
            sessionData.isSeries
              ? sessionData.progress || {}
              : { completed: false },
          )

          setParticipants(
            sessionData.participants
              ? Object.values(sessionData.participants)
              : [],
          )
        } else {
          toast.error('Sessão não encontrada.')
          navigate('/')
        }
      } catch (error) {
        toast.error('Erro ao buscar a sessão.')
      }
    }

    fetchSession()

    const progressListener = onValue(sessionRef, (snapshot) => {
      const sessionData = snapshot.val()
      if (sessionData) {
        setProgress(sessionData.progress || {})
        setParticipants(
          sessionData.participants
            ? Object.values(sessionData.participants)
            : [],
        )
      }
    })

    return () => {
      progressListener()
    }
  }, [sessionCode, user, navigate])

  const handleCheckboxChange = async (episode) => {
    if (!session) return

    const newProgress = session.isSeries
      ? { ...progress, [episode]: progress[episode] ? 0 : 100 }
      : { completed: !progress.completed }

    setProgress(newProgress)

    try {
      const sessionRef = ref(database, `sessions/${sessionCode}`)
      await update(sessionRef, { progress: newProgress })
    } catch (error) {
      toast.error('Erro ao atualizar o progresso.')
    }
  }

  const handleDeleteSession = async () => {
    try {
      const sessionRef = ref(database, `sessions/${sessionCode}`)
      await remove(sessionRef)
      toast.success('Sessão excluída com sucesso.')
      navigate('/')
    } catch (error) {
      toast.error('Erro ao excluir a sessão.')
    }
  }

  const handleShare = async () => {
    const message = `Junte-se a mim na minha sessão "${session.sessionName}" usando o código: ${sessionCode}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Sessão: ${session.sessionName}`,
          text: message,
          url: window.location.href,
        })
      } catch (error) {
        toast.error('Erro ao compartilhar o código da sessão.')
      }
    } else {
      toast.warn(
        'A funcionalidade de compartilhamento não está disponível neste navegador.',
      )
    }
  }

  return {
    session,
    progress,
    participants,
    handleCheckboxChange,
    handleDeleteSession,
    handleShare,
  }
}

export default useWatchSession
