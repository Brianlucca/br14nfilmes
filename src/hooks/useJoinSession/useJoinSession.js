import { get, limitToLast, query, ref, set } from 'firebase/database'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/authContext/AuthContext'
import { database } from '../../services/firebaseConfig/FirebaseConfig'

export const useJoinSession = () => {
  const [sessionCode, setSessionCode] = useState('')
  const [recentSessions, setRecentSessions] = useState([])
  const [inputValues, setInputValues] = useState({})
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (!user) {
      toast.error('Você precisa estar logado para participar')
      navigate('/login')
      return
    }

    const fetchRecentSessions = async () => {
      try {
        const recentSessionsQuery = query(
          ref(database, 'sessions'),
          limitToLast(5),
        )
        const snapshot = await get(recentSessionsQuery)

        if (snapshot.exists()) {
          const sessionsData = snapshot.val()
          const sessionsArray = Object.keys(sessionsData).map((key) => ({
            sessionCode: key,
            ...sessionsData[key],
          }))
          setRecentSessions(sessionsArray.reverse())
        }
      } catch (error) {
        toast.error('Erro ao buscar as sessões recentes.')
      }
    }

    fetchRecentSessions()
  }, [user, navigate])

  const generateUniqueCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString()
  }

  const handleJoin = async (e) => {
    e.preventDefault()

    if (!sessionCode) {
      toast.error('Por favor, insira o código da sessão.')
      return
    }

    try {
      const sessionRef = ref(database, `sessions/${sessionCode}`)
      const sessionSnapshot = await get(sessionRef)

      if (sessionSnapshot.exists()) {
        const userNickRef = ref(
          database,
          `users/${user.uid}/updateNick/${user.uid}`,
        )
        const userNickSnapshot = await get(userNickRef)

        if (userNickSnapshot.exists()) {
          const userNickname = userNickSnapshot.val().nickname || 'Usuário'

          const participantRef = ref(
            database,
            `sessions/${sessionCode}/participants`,
          )
          const participantsSnapshot = await get(participantRef)

          let userAlreadyInSession = false

          if (participantsSnapshot.exists()) {
            const participantsData = participantsSnapshot.val()
            for (const key in participantsData) {
              if (participantsData[key].nickname === userNickname) {
                userAlreadyInSession = true
                break
              }
            }
          }

          if (userAlreadyInSession) {
            navigate(`/watchsession/${sessionCode}`)
          } else {
            const participantCode = generateUniqueCode()
            const participantRef = ref(
              database,
              `sessions/${sessionCode}/participants/${participantCode}`,
            )
            await set(participantRef, { nickname: userNickname })
            navigate(`/watchsession/${sessionCode}`)
          }
        } else {
          navigate('/profile', { state: { from: location.pathname } })
          toast.error('Nickname do usuário não encontrado.')
        }
      } else {
        toast.error('Código da sessão inválido.')
      }
    } catch (error) {
      toast.error('Erro ao verificar o código da sessão.')
    }
  }

  const handleInputChange = (e, sessionKey) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [sessionKey]: e.target.value,
    }))
  }

  const handleJoinSpecificSession = async (code, sessionKey) => {
    try {
      const sessionRef = ref(database, `sessions/${sessionKey}`)
      const sessionSnapshot = await get(sessionRef)

      if (sessionSnapshot.exists() && code === sessionKey) {
        const userNickRef = ref(
          database,
          `users/${user.uid}/updateNick/${user.uid}`,
        )
        const userNickSnapshot = await get(userNickRef)

        if (userNickSnapshot.exists()) {
          const userNickname = userNickSnapshot.val().nickname || 'Usuário'

          const participantRef = ref(
            database,
            `sessions/${sessionKey}/participants`,
          )
          const participantsSnapshot = await get(participantRef)

          let userAlreadyInSession = false

          if (participantsSnapshot.exists()) {
            const participantsData = participantsSnapshot.val()
            for (const key in participantsData) {
              if (participantsData[key].nickname === userNickname) {
                userAlreadyInSession = true
                break
              }
            }
          }

          if (userAlreadyInSession) {
            navigate(`/watchsession/${code}`)
          } else {
            const participantCode = generateUniqueCode()
            const participantRef = ref(
              database,
              `sessions/${sessionKey}/participants/${participantCode}`,
            )
            await set(participantRef, { nickname: userNickname })
            navigate(`/watchsession/${code}`)
          }
        } else {
          navigate('/profile', { state: { from: location.pathname } })
          toast.error('Nickname do usuário não encontrado.')
        }
      } else {
        toast.error('Código da sessão inválido.')
      }
    } catch (error) {
      toast.error('Erro ao verificar o código da sessão.')
    }
  }

  return {
    sessionCode,
    recentSessions,
    inputValues,
    setSessionCode,
    handleJoin,
    handleInputChange,
    handleJoinSpecificSession,
  }
}
