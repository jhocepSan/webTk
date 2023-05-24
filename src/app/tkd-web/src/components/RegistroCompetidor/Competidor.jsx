import React from 'react'
import UtilsBufer from '../utils/UtilsBuffer';

function Competidor({user}) {
    return (
        <div className="card bg-transparent flex-row m-0 p-0" style={{ border: 'none' }}>
            {UtilsBufer.getFotoCard(user.FOTO, 40)}
            <div className='ps-2 my-auto' style={{fontSize:'16px'}}>
                <div className="letrasContenido ">{user.apellidos+' '+user.nombres}</div>
                <div className='letrasContenido '>{'CLUB: '+user.club}</div>
                <div className='letrasContenido '>{'CINTURON: '+user.cinturon}</div>
            </div>
        </div>
    )
}

export default Competidor
