import React, { useContext, useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import { ContextPuntuacion } from './PrincipalPuntuacion';

function Configuraciones(props) {
    const { setShowModal, setConfig, config, nameConfig, setNameConfig, setConfigJuego,setMapPuntos } = useContext(ContextPuntuacion);
    const [enableDif, setEnableDif] = useState(false);
    const [enableMaxRound,setEnableMaxRound] = useState(false);
    const [enableMaxPoint,setEnableMaxPoint] = useState(false);
    const [puntosOro,setPuntosOro] = useState(0);
    const [nameSeccion, setNameSeccion] = useState('');
    const [numRound, setNumRound] = useState(0);
    const [timeRound, setTimeRound] = useState('');
    const [falta, setFalta] = useState(0);
    const [maxFaltas, setMaxFaltas] = useState(0);
    const [timeDescanso, setTimeDescanso] = useState('');
    const [diffPuntos, setDiffPuntos] = useState(0);
    const [numMandos, setNumMandos] = useState(0);
    const [puntosCabeza, setPuntosCabeza] = useState(0);
    const [puntosCabezaGiro, setPuntosCabezaGiro] = useState(0);
    const [puntosPunio, setPuntosPunio] = useState(0);
    const [puntosPeto, setPuntosPeto] = useState(0);
    const [puntosPetoGiro, setPuntosPetoGiro] = useState(0);
    const [maxJueces,setMaxJueces] = useState(0);
    function validarCampos() {
        if (nameSeccion !== '' && numRound !== 0 && timeRound !== '' && falta !== 0 && maxFaltas !== 0 &&
            timeDescanso !== '' && numMandos !== 0 && puntosCabeza !== 0 && puntosCabezaGiro !== 0
            && puntosPunio !== 0 && puntosPeto !== 0 && puntosPetoGiro !== 0) {
            if (enableDif && diffPuntos !== 0) {
                return true
            } else if (enableDif === false) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    function guardarConfiguracion() {
        if (validarCampos()) {
            var datos = {
                nameSeccion, numRound, timeRound, falta, maxFaltas, timeDescanso, numMandos, puntosCabeza,
                puntosCabezaGiro, puntosPunio, puntosPeto, puntosPetoGiro, enableDif, diffPuntos,puntosOro,
                enableMaxPoint,enableMaxRound,maxJueces
            }
            setMapPuntos({'d':puntosCabeza,'D':puntosCabezaGiro,'P':puntosPunio,'c':puntosPeto,'C':puntosPetoGiro,
            'b':puntosCabeza,'B':puntosCabezaGiro,'E':puntosPunio,'a':puntosPeto,'A':puntosPetoGiro})
            setConfigJuego(datos);
            setNameConfig(nameSeccion);
            localStorage.setItem(nameSeccion, JSON.stringify(datos));
            MsgUtils.msgCorrecto("Configuracion correcta del Area: " + nameSeccion)
            setShowModal(false);
            setConfig(true);
        } else {
            MsgUtils.msgError("Campo vacio")
        }
    }
    function eliminarConfiguracion() {
        localStorage.removeItem(nameConfig);
        setNameConfig('');
        setConfig(false);
    }
    useEffect(() => {
        if (config) {
            var datos = JSON.parse(localStorage.getItem(nameConfig))
            setNameSeccion(datos.nameSeccion);
            setNumRound(datos.numRound);
            setTimeRound(datos.timeRound);
            setFalta(datos.falta);
            setMaxFaltas(datos.maxFaltas);
            setTimeDescanso(datos.timeDescanso);
            setNumMandos(datos.numMandos);
            setPuntosCabeza(datos.puntosCabeza);
            setPuntosCabezaGiro(datos.puntosCabezaGiro);
            setPuntosPunio(datos.puntosPunio);
            setPuntosPeto(datos.puntosPeto);
            setPuntosPetoGiro(datos.puntosPetoGiro);
            setEnableDif(datos.enableDif == true);
            setDiffPuntos(datos.diffPuntos);
            setPuntosOro(datos.puntosOro);
            setEnableMaxPoint(datos.enableMaxPoint);
            setEnableMaxRound(datos.enableMaxRound);
            setMaxJueces(datos.maxJueces);
        }
    }, [])
    return (
        <div className='container-fluid'>
            <div className='row row-cols-1 row-cols-sm-1 row-cols-md-3 g-1'>
                <div className='col col-sm-12 col-md-4'>
                    <div className='text-center text-light letraMontserratr'>Area de Puntuación</div>
                    <hr className='m-0 p-0 mb-1' style={{ color: "#ffffff" }}></hr>
                    <div className="input-group input-group-sm mb-3">
                        <span className="input-group-text" >Numero de Area</span>
                        <select className="form-select form-select-sm text-center"
                            value={nameSeccion} onChange={(e) => setNameSeccion(e.target.value.toUpperCase())}>
                            <option value={""}></option>
                            <option value={"1"}>Area 1</option>
                            <option value={"2"}>Area 2</option>
                            <option value={"3"}>Area 3</option>
                            <option value={"4"}>Area 4</option>
                            <option value={"5"}>Area 5</option>
                            <option value={"6"}>Area 6</option>
                            <option value={"7"}>Area 7</option>
                            <option value={"8"}>Area 8</option>
                            <option value={"9"}>Area 9</option>
                            <option value={"10"}>Area 10</option>
                        </select>
                    </div>
                    <div className='text-center text-light letraMontserratr'>Preferencias del ROUND</div>
                    <hr className='m-0 p-0 mb-1' style={{ color: "#ffffff" }}></hr>
                    <div className='container-fluid'>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text ">Numero de ROUND</span>
                            <select className="form-select form-select-sm text-center" value={numRound}
                                onChange={(e) => setNumRound(e.target.value)}>
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
                            <input type="time" className="form-control text-center"
                                value={timeRound} onChange={(e) => setTimeRound(e.target.value)}
                                minLength="00:00:00" maxLength="01:00:00" step="1"
                                placeholder="0.9 min" />
                        </div>
                    </div>
                    <div className='text-center text-light letraMontserratr'>Configuración GAM-JEON</div>
                    <hr className='m-0 p-0 mb-1' style={{ color: "#ffffff" }}></hr>
                    <div className='container-fluid'>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text" >Deducción por GAM-JEOM</span>
                            <input type="number" className="form-control text-center" placeholder="1 punto"
                                value={falta} onChange={(e) => setFalta(e.target.value)} />
                        </div>
                    </div>
                    <div className='container-fluid'>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text" >Maximo Numero de GAM-JEOM</span>
                            <input type="number" className="form-control text-center" placeholder="1 "
                                value={maxFaltas} onChange={(e) => setMaxFaltas(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className='col col-sm-12 col-md-4'>
                    <div className='text-center text-light letraMontserratr'>Preferencias del JUEGO</div>
                    <hr className='m-0 p-0 mb-1' style={{ color: "#ffffff" }}></hr>
                    <div className='container-fluid'>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text" >Tiempo de Descanso</span>
                            <input type="time" className="form-control text-center"
                                value={timeDescanso} onChange={(e) => setTimeDescanso(e.target.value)}
                                minLength="00:00:00" maxLength="01:00:00" step="1" />
                        </div>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={enableMaxRound}
                            defaultChecked={enableMaxRound} onChange={() => setEnableMaxRound(!enableMaxRound)} />
                        <label className="form-check-label text-light letraMontserratr">
                            Habilitar Ganador maximo de RAUND
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={enableMaxPoint}
                            defaultChecked={enableMaxPoint} onChange={() => setEnableMaxPoint(!enableMaxPoint)} />
                        <label className="form-check-label text-light letraMontserratr">
                            Habilitar Ganador Maximo Puntuación
                        </label>
                    </div>
                    <div className='container-fluid'>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text" >Puntos Round de ORO</span>
                            <input type="number" className="form-control text-center" disabled={!enableMaxPoint}
                                placeholder="10 puntos" value={puntosOro} onChange={(e) => setPuntosOro(e.target.value)} />
                        </div>
                    </div>
                    <div className='text-center text-light letraMontserratr'>Diferencia de Puntos</div>
                    <hr className='m-0 p-0' style={{ color: "#ffffff" }}></hr>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={enableDif}
                            defaultChecked={enableDif} onChange={() => setEnableDif(!enableDif)} />
                        <label className="form-check-label text-light letraMontserratr">
                            Habilitar Diferencia Puntos
                        </label>
                    </div>
                    <div className='container-fluid'>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text" >Diff. Puntos</span>
                            <input type="number" className="form-control text-center" disabled={!enableDif}
                                placeholder="10 puntos" value={diffPuntos} onChange={(e) => setDiffPuntos(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className='col col-sm-12 col-md-4'>
                    <div className='text-center text-light letraMontserratr'>Configuracion de MANDOS</div>
                    <hr className='m-0 p-0 mb-1' style={{ color: "#ffffff" }}></hr>
                    <div className='container-fluid'>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text ">Numero de JUECES</span>
                            <select className="form-select form-select-sm text-center" value={numMandos} onChange={(e) => setNumMandos(e.target.value)}>
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
                            <span className="input-group-text ">Marcaciòn minima JUECES</span>
                            <select className="form-select form-select-sm text-center" value={maxJueces} onChange={(e) => setMaxJueces(e.target.value)}>
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
                            <span className="input-group-text" >Punto Cabeza</span>
                            <input type="number" className="form-control text-center"
                                value={puntosCabeza} onChange={(e) => setPuntosCabeza(e.target.value)}
                                placeholder="1 puntos" />
                        </div>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text" >Punto Giro Cabeza</span>
                            <input type="number" className="form-control text-center"
                                value={puntosCabezaGiro} onChange={(e) => setPuntosCabezaGiro(e.target.value)}
                                placeholder="1 puntos" />
                        </div>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text" >Punto Puño</span>
                            <input type="number" className="form-control text-center"
                                value={puntosPunio} onChange={(e) => setPuntosPunio(e.target.value)}
                                placeholder="1 puntos" />
                        </div>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text" >Punto Peto</span>
                            <input type="number" className="form-control text-center"
                                value={puntosPeto} onChange={(e) => setPuntosPeto(e.target.value)}
                                placeholder="1 puntos" />
                        </div>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text" >Punto Giro Peto</span>
                            <input type="number" className="form-control text-center"
                                value={puntosPetoGiro} onChange={(e) => setPuntosPetoGiro(e.target.value)}
                                placeholder="1 puntos" />
                        </div>
                    </div>
                </div>
            </div>
            <div className='container-fluid mb-2'>
                <button className='btn btn-sm btn-success letraBtn w-50' onClick={() => guardarConfiguracion()}>
                    <i className="fa-solid fa-floppy-disk"></i> Guardar Configuración
                </button>
                {config && <button className='btn btn-sm btn-danger letraBtn w-50' onClick={() => eliminarConfiguracion()}>
                    <i className="fa-solid fa-trash-can"></i> Eliminar Configuración
                </button>}
            </div>
        </div>
    )
}

export default Configuraciones
