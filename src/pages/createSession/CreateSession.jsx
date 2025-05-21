import React from "react";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";
import { useCreateSession } from "../../hooks/useCreateSession/useCreateSession";
import { Film, Tv, ListVideo, MessageSquareText, Users, Copy, CheckCircle, AlertTriangle } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const CreateSession = () => {
  const {
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
  } = useCreateSession();

  const copyToClipboard = () => {
    if (sessionCode) {
      navigator.clipboard.writeText(sessionCode)
        .then(() => {
          toast.success("Código da sessão copiado!");
        })
        .catch(err => {
          toast.error("Falha ao copiar o código.");
          console.error('Erro ao copiar código: ', err);
        });
    }
  };

  const getContentTypeIcon = () => {
    if (!content || !content.category) return <Film size={20} className="text-gray-400" />;
    const categoryLower = content.category.toLowerCase();
    if (categoryLower.includes("filme")) return <Film size={20} className="text-amber-400" />;
    if (categoryLower.includes("série")) return <Tv size={20} className="text-emerald-400" />;
    if (categoryLower.includes("anime")) return <Tv2 size={20} className="text-purple-400" />; // Supondo que você tenha Tv2 para animes
    if (categoryLower.includes("documentário")) return <FileText size={20} className="text-blue-400" />;
    return <Film size={20} className="text-gray-400" />;
  };


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-gray-300">
      <Sidebar />
      <main className="flex-grow md:ml-20 p-4 sm:p-6 md:p-8 transition-all duration-300 ease-in-out flex items-center justify-center">
        <div className="w-full max-w-3xl bg-[#1c1c1c] shadow-2xl rounded-xl border border-gray-800/70 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <Users size={48} className="mx-auto text-sky-500 mb-3" />
              <h1 className="text-3xl font-bold text-white">Criar Nova Sessão</h1>
              <p className="text-gray-400 mt-2">Configure os detalhes para sua watch party!</p>
            </div>

            {content && (
              <div className="mb-8 p-4 bg-[#2a2a2a]/70 rounded-lg border border-gray-700/50 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={content.imageUrl}
                  alt={content.name || "Conteúdo"}
                  className="w-24 h-36 sm:w-28 sm:h-40 object-cover rounded-md shadow-lg border-2 border-gray-600"
                />
                <div className="text-center sm:text-left">
                  <p className="text-xs text-sky-400 font-medium uppercase tracking-wider mb-1 flex items-center justify-center sm:justify-start">
                    {getContentTypeIcon()}
                    <span className="ml-1.5">Conteúdo Selecionado</span>
                  </p>
                  <h2 className="text-xl font-semibold text-white mb-1">{content.name}</h2>
                  <p className="text-xs text-gray-400 line-clamp-2">{content.description}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="sessionName" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Nome da Sessão
                </label>
                <input
                  type="text"
                  id="sessionName"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Ex: Noite de Clássicos, Maratona Star Wars"
                  className="w-full px-4 py-2.5 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Descrição da Sessão (Opcional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Adicione uma breve descrição ou regras para a sessão..."
                  className="w-full px-4 py-2.5 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-[#2d2d2d] border border-gray-700 rounded-lg">
                <input
                  type="checkbox"
                  id="isSeries"
                  checked={isSeries}
                  onChange={() => setIsSeries(!isSeries)}
                  className="h-5 w-5 text-sky-500 bg-gray-600 border-gray-500 rounded focus:ring-sky-600 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="isSeries" className="text-sm text-gray-300 cursor-pointer select-none">
                  É uma Série ou Anime (requer número de episódios)?
                </label>
              </div>

              {isSeries && (
                <div className="animate-fadeIn">
                  <label htmlFor="episodes" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Quantidade de Episódios para esta sessão
                  </label>
                  <input
                    type="number"
                    id="episodes"
                    value={episodes}
                    onChange={(e) => setEpisodes(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-2.5 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    min="1"
                    required={isSeries}
                  />
                </div>
              )}
              
              <button
                type="submit"
                disabled={loadingSubmit}
                className="w-full py-3 px-5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loadingSubmit ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Criando...
                  </>
                ) : (
                  <>
                    <ListVideo size={20} className="mr-2" />
                    Criar Sessão
                  </>
                )}
              </button>
            </form>

            {sessionCode && (
              <div className="mt-8 p-4 bg-gradient-to-br from-sky-800/50 to-sky-900/70 border border-sky-700 rounded-lg text-center animate-fadeIn">
                <h2 className="text-lg font-semibold text-sky-300 mb-2">Sessão Criada com Sucesso!</h2>
                <p className="text-gray-300 mb-1 text-sm">Código da Sessão:</p>
                <div className="flex items-center justify-center space-x-2 bg-black/30 p-3 rounded-md">
                  <p className="text-2xl font-mono tracking-wider text-white select-all">{sessionCode}</p>
                  <button 
                    onClick={copyToClipboard} 
                    className="p-2 text-sky-300 hover:text-sky-100 transition-colors"
                    title="Copiar código"
                  >
                    <Copy size={20} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-3">Compartilhe este código com seus amigos para que eles possam entrar.</p>
              </div>
            )}
          </div>
        </div>
        <ToastContainer
            position="bottom-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
      </main>
    </div>
  );
};

export default CreateSession;
