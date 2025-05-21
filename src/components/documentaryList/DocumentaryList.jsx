import { useEffect, useState } from 'react';
import { fetchDocumentary } from '../../services/documentaryService/documentaryService';
import DocumentaryItem from './DocumentaryItem';
import Carousel from '../carousel/Carousel';
import Loading from '../loading/Loading';
import { FileText } from 'lucide-react';

const DocumentaryList = () => {
  const [documentaries, setDocumentaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDocumentaries = async () => {
      setLoading(true);
      setError(null);
      try {
        const documentaryData = await fetchDocumentary();
        if (documentaryData && typeof documentaryData === 'object') {
          const sortedDocumentaries = Object.entries(documentaryData).sort(([, docA], [, docB]) => {
            if (docA.name && docB.name) {
              return docA.name.localeCompare(docB.name);
            }
            if (docA.name) return -1;
            if (docB.name) return 1;
            return 0;
          });
          setDocumentaries(sortedDocumentaries);
        } else {
          setDocumentaries([]);
        }
      } catch (err) {
        setError("Não foi possível carregar os documentários no momento. Tente novamente mais tarde.");
        setDocumentaries([]);
      } finally {
        setLoading(false);
      }
    };

    getDocumentaries();
  }, []);

  const documentaryItems = documentaries.map(([id, doc]) => (
    <div 
      key={id} 
      className="w-44 h-[275px] sm:w-48 sm:h-[300px] md:w-[190px] md:h-[300px] lg:w-[210px] lg:h-[330px] xl:w-[220px] xl:h-[350px] flex-shrink-0 px-2 py-2"
    >
      <DocumentaryItem documentary={doc} id={id} />
    </div>
  ));

  if (loading) {
    return (
      <div className="flex-grow md:ml-20 py-10 text-center text-gray-400 transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-500 animate-pulse">
                Carregando Documentários...
            </h2>
            <div className="h-[350px] flex items-center justify-center text-gray-600">
                <Loading />
            </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex-grow md:ml-20 py-10 text-center transition-all duration-300 ease-in-out">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4 text-red-500">
                Oops! Algo deu errado.
            </h2>
            <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (documentaries.length === 0 && !loading) {
    return (
      <div className="flex-grow md:ml-20 py-10 text-center transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FileText size={56} className="mx-auto text-gray-700 mb-5" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-500">
                Nenhum Documentário Encontrado
            </h2>
            <p className="text-gray-600">Parece que não há documentários disponíveis no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow md:ml-20 py-10 text-gray-100 transition-all duration-300 ease-in-out -mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-5 sm:mb-8 text-white">
          Documentários
        </h2>
        {documentaryItems.length > 0 ? (
            <Carousel items={documentaryItems} />
        ) : (
            !loading && <p className="text-center text-gray-500">Nenhum documentário para exibir no carrossel.</p>
        )}
      </div>
    </div>
  );
};

export default DocumentaryList;
