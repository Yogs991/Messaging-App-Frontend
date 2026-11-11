import { useContext } from "react";
import { AuthContext } from "./authContext.js";

export function useAut(){
    const context = useContext(AuthContext);

    return context;
}