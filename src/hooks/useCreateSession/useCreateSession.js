import { get, ref, set } from 'firebase/database'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/authContext/AuthContext'
import { database } from '../../services/firebaseConfig/FirebaseConfig'

export const useCreateSession = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [sessionName, setSessionName] = useState('')
  const [description, setDescription] = useState('')
  const [isSeries, setIsSeries] = useState(false)
  const [episodes, setEpisodes] = useState(0)
  const [content, setContent] = useState(null)
  const [sessionCode, setSessionCode] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [nameContent, setNameContent] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const categories = ['movies', 'series', 'animes', 'documentaries']
        let found = false

        for (const category of categories) {
          const categoryRef = ref(database, category)
          const snapshot = await get(categoryRef)

          if (snapshot.exists()) {
            const data = snapshot.val()
            for (const [key, value] of Object.entries(data)) {
              if (key === id) {
                setContent(value)
                setSessionName(value.name)
                setDescription(value.description)
                setImageUrl(value.imageUrl || '')
                setNameContent(value.name)

                if (value.type === 'serie' || value.type === 'anime') {
                  setIsSeries(true)
                  if (value.type === 'serie') {
                    setEpisodes(value.episodes || 0)
                  }
                }
                found = true
                break
              }
            }
          }
          if (found) break
        }

        if (!found) {
          toast.error('Conteúdo não encontrado')
        }
      } catch (error) {
        toast.error('Erro ao buscar informações do conteúdo')
      }
    }

    fetchContent()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error('Você precisa estar logado para criar uma sessão')
      navigate('/login')
      return
    }

    const userRef = ref(database, `users/${user.uid}/updateNick/${user.uid}`)
    const userSnapshot = await get(userRef)
    const userData = userSnapshot.val()

    if (!userData || !userData.nickname) {
      toast.warn('Por favor, crie um nickname antes de criar uma sessão.')
      navigate('/profile', { state: { from: location.pathname } })
      return
    }

    const generatedSessionCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()

    const newSession = {
      sessionName,
      description,
      isSeries,
      episodes: isSeries ? episodes : null,
      sessionCode: generatedSessionCode,
      createdBy: userData.nickname,
      createdAt: new Date().toISOString(),
      image: imageUrl,
      contentId: id,
      nameContent,
    }

    try {
      const sessionRef = ref(database, `sessions/${generatedSessionCode}`)
      await set(sessionRef, newSession)
      setSessionCode(generatedSessionCode)
      toast.success('Sessão criada com sucesso!')
      navigate(`/watchsession/${generatedSessionCode}`)
    } catch (error) {
      toast.error('Erro ao criar a sessão')
    }
  }

  return {
    sessionName,
    setSessionName,
    description,
    setDescription,
    isSeries,
    setIsSeries,
    episodes,
    setEpisodes,
    content,
    sessionCode,
    imageUrl,
    setImageUrl,
    nameContent,
    setNameContent,
    handleSubmit,
  }
}
