import { get, ref, serverTimestamp, set } from 'firebase/database'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom' // Adicionado useLocation
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/authContext/AuthContext'
import { database } from '../../services/firebaseConfig/FirebaseConfig'

export const useCreateSession = () => {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [sessionName, setSessionName] = useState('')
  const [description, setDescription] = useState('')
  const [isSeries, setIsSeries] = useState(false)
  const [episodes, setEpisodes] = useState(1) // Padrão para 1 se for série/anime
  const [content, setContent] = useState(null)
  const [sessionCode, setSessionCode] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [loadingSubmit, setLoadingSubmit] = useState(false);


  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      try {
        const categories = ['movies', 'series', 'animes', 'documentaries']
        let foundContent = null;

        for (const category of categories) {
          const contentRef = ref(database, `${category}/${id}`)
          const snapshot = await get(contentRef)
          if (snapshot.exists()) {
            foundContent = snapshot.val();
            // Adiciona o tipo ao objeto content para uso posterior
            foundContent.type = category.slice(0, -1); // Remove o 's' do final (movies -> movie)
            break;
          }
        }

        if (foundContent) {
          setContent(foundContent)
          setSessionName(foundContent.name || '')
          // Descrição da sessão pode ser diferente da descrição do conteúdo
          // setDescription(foundContent.description || '') 
          if (foundContent.type === 'serie' || foundContent.type === 'anime') {
            setIsSeries(true)
            setEpisodes(foundContent.episodes || 1)
          } else {
            setIsSeries(false);
            setEpisodes(1); // Para filmes/documentários, geralmente 1 "episódio" (o próprio conteúdo)
          }
        } else {
          toast.error('Conteúdo não encontrado para criar a sessão.')
          navigate('/'); // Ou para uma página de erro/lista
        }
      } catch (error) {
        console.error('Erro ao buscar informações do conteúdo:', error)
        toast.error('Erro ao buscar informações do conteúdo.')
      }
    }

    fetchContent()
  }, [id, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingSubmit(true);

    if (!user) {
      toast.error('Você precisa estar logado para criar uma sessão')
      navigate('/login', { state: { from: location.pathname } });
      setLoadingSubmit(false);
      return
    }

    // Busca o perfil do usuário para obter o nickname
    const userProfileRef = ref(database, `users/${user.uid}`);
    const userProfileSnapshot = await get(userProfileRef);
    let userNickname = `Usuário-${user.uid.substring(0,5)}`; // Nickname padrão
    let userPhotoURL = user.photoURL || null;

    if (userProfileSnapshot.exists()) {
        const profileData = userProfileSnapshot.val();
        userNickname = profileData.updateNick?.[user.uid]?.nickname || profileData.nickname || userNickname;
        userPhotoURL = profileData.photoURL || user.photoURL || null; // Pega do perfil se existir
    } else {
        toast.warn('Por favor, crie um nickname no seu perfil antes de criar uma sessão.')
        navigate('/profile', { state: { from: location.pathname, needsNickname: true } })
        setLoadingSubmit(false);
        return
    }
    
    if (!sessionName.trim()) {
        toast.error('O nome da sessão é obrigatório.');
        setLoadingSubmit(false);
        return;
    }


    const generatedSessionCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()

    const newSession = {
      sessionName: sessionName.trim(),
      description: description.trim(),
      isSeries,
      episodes: isSeries ? (parseInt(episodes, 10) || 1) : 1,
      sessionCode: generatedSessionCode,
      createdBy: userNickname,
      createdByUid: user.uid,
      createdAt: serverTimestamp(),
      image: content?.imageUrl || '',
      contentId: id,
      nameContent: content?.name || 'Conteúdo Desconhecido',
      contentType: content?.type || 'desconhecido', // Salva o tipo do conteúdo
      participants: {
        [user.uid]: {
            uid: user.uid,
            nickname: userNickname,
            photoURL: userPhotoURL
        }
      }
    }

    try {
      const sessionRef = ref(database, `sessions/${generatedSessionCode}`)
      await set(sessionRef, newSession)
      setSessionCode(generatedSessionCode) // Atualiza o estado local
      toast.success('Sessão criada com sucesso!')
      navigate(`/watchsession/${generatedSessionCode}`)
    } catch (error) {
      console.error('Erro ao criar a sessão:', error)
      toast.error('Erro ao criar a sessão. Tente novamente.')
    } finally {
        setLoadingSubmit(false);
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
    handleSubmit,
    loadingSubmit
  }
}
