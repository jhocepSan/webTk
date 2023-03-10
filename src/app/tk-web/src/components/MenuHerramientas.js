import React, { useContext } from 'react'
import { ContextAplicacions } from './Context/ContextAplicacion'
import { useNavigate } from 'react-router-dom';

function MenuHerramientas(props) {
    const {setShowMenu}=props;
    const {menuActivo,setMenuActivo,setTitulo}=useContext(ContextAplicacions);
    const navigate = useNavigate();
    const cambiarVentana =(ventana,titulo,ruta)=>{
        setMenuActivo(ventana);
        setTitulo(titulo);
        setShowMenu(false);
        navigate("/"+ruta, { replace: true });
    }
    return (
        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-start align-items-sm-start text-start">
            <li className={`bg-gradient border-none text-start w-100 m-0 p-0 ${menuActivo===1?'menuActivo':''}`}>
                <a className={`btn btn-sm w-100 text-start ${menuActivo===1?'text-dark':'text-light'} fs-6 menuTk`} 
                    onClick={()=>cambiarVentana(1,"CONFIGURACIONES","config")}>
                    <i className="fa-solid fa-gear"></i> Configuración
                </a>
            </li>
            <li className={`bg-gradient border-none text-start m-0 p-0 w-100 ${menuActivo===2?'menuActivo':''}`}>
                <button className={`btn btn-sm w-100 ${menuActivo===2?'text-dark':'text-light'} text-start fs-6 menuTk`} 
                    onClick={()=>cambiarVentana(2,"REGISTRO COMPETIDOR","regCompe")}>
                    <i className="fa-solid fa-people-group"></i> Registrar Competidor
                </button>
            </li>
            <li className={`bg-gradient border-none text-start m-0 p-0 w-100 ${menuActivo===6?'menuActivo':''}`}>
                <button className={`btn btn-sm w-100 ${menuActivo===6?'text-dark':'text-light'} text-start fs-6 menuTk`} 
                    onClick={()=>cambiarVentana(6,"LISTAS COMPETIDOR","listCompe")}>
                    <i className="fa-solid fa-people-group"></i> Lista Competidores
                </button>
            </li>
            <li className={`bg-gradient border-none text-start m-0 p-0 w-100 ${menuActivo===8?'menuActivo':''}`}>
                <button className={`btn btn-sm w-100 ${menuActivo===8?'text-dark':'text-light'} text-start fs-6 menuTk`} 
                    onClick={()=>cambiarVentana(8,"COMPETIDORES SIN PELEA","listCompeSN")}>
                    <i className="fa-solid fa-user-ninja"></i> Competidores SNP
                </button>
            </li>
            <li className={`bg-gradient border-none text-start m-0 p-0 w-100 ${menuActivo===3?'menuActivo':''}`}>
                <button className={`btn btn-sm w-100 ${menuActivo===3?'text-dark':'text-light'} text-start fs-6 menuTk`} 
                    onClick={()=>cambiarVentana(3,"REGISTRO CLUB","regClub")}>
                    <i className="fa-solid fa-house-fire"></i> Registrar Club
                </button>
            </li>
            <li className={`bg-gradient border-none text-start m-0 p-0 w-100 ${menuActivo===4?'menuActivo':''}`}>
                <button className={`btn btn-sm w-100 ${menuActivo===4?'text-dark':'text-light'} text-start fs-6 menuTk`} 
                    onClick={()=>cambiarVentana(4,"ADMINISTRAR USUARIOS DEL SISTEMA","adminUser")}>
                    <i className="fa-solid fa-users-gear"></i> Administrar Usuarios
                </button>
            </li>
            <li className={`bg-gradient border-none text-start m-0 p-0 w-100 ${menuActivo===5?'menuActivo':''}`}>
                <button className={`btn btn-sm w-100 ${menuActivo===5?'text-dark':'text-light'} text-start fs-6 menuTk`} 
                    onClick={()=>cambiarVentana(5,"PRUEBA DE MANDOS INALAMBRICOS","gamePad")}>
                    <i className="fa-solid fa-gamepad"></i> Prueba de Mandos
                </button>
            </li>
            <li className={`bg-gradient border-none text-start m-0 p-0 w-100 ${menuActivo===7?'menuActivo':''}`}>
                <button className={`btn btn-sm w-100 ${menuActivo===7?'text-dark':'text-light'} text-start fs-6 menuTk`} 
                    onClick={()=>cambiarVentana(7,"Sistema de Puntuación","gamePunt")}>
                    <i className="fa-solid fa-network-wired"></i> Sistema Puntuación
                </button>
            </li>
        </ul>
    )
}

export default MenuHerramientas
