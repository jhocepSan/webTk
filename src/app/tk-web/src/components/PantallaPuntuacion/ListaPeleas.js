import React, { useContext } from 'react'
import { ContextPuntuacion } from './PrincipalPuntuacion';
function ListaPeleas() {
    const { setPausa, setJugadorAzul, setJugadorRojo,setShowModal } = useContext(ContextPuntuacion);
    function seleccionarPelea(){
        console.log("hola")
        setPausa(true)
        setShowModal(false)
    }
    return (
        <div className='container-fluid py-2'>
            <div className='row g-1'>
                <div className='col-2'>
                    <div className='card' onClick={()=>seleccionarPelea()}>
                        <div className='card-header'>
                            Pelea 1
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListaPeleas
