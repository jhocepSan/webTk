import React, { useContext } from 'react'
import UtilsBuffer from '../utils/UtilsBuffer'
import { ContextPuntuacion } from './PrincipalPuntuacion';
function PuntuacionUser(props) {
    const { position } = props;
    const {pausa,puntoRojo,setPuntoRojo,puntoAzul,setPuntoAzul,jugadorAzul,jugadorRojo}=useContext(ContextPuntuacion);
    return (
        <>
            {position && <div className='container-fluid my-auto'>
                <div className='row row-cols-2 g-0'>
                    <div className='col my-auto col-4'>
                        <div className='container-fluid '>
                            <div className='row row-cols-2 g-0'>
                                <div className='col'>
                                    <div className='text-center text-light'> Puntuación</div>
                                    {pausa&&<div className='text-center'>
                                        <button className='btn btn-sm btnScore' onClick={()=>setPuntoAzul(puntoAzul+1)}>
                                            <i className="fa-solid fa-circle-plus"></i>
                                        </button>
                                    </div>}
                                    {pausa&&<div className='text-center'>
                                        <button className='btn btn-sm btnScore' onClick={()=>setPuntoAzul(puntoAzul-1)}>
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
                            <div className='card-header m-0 p-0 text-light'>
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
                                            <div>kyong-go</div>
                                        </div>
                                        <div className='col'>
                                            1
                                        </div>
                                    </div>
                                </div>
                                <div className='container-fluid'>
                                    <div className='row row-cols-2'>
                                        <div className='col-4'>
                                            <div>Gam-jeon</div>
                                        </div>
                                        <div className='col'>
                                            1
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
                            <div className='card-header m-0 p-0 text-light text-end'>
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
                                            <div>kyong-go</div>
                                        </div>
                                        <div className='col'>
                                            1
                                        </div>
                                    </div>
                                </div>
                                <div className='container-fluid'>
                                    <div className='row row-cols-2'>
                                        <div className='col-4'>
                                            <div>Gam-jeon</div>
                                        </div>
                                        <div className='col'>
                                            1
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
                                    {pausa&&<div className='text-center'>
                                        <button className='btn btn-sm btnScore' onClick={()=>setPuntoRojo(puntoRojo+1)}>
                                            <i className="fa-solid fa-circle-plus"></i>
                                        </button>
                                    </div>}
                                    {pausa&&<div className='text-center'>
                                        <button className='btn btn-sm btnScore' onClick={()=>setPuntoRojo(puntoRojo-1)}>
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
