import React, { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
function PruebaSocket() {
    const {sendMessage,lastMessage,readyState}=useWebSocket('ws://192.168.1.5:4002')
    const [mensaje,setMensaje]=useState('');
    const enviarMensaje=()=>{
        try {
            sendMessage(mensaje)
        } catch (error) {
            console.log(mensaje);
        }
    }
    useEffect(()=>{
        console.log(lastMessage)
    },[lastMessage])
    useEffect(()=>{
        if(readyState==1){
            sendMessage("hola mundo")
        }
    },[readyState,sendMessage])
    return (
        <div className='container-fluid'>
            <div><input className='form-control' type='text' value={mensaje} onChange={(e)=>setMensaje(e.target.value)}></input></div>
            <div>Mensaje del servidor</div>
            <div className='row row-cols g-1'>
                <div className='col'>
                    <butto className="btn btn-sm btn-danger"
                        onClick={enviarMensaje}>Send Mensaje</butto>
                </div>
                <div className='col'></div>
            </div>
        </div>
    )
}

export default PruebaSocket