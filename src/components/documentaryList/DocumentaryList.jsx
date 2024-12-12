import { useEffect, useState } from 'react';
import { fetchDocumentary } from '../../services/documentaryService/documentaryService';
import DocumentaryItem from './DocumentaryItem';
import Carousel from '../carousel/Carousel'; 

const DocumentaryList = () => {
  const [documentary, setDocumentary] = useState([]);

  useEffect(() => {
    const getDocumentary = async () => {
      try {
        const documentaryData = await fetchDocumentary();
        setDocumentary(Object.entries(documentaryData));
      } catch (error) {
      }
    };

    getDocumentary();
  }, []);

  const documentaryItems = documentary.map(([id, doc]) => (
    <div key={id} className="w-40 sm:w-60 flex-shrink-0">
      <DocumentaryItem documentary={doc} id={id} />
    </div>
  ));

  return (
    <div className=" sm:ml-16 lg:ml-20 p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-700">Documentários</h1>
      <Carousel items={documentaryItems} />
    </div>
  );
};

export default DocumentaryList;
