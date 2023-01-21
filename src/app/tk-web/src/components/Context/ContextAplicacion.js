import React, { createContext, useState } from 'react'
export const ContextAplicacions = createContext();

function ContextAplicacion({children}) {
    const [login,setLogin]=useState(false);
    const [userLogin,setUserLogin] = useState({});
    const [menuActivo,setMenuActivo] = useState(0);
    const [titulo,setTitulo] = useState('');
    const [campeonato,setCampeonato] = useState({});
  return (
    <ContextAplicacions.Provider value={{
        login,setLogin,userLogin,setUserLogin,menuActivo,setMenuActivo,titulo,setTitulo,
        campeonato,setCampeonato
    }}>
        {children}
    </ContextAplicacions.Provider>
  )
}

export default ContextAplicacion
