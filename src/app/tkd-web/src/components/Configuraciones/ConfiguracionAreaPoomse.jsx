import React, { useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import { server } from '../utils/MsgUtils';
import UtilsBuffer from '../utils/UtilsBuffer';

function ConfiguracionAreaPoomse() {
    const [numJueces, setNumJueces] = useState(0);
    const [enablePromedio,setEnablePromedio]=useState(false);
    const [enableMaximo,setEnableMax]=useState(false);
    function guardarConfiguracion() {
        if (numJueces!=0) {
            var datos = {
                numJueces,enablePromedio,enableMaximo
            }
            fetch(`${server}/config/confiAreasKirugui`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ 'conf': datos, 'idConf': 2, 'nombre': 'poomse' })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        localStorage.setItem('kirugui', JSON.stringify(datos));
                        MsgUtils.msgCorrecto(data.ok);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));

        } else {
            MsgUtils.msgError("No se permiten valores vacios");
        }
    }
    function obtenerConfiguracion(id){
        fetch(`${server}/config/getConfiAreas`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({'idConf':id})
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    console.log(data.ok)
                    var datos= JSON.parse(UtilsBuffer.getText(data.ok[0].config))
                    setNumJueces(datos.numJueces);
                    setEnablePromedio(datos.enablePromedio);
                    setEnableMax(datos.enableMaximo);
                    localStorage.setItem('poomse', JSON.stringify(datos));
                    //MsgUtils.msgCorrecto(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    useEffect(()=>{
        obtenerConfiguracion(2);
    },[])
    return (
        <div className='card bg-dark bg-gradient m-2'>
            <div className='card-body'>
                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text ">Numero de JUECES</span>
                    <select className="form-select form-select-sm text-center" value={numJueces}
                        onChange={(e) => setNumJueces(e.target.value)}>
                        <option value={0}>NINGUNO</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={enablePromedio}
                        defaultChecked={enablePromedio} onChange={() => {
                            enablePromedio==false?setEnableMax(false):''
                            setEnablePromedio(!enablePromedio)
                        }} />
                    <label className="form-check-label text-light letraMontserratr">
                        Habilitar Puntuación Promedio
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={enableMaximo}
                        defaultChecked={enableMaximo} onChange={() => {
                            enableMaximo==false?setEnablePromedio(false):''
                            setEnableMax(!enableMaximo)
                        }} />
                    <label className="form-check-label text-light letraMontserratr">
                        Habilitar Puntuacion Maxima
                    </label>
                </div>
            </div>
            <div className='card-footer'>
                <button className='btn btn-sm btn-success' onClick={()=>guardarConfiguracion()}>
                    <i className="fa-solid fa-floppy-disk"></i> Guardar Configuración
                </button>
            </div>
        </div>
    )
}

export default ConfiguracionAreaPoomse
