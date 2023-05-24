import React, { useState, useEffect } from 'react'
import MsgUtils from '../utils/MsgUtils';
import {server} from '../utils/MsgUtils';

function AddEditSubCategoria(props) {
    const {idCategoria,selectSubCategoria,actualizarPagina,subCategorias}=props;
    const [nombre, setNombre] = useState('');
    const [pesoIni, setPesoIni] = useState(0);
    const [pesoFin, setPesoFin] = useState(0);
    const [error, setError] = useState({});
    const [idSubCategoria,setIdSubCategoria]=useState(0);
    function validarCampos(){
        if(nombre!==''&&pesoFin!==0){
            return true;
        }else{
            if(nombre===''){
                setError({"error":"No se permite campo vacio"})
            }else{
                setError({"error":"No se permite valor cero"})
            }
            return false;
        }
    }
    const guardarSubCategoria=()=>{
        if(validarCampos()){
            var sbc = subCategorias.filter((item)=>item.nombre==nombre);
            if(true){
                fetch(`${server}/config/addSubCategoria`, {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                    info: {
                        nombre,pesoIni,pesoFin,idCategoria,selectSubCategoria
                    }
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.ok) {
                            MsgUtils.msgCorrecto("Guardado");
                            actualizarPagina();
                        } else {
                            MsgUtils.msgError(data.error);
                        }
                    })
                    .catch(error => MsgUtils.msgError(error));
            }else{
                MsgUtils.msgError("Ya se tiene el mismo nombre")
            }
        }
    }
    useEffect(()=>{
        console.log(selectSubCategoria);
        if(selectSubCategoria.idsubcategoria!==undefined){
            setNombre(selectSubCategoria.nombre);
            setPesoIni(selectSubCategoria.pesoini);
            setPesoFin(selectSubCategoria.pesofin);
            setIdSubCategoria(selectSubCategoria.idsubcategoria);
        }
    },[])
    return (
        <div className='container-fluid py-2'>
            <div className="mb-3">
                <label className="form-label text-light fw-bold letraMontserratr"><i className="fa-solid fa-dice-d6"></i> Nombre Sub Categoria</label>
                <input type="text" className="form-control letraMontserratr" placeholder='Nombre Sub Categoria'
                    value={nombre} onChange={(e) => { setNombre(e.target.value.toUpperCase()); setError({}) }} />
                {error.error && nombre === '' && <div className="alert alert-danger m-0 p-0 letraMontserratr" role="alert">
                    {error.error}
                </div>}
            </div>
            <div className="mb-3">
                <label className="form-label text-light fw-bold letraMontserratr"><i className="fa-solid fa-weight-scale"></i> Peso Inicial</label>
                <input type="number" className="form-control letraMontserratr" placeholder='Peso Inicial'
                    value={pesoIni} onChange={(e) => { setPesoIni(e.target.value); setError({}) }} />
                {error.error && pesoIni === -1 && <div className="alert alert-danger m-0 p-0 letraMontserratr" role="alert">
                    {error.error}
                </div>}
            </div>
            <div className="mb-3">
                <label className="form-label text-light fw-bold letraMontserratr"><i className="fa-solid fa-weight-scale"></i> Peso Final</label>
                <input type="number" className="form-control letraMontserratr" placeholder='Peso Final'
                    value={pesoFin} onChange={(e) => { setPesoFin(e.target.value); setError({}) }} />
                {error.error && pesoFin === 0 && <div className="alert alert-danger m-0 p-0 letraMontserratr" role="alert">
                    {error.error}
                </div>}
            </div>
            <div className='container-fluid'>
                <button className='btn btn-sm btn-success letraBtn w-100'
                    onClick={() => guardarSubCategoria()}>
                    <i className="fa-solid fa-floppy-disk fa-xl"></i> GUARDAR
                </button>
            </div>
        </div>
    )
}

export default AddEditSubCategoria
