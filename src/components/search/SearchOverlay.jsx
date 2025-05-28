import React, { useState, useEffect, useCallback } from 'react';
import { X, Search as SearchIcon, AlertTriangle, Loader2 } from 'lucide-react';
import { searchAllContent } from '../../services/searchService/SearchService'
import ContentItem from './ContentItem';
import { debounce } from 'lodash';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = React.useRef(null);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query || query.trim().length < 2) {
        setResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const searchResults = await searchAllContent(query);
        setResults(searchResults);
      } catch (err) {
        setError(err.message || "Erro ao buscar. Tente novamente.");
        setResults([]);
      }
      setIsLoading(false);
    }, 500),
    []
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
      setResults([]);
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed md:mt-0 mt-16 inset-0 bg-black/90 backdrop-blur-lg z-[100] flex flex-col items-center p-4 sm:p-6 md:p-8 transition-opacity duration-300 ease-in-out"
    >
      <div 
        className="w-full max-w-5xl bg-[#0d0d0f] rounded-xl shadow-2xl flex flex-col max-h-[90vh] border border-gray-700/70"
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-700/50">
          <div className="relative w-full mr-3 sm:mr-4">
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Buscar filmes, séries, animes, documentários..."
              className="w-full py-3 pl-12 pr-4 bg-[#1c1c22] text-gray-100 text-base rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Fechar busca"
          >
            <X size={28} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 sm:p-6 custom-scrollbar-dark"> {/* Lembre-se do seu custom-scrollbar-dark */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Loader2 size={48} className="animate-spin text-sky-500 mb-4" />
              Buscando...
            </div>
          )}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-red-400">
              <AlertTriangle size={48} className="mb-4" />
              {error}
            </div>
          )}
          {!isLoading && !error && searchTerm.trim().length >= 2 && results.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <SearchIcon size={60} className="mb-4 opacity-50" />
              <p className="md:text-xl text-base text-center">Nenhum resultado encontrado para "{searchTerm}".</p>
              <p className="text-sm mt-1">Tente palavras-chave diferentes.</p>
            </div>
          )}
           {!isLoading && !error && searchTerm.trim().length < 2 && results.length === 0 && (
             <div className=" flex flex-col items-center justify-center h-64 text-gray-500">
                <SearchIcon size={60} className="mb-4 opacity-50" />
                <p className="md:text-xl text-base text-center">Digite pelo menos 2 caracteres para buscar.</p>
            </div>
           )}
          {!isLoading && !error && results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {results.map(item => (
                <div key={`${item.type}-${item.id}`} className="w-full aspect-[2/3]">
                    <ContentItem item={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;