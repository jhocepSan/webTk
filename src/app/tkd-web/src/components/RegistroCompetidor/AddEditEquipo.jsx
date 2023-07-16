import React, { useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import { server } from '../utils/MsgUtils';
import UtilsBuffer from '../utils/UtilsBuffer';

function AddEditEquipo(props) {
    const {club,actualizar,selectItem}=props;
    const [nombre,setNombre] = useState('');
    const [numPart,setNumPart] = useState(0);
    const [descripcion,setDescripcion] = useState('');
    const [idequipo,setIdEquipo] = useState(0);
    function guardarEquio(){
        var clb = JSON.parse(localStorage.getItem('campeonato'));
        if(nombre!==''&&numPart!==0){
            fetch(`${server}/competidor/addEditEquipo`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    nombre,numPart,descripcion,club,'idcampeonato':clb.idcampeonato,idequipo
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        MsgUtils.msgCorrecto(data.ok);
                        actualizar()
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        }else{
            MsgUtils.msgError("Coloque la información del equipo nombre y Numero Participantes Obligatorio !!!");
        }
    }
    useEffect(()=>{
        if(selectItem.idequipo!==undefined){
            setNombre(selectItem.nombre);
            setIdEquipo(selectItem.idequipo);
            setDescripcion(UtilsBuffer.getText(selectItem.descripcion));
            setNumPart(selectItem.numparticipantes);
        }
    },[])
    return (
        <div className='container-fluid'>
            <div className="mb-3">
                <label className="form-label text-light">Nombre Equipo</label>
                <input type="text" className="form-control " placeholder="Nombre" value={nombre} onChange={(e)=>setNombre(e.target.value.toUpperCase())}/>
            </div>
            <div className="mb-3">
                <label className="form-label text-light">Numero de Participantes</label>
                <input type="number" className="form-control " placeholder="#" value={numPart} onChange={(e)=>setNumPart(e.target.value)}/>
            </div>
            <div className="mb-3">
                <label className="form-label text-light">Descripcion</label>
                <textarea className="form-control" rows="3" 
                value={descripcion} onChange={(e)=>setDescripcion(e.target.value)}
                placeholder='NOMBRES DE LOS PARTICIPANTES, QUE DEMOSTRACION, ETC'></textarea>
            </div>
            <button className='btn btn-sm btn-success' onClick={()=>guardarEquio()}><i className="fa-solid fa-floppy-disk"></i> Guardar</button>
        </div>
    )
}

export default AddEditEquipo