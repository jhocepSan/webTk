import React, { useContext, useEffect, useState } from 'react'
import PrincipalLlaves from '../ListaCompetidores/PrincipalLlaves';
import MsgUtils from '../utils/MsgUtils';
import { ContextPuntuacion } from './PrincipalPuntuacion';
import { server } from '../utils/MsgUtils';

function ListaPeleas() {
    const { setPausa, setJugadorAzul, setJugadorRojo, setNumPelea,
        setShowModal, genero, setGenero, tipo, setTipo, campeonato,listaLlaves, setListaLlaves } = useContext(ContextPuntuacion);
    function obtenerLLaves() {
        fetch(`${server}/competidor/obtenerLlaves`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ "idCampeonato": campeonato.idcampeonato, genero: '', tipo: 'C' })
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
    function seleccionarPelea(dato) {
        console.log(dato);
        setJugadorAzul({
            "nombre": dato.nombres + ' ' + dato.apellidos,
            "club": dato.clubuno,
            'idcompetidor': dato.idcompetidor1,
            'cinturon': dato.cinturonuno,
            'idllave': dato.idllave,
            'idpelea': dato.idpelea,
            'nropelea': dato.nropelea
        })
        setJugadorRojo({
            "nombre": dato.nombres2 + ' ' + dato.apellidos2,
            "club": dato.clubdos,
            'idcompetidor': dato.idcompetidor2,
            'cinturon': dato.cinturondos,
            'idllave': dato.idllave,
            'idpelea': dato.idpelea,
            'nropelea': dato.nropelea
        })
        setNumPelea(dato.nropelea);
        setPausa(true);
        setShowModal(false);
    }
    useEffect(() => {
        console.log(listaLlaves.length);
        if(listaLlaves.length==0){
            obtenerLLaves()
        }
    }, [])
    return (
        <div className='container-fluid py-2'>
            {listaLlaves.length == 0&&<div className='container-fluid text-center text-light'>
                <i className="fa-solid fa-spinner fa-spin-pulse fa-2xl"></i>
            </div>}
            {listaLlaves && listaLlaves.length !== 0 &&
                <PrincipalLlaves idcampeonato={campeonato.idcampeonato}
                    callback={(dato) => seleccionarPelea(dato)}
                    genero={genero} llaves={listaLlaves} tipoL='O' />
            }
        </div>
    )
}

export default ListaPeleas
