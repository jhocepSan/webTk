import React from 'react'
import UtilsBufer from '../utils/UtilsBuffer';

function Competidor({user,tipo}) {
    return (
        <div className="card bg-transparent flex-row m-0 p-0" style={{ border: 'none' }}>
            {UtilsBufer.getFotoCard(user.FOTO, 40)}
            <div className='ps-2 my-auto' style={{fontSize:'16px'}}>
                <div className="letrasContenido ">{user.nombres+' '+user.apellidos}</div>
                <div className='letrasContenido '>{'CLUB: '+user.club}</div>
                {tipo==null&&user.idgrado!=0&&<div className='letrasContenido '>{'CINTURON: '+user.cinturon}</div>}
                {tipo==null&&user.idgrado==0&&<div className='letrasContenido '><span className="badge bg-danger">No tiene Grado</span></div>}
                {tipo!=null&&<div className='letrasContenido '>{'CORREO: '+user.correo}</div>}
            </div>
        </div>
    )
}

export default Competidor
