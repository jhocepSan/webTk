import React, { useContext, useEffect, useState } from 'react'
import UtilsBuffer from '../utils/UtilsBuffer'
import { ContextPuntuacion } from './PrincipalPuntuacion';
function PuntuacionUser(props) {
    const { position } = props;
    const { pausa, puntoRojo, setPuntoRojo, puntoAzul, setPuntoAzul,setTipoModal,setShowModal,
        jugadorAzul, jugadorRojo, faltasRojo, faltasAzul, configJuego,setPlayGanador } = useContext(ContextPuntuacion);
    const [listaAzul, setListaAzul] = useState([]);
    const [listaRojo, setListaRojo] = useState([]);
    function hayDiferencia(azul,rojo){
        if(configJuego.enableDif){
            if(parseInt(azul)>parseInt(rojo)){
                var diferencia = Math.abs(azul-rojo);
                if(diferencia>=parseInt(configJuego.diffPuntos)){
                    setPlayGanador({...jugadorAzul,'color':'A'});
                    setTipoModal('W');
                    setShowModal(true);
                }
            }else{
                var diferencia = Math.abs(azul-rojo);
                if(diferencia>=parseInt(configJuego.diffPuntos)){
                    setPlayGanador({...jugadorRojo,'color':'R'});
                    setTipoModal('W');
                    setShowModal(true);
                }
            }
        }
    }
    function puntoManual(color,tipo){
        if(tipo){
            if(color=='R'){
                hayDiferencia(puntoAzul,puntoRojo + 1);
                setPuntoRojo(puntoRojo + 1);
            }else{
                hayDiferencia(puntoAzul+1,puntoRojo);
                setPuntoAzul(puntoAzul + 1);
            }
        }else{
            if(color=='R'){
                hayDiferencia(puntoAzul,puntoRojo-1);
                setPuntoRojo(puntoRojo - 1);
            }else{
                hayDiferencia(puntoAzul-1,puntoRojo);
                setPuntoAzul(puntoAzul - 1);
            }
        }
    }
    useEffect(() => {
        setListaAzul(Array(faltasAzul).fill(0));
        setListaRojo(Array(faltasRojo).fill(0));
        if(faltasAzul>=configJuego.maxFaltas){
            setTipoModal('W');
            setPlayGanador({...jugadorRojo,'color':'R'});
            setShowModal(true);
        }else if(faltasRojo>=configJuego.maxFaltas){
            setTipoModal('W');
            setPlayGanador({...jugadorAzul,'color':'A'});
            setShowModal(true);
        }
    }, [faltasAzul,faltasRojo])
    return (
        <>
            {position && <div className='container-fluid my-auto'>
                <div className='row row-cols-2 g-0'>
                    <div className='col my-auto col-4'>
                        <div className='container-fluid '>
                            <div className='row row-cols-2 g-0'>
                                <div className='col'>
                                    <div className='text-center text-light'> Puntuación</div>
                                    {pausa && <div className='text-center'>
                                        <button className='btn btn-sm btnScore' onClick={() => puntoManual('A',true)}>
                                            <i className="fa-solid fa-circle-plus"></i>
                                        </button>
                                    </div>}
                                    {pausa && <div className='text-center'>
                                        <button className='btn btn-sm btnScore' onClick={() => puntoManual('A',false)}>
                                            <i className="fa-solid fa-circle-minus"></i>
                                        </button>
                                    </div>}
                                </div>
                                <div className='col my-auto'>
                                    <div className="card bg-transparent m-0 p-0 " style={{ border: 'none' }}>
                                        <div className='text-center'>{UtilsBuffer.getFotoCard(undefined, 40)}</div>
                                        <div className='ps-2 d-none d-sm-inline fondoNombre'>
                                            <div className='letrasContenido text-light'>{`CLUB: ${jugadorAzul.club}`}</div>
                                            <div className='letrasContenido text-light'>{`CINTURON: ${jugadorAzul.cinturon}`}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col col-8'>
                        <div className=' card fondoPuntuacion '>
                            <div className='card-header m-0 p-0 text-light nombreJugador'>
                                {jugadorAzul.nombre}
                            </div>
                            <div className='card-body text-center m-0 p-0'>
                                <div className='puntuacionText'>
                                    {puntoAzul}
                                </div>
                            </div>
                            <div className='card-footer text-start'>
                                <div className='container-fluid'>
                                    <div className='row row-cols-2'>
                                        <div className='col-4'>
                                            <div className='nombreJugador text-light'>Gam-jeon</div>
                                        </div>
                                        <div className='col'>
                                            {listaAzul && <div className="btn-group btn-group-sm">
                                                {listaAzul.map((i, j) => {
                                                    return (
                                                        <button className='btn btn-sm btn-warning mx-1 text-light text-center' key={j}>
                                                            {configJuego.falta}
                                                        </button>
                                                    )
                                                })}
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {position === false && <div className='container-fluid my-auto'>
                <div className='row row-cols-2 g-0'>
                    <div className='col col-8'>
                        <div className=' card fondoPuntuacion '>
                            <div className='card-header m-0 p-0 text-light text-end nombreJugador'>
                                {jugadorRojo.nombre}
                            </div>
                            <div className='card-body text-center m-0 p-0'>
                                <div className='puntuacionText'>
                                    {puntoRojo}
                                </div>
                            </div>
                            <div className='card-footer text-start'>
                                <div className='container-fluid'>
                                    <div className='row row-cols-2'>
                                        <div className='col-4'>
                                            <div className='nombreJugador text-light'>Gam-jeon</div>
                                        </div>
                                        <div className='col'>
                                            {listaRojo && <div className="btn-group btn-group-sm">
                                                {listaRojo.map((i, j) => {
                                                    return (
                                                        <button className='btn btn-sm btn-warning mx-1 text-light text-center' key={j}>
                                                            {configJuego.falta}
                                                        </button>
                                                    )
                                                })}
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col col-4 my-auto'>
                        <div className='container-fluid '>
                            <div className='row row-cols-2 g-0'>
                                <div className='col my-auto'>
                                    <div className="card bg-transparent m-0 p-0 " style={{ border: 'none' }}>
                                        <div className='text-center'>{UtilsBuffer.getFotoCard(undefined, 40)}</div>
                                        <div className='ps-2 d-none d-sm-inline fondoNombre'>
                                            <div className='letrasContenido text-light'>{`CLUB: ${jugadorRojo.club}`}</div>
                                            <div className='letrasContenido text-light'>{`CINTURON: ${jugadorRojo.cinturon}`}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='text-center text-light'> Puntuación</div>
                                    {pausa && <div className='text-center'>
                                        <button className='btn btn-sm btnScore' onClick={() => puntoManual('R',true)}>
                                            <i className="fa-solid fa-circle-plus"></i>
                                        </button>
                                    </div>}
                                    {pausa && <div className='text-center'>
                                        <button className='btn btn-sm btnScore' onClick={() => puntoManual('R',false)}>
                                            <i className="fa-solid fa-circle-minus"></i>
                                        </button>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default PuntuacionUser
