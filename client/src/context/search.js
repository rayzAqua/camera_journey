import { useState, createContext, useContext, useEffect } from "react";

const SearchContext = createContext();

const SearchContextProvider = ({ children }) => {
  const [input, setInput] = useState({
    keyword: "",
    results: [],
  });

  return (
    <SearchContext.Provider value={[input, setInput]}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearchContext = () => useContext(SearchContext);

export { useSearchContext, SearchContextProvider };
