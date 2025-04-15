import React from 'react'
import { server } from '../utils/MsgUtils';
function Competidor({user,tipo}) {
    return (
        <div className="card bg-transparent flex-row m-0 p-0 lh-sm" style={{ border: 'none' }}>
            {user.foto!=null&&<img width={50} height={50} src={`${server}/adjunto/${user.foto}`} className='my-auto'></img>}
            {user.foto==null&&<div className='my-auto'><i className="fa-solid fa-house-flag fa-2xl"></i></div>}
            <div className='ps-2 my-auto' style={{fontSize:'16px'}}>
                <div className="letrasContenido ">{user.nombres+' '+user.apellidos}</div>
                <div className='letrasContenido '>{'CLUB: '+user.club}</div>
                <div className='letrasContenido '>{'CAMPEONATO: '+user.idcampeonato}</div>
                {tipo==null&&user.idgrado!=0&&<div className='letrasContenido '>{'CINTURON: '+user.cinturon}</div>}
                {tipo==null&&user.idgrado==0&&<div className='letrasContenido '><span className="badge bg-danger">No tiene Grado</span></div>}
                {tipo!=null&&<div className='letrasContenido '>{'CORREO: '+user.correo}</div>}
            </div>
        </div>
    )
}

export default Competidor
