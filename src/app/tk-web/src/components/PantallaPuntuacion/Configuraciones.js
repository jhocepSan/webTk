import React, { useState } from 'react'

function Configuraciones(props) {
    const {setShowModal}=props;
    const [enableDif,setEnableDif]=useState(false);
    return (
        <div className='container-fluid'>
            <div className='row row-cols-1 row-cols-sm-1 row-cols-md-3 g-1'>
                <div className='col col-sm-12 col-md-4'>
                    <div className='text-center text-light letraMontserratr'>Preferencias del ROUND</div>
                    <hr  className='m-0 p-0 mb-1' style={{color: "#ffffff"}}></hr>
                    <div className='container-fluid'>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text ">Numero de ROUND</span>
                            <select className="form-select form-select-sm text-center">
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                            </select>
                        </div>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text" >Duración del ROUND</span>
                            <input type="number" className="form-control text-center" placeholder="10 min" />
                        </div>
                    </div>
                </div>
                <div className='col col-sm-12 col-md-4'>
                    <div className='text-center text-light letraMontserratr'>Preferencias del JUEGO</div>
                    <hr  className='m-0 p-0 mb-1' style={{color: "#ffffff"}}></hr>
                    <div className='container-fluid'>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text" >Minutos de Descanso</span>
                            <input type="number" className="form-control text-center" placeholder="10 min" />
                        </div>
                    </div>
                    <div className='text-center text-light letraMontserratr'>Diferencia de Puntos</div>
                    <hr  className='m-0 p-0' style={{color: "#ffffff"}}></hr>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" 
                        defaultChecked={enableDif} onChange={()=>setEnableDif(!enableDif)}/>
                        <label className="form-check-label text-light letraMontserratr">
                            Habilitar Diferencia Puntos
                        </label>
                    </div>
                    <div className='container-fluid'>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text" >Diff. Puntos</span>
                            <input type="number" className="form-control text-center" disabled={!enableDif}
                            placeholder="10 puntos" />
                        </div>
                    </div>
                </div>
                <div className='col col-sm-12 col-md-4'>
                    <div className='text-center text-light letraMontserratr'>Configuracion de MANDOS</div>
                    <hr  className='m-0 p-0 mb-1' style={{color: "#ffffff"}}></hr>
                    <div className='container-fluid'>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text ">Numero de JUECES</span>
                            <select className="form-select form-select-sm text-center">
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container-fluid mb-2'>
                <button className='btn btn-sm btn-success letraBtn' onClick={()=>setShowModal(false)}>
                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
            </div>
        </div>
    )
}

export default Configuraciones
