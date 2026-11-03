import React from 'react'
import { server } from '../utils/MsgUtils';

function Competidor({ user, tipo, busqueda }) {
    
    // Función para dividir el texto y resaltar la coincidencia
    const resaltarTexto = (texto, palabraClave) => {
        if (!palabraClave) return texto;
        
        // Creamos la expresión regular ignorando mayúsculas/minúsculas
        const partes = texto.split(new RegExp(`(${palabraClave})`, 'gi'));
        
        return partes.map((parte, index) => 
            parte.toLowerCase() === palabraClave.toLowerCase() ? (
                // Usamos clases de bootstrap para dar un fondo amarillo y texto oscuro
                <mark key={index} className="bg-warning text-dark p-0 rounded">{parte}</mark>
            ) : (
                parte
            )
        );
    };

    const nombreCompleto = `${user.nombres} ${user.apellidos}`;

    return (
        <div className="card bg-transparent flex-row m-0 p-0 lh-sm" style={{ border: 'none' }}>
            {user.foto != null && <img width={50} height={50} src={`${server}/adjunto/${user.foto}`} className='my-auto' alt="Foto"></img>}
            {user.foto == null && <div className='my-auto'><i className="fa-solid fa-house-flag fa-2xl"></i></div>}
            
            <div className='ps-2 my-auto' style={{ fontSize: '16px' }}>
                {/* Aquí aplicamos el resaltado al Nombre Completo */}
                <div className="letrasContenido fw-bold">
                    {resaltarTexto(nombreCompleto, busqueda)}
                </div>
                
                <div className='letrasContenido '>{'CLUB: ' + user.club}</div>
                <div className='letrasContenido '>{'CAMPEONATO: ' + user.idcampeonato}</div>
                {tipo == null && user.idgrado !== 0 && <div className='letrasContenido '>{'CINTURON: ' + user.cinturon}</div>}
                {tipo == null && user.idgrado === 0 && <div className='letrasContenido '><span className="badge bg-danger">No tiene Grado</span></div>}
                {tipo != null && user.correo!== undefined&& <div className='letrasContenido '>{'CORREO: ' + user.correo}</div>}
            </div>
        </div>
    )
}

export default Competidor
