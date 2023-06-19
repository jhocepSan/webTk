import React from 'react'
import Header from '../Header'
import { useNavigate,Link } from 'react-router-dom';

function PrincipalPuntRompi() {
    return (
        <div className='vh-100 bg-primary bg-gradient'>
            <Header puntuacion={true} />
            <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                <Link className='btn btn-sm botonMenu' data-bs-toggle="tooltip"
                    data-bs-placement="bottom" title="Abrir pantalla extendida"
                    to={'/scoreDobleK'} target='blanck'>
                    <i className="fa-brands fa-windows fa-2xl"></i>
                </Link>
                <button type="button" className="btn mx-1 btn-sm botonMenu"
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ver peleas del Campeonato"
                    onClick={() => { console.log("")}}>
                    <i className="fa-solid fa-network-wired fa-2xl"></i></button>
                <button type="button" className="btn mx-1 btn-sm botonMenu"
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Recetear valores iniciales"
                    onClick={() => console.log("")}>
                    <i className="fa-solid fa-repeat fa-2xl"></i></button>
            </div>
            <div className='container-fluid py-2 ' style={{height:'90vh'}}>
                <div className='row row-cols-2 g-1 '>
                    <div className='col' style={{width:'20%'}}>
                        <div className='card bg-transparent'>
                            <div className='card-header bg-dark'>
                                <div className='text-light'>Lista Competidores</div>
                            </div>
                            <div className='card-body'>

                            </div>
                        </div>
                    </div>
                    <div className='col' style={{width:'80%'}}>
                        <div className='container-fluid'>
                            <div className='w-100 bg-transparent text-center text-light'>
                                asdasds
                            </div>
                            <div className='container-fluid d-flex justify-content-center'>
                                <div className='card'>
                                    <div className='puntuacionText text-dark'>
                                        ok
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container-fluid'>
                <div className='btn-group btn-group-sm'>
                    <button className='btn btn-sm bg-success bg-gradient text-light ' style={{fontSize:'18px'}}>
                        <i className="fa-solid fa-circle-check"></i> Rompio
                    </button>
                    <button className='btn btn-sm bg-danger bg-gradient text-light mx-2' style={{fontSize:'18px'}}>
                        <i class="fa-solid fa-circle-xmark"></i> No Rompio
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PrincipalPuntRompi