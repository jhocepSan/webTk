import React, { useContext, useEffect, useState } from 'react'
import PrincipalLlaves from '../ListaCompetidores/PrincipalLlaves';
import MsgUtils from '../utils/MsgUtils';
import { ContextPuntuacion } from './PrincipalPuntuacion';
const server = process.env.REACT_APP_SERVER;

function ListaPeleas() {
    const { setPausa, setJugadorAzul, setJugadorRojo, setShowModal,genero,setGenero,tipo,setTipo,campeonato } = useContext(ContextPuntuacion);
    const [listaLlaves,setListaLlaves] = useState([]);
    function obtenerLLaves() {
        if(tipo!==''&&genero!==''){
            fetch(`${server}/competidor/obtenerLlaves`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ "idCampeonato":campeonato.idcampeonato, genero, tipo })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        console.log(data.ok);
                        setListaLlaves(data.ok);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        }
    }
    function seleccionarPelea() {
        console.log("hola")
        setPausa(true)
        setShowModal(false)
    }
    useEffect(()=>{
        
    },[])
    return (
        <div className='container-fluid py-2'>
            <div className='row g-1'>
                <div className='col' style={{maxWidth:'120px'}}>
                    <select className="form-select form-select-sm btn-secondary letraBtn" value={tipo}
                        onChange={(e) => { setTipo(e.target.value) }}>
                        <option value=''>Tipo (Ninguno)</option>
                        <option value="C">Combate</option>
                        <option value="P">Poomse</option>
                        <option value="D">Demostraciones</option>
                        <option value="R">Rompimiento</option>
                    </select>
                </div>
                <div className='col' style={{maxWidth:'120px'}}>
                    <select className="form-select form-select-sm bg-secondary text-light border-secondary letraBtn"
                        value={genero} onChange={(e) => { setGenero(e.target.value) }}>
                        <option value={''}>Genero</option>
                        <option value={'M'}>Masculino</option>
                        <option value={'F'}>Femenino</option>
                    </select>
                </div>
                <div className='col' style={{maxWidth:'100px'}} onClick={()=>obtenerLLaves()}>
                    <button className='btn btn-sm btn-success bg-gradient'>
                        <i className="fa-solid fa-unlock-keyhole"></i> Buscar
                    </button>
                </div>
            </div>
            {listaLlaves&&listaLlaves.length!==0&&
                <PrincipalLlaves idcampeonato={campeonato.idcampeonato} genero={genero} llaves={listaLlaves} />    
            }
        </div>
    )
}

export default ListaPeleas
