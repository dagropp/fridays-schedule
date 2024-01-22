import { createContext, useContext } from "react";
import { AppContextType } from "./types";

export const AppContext = createContext<AppContextType>({
  setChildId: () => null,
});

export const useAppContext = () => useContext(AppContext);
