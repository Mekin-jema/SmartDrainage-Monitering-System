import React from "react";
import { CommandMenu } from "@/pages/dashboard/navbar/command-menu";

const SearchContext = React.createContext(null);

export function SearchProvider({ children }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandMenu />
    </SearchContext.Provider>
  );
}

// // eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => {
  const searchContext = React.useContext(SearchContext);

  if (!searchContext) {
    throw new Error("useSearch has to be used within <SearchContext.Provider>");
  }

  return searchContext;
};
