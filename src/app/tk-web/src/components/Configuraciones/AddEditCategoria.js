import React, { useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
const server = process.env.REACT_APP_SERVER;

function AddEditCategoria(props) {
    const {actualizar, setActualizar,setShowModal,selectCategoria,genero,categorias}=props
    const [nombre, setNombre] = useState('');
    const [edadIni,setEdadIni] = useState(0);
    const [edadFin,setEdadFin] = useState(0);
    const [error, setError] = useState({});
    const [idCategoria,setIdCategoria] = useState(0);
    const [editando,setEditando] = useState(false);
    function validarCampos(){
        if(nombre!==''&&edadFin!==0){
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
    const guardarCategoria=()=>{
        if(validarCampos()){
            var ctg=categorias.filter((item)=>item.nombre==nombre);
            if(true){
                var idcampeonato = JSON.parse(localStorage.getItem('campeonato')).idcampeonato;
                fetch(`${server}/config/addCategoria`, {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                    info: {
                        nombre,edadIni,edadFin,selectCategoria,genero,idcampeonato
                    }
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.ok) {
                            MsgUtils.msgCorrecto("Guardado");
                            setActualizar(!actualizar);
                            setShowModal(false);
                        } else {
                            MsgUtils.msgError(data.error);
                        }
                    })
                    .catch(error => MsgUtils.msgError(error));
            }else{
                MsgUtils.msgError("Ya existe la Categoria.")
            }
        }
    }
    useEffect(()=>{
        console.log(selectCategoria);
        if(selectCategoria.idcategoria!==undefined){
            setNombre(selectCategoria.nombre);
            setEdadIni(selectCategoria.edadini);
            setEdadFin(selectCategoria.edadfin);
            setIdCategoria(selectCategoria.idcategoria);
            setEditando(true);
        }
    },[])
    return (
        <div className='container-fluid py-2'>
            <div className="mb-3">
                <label className="form-label text-light fw-bold letraMontserratr"><i className="fa-solid fa-dice-d6"></i> Nombre Categoria</label>
                <input type="text" className="form-control letraMontserratr" placeholder='Nombre de la Categoria'
                    value={nombre} onChange={(e) => { setNombre(e.target.value.toUpperCase()); setError({}) }} />
                {error.error && nombre === '' && <div className="alert alert-danger m-0 p-0 letraMontserratr" role="alert">
                    {error.error}
                </div>}
            </div>
            <div className="mb-3">
                <label className="form-label text-light fw-bold letraMontserratr"><i className="fa-solid fa-calendar-minus"></i> Edad Inicial</label>
                <input type="number" className="form-control letraMontserratr" placeholder='Nombre del Club'
                    value={edadIni} onChange={(e) => { setEdadIni(e.target.value); setError({}) }} />
                {error.error && edadIni === -1 && <div className="alert alert-danger m-0 p-0 letraMontserratr" role="alert">
                    {error.error}
                </div>}
            </div>
            <div className="mb-3">
                <label className="form-label text-light fw-bold letraMontserratr"><i className="fa-solid fa-calendar-plus"></i> Edad Fin</label>
                <input type="number" className="form-control letraMontserratr" placeholder='Nombre del Club'
                    value={edadFin} onChange={(e) => { setEdadFin(e.target.value); setError({}) }} />
                {error.error && edadFin === 0 && <div className="alert alert-danger m-0 p-0 letraMontserratr" role="alert">
                    {error.error}
                </div>}
            </div>
            <div className='container-fluid'>
                <button className='btn btn-sm btn-success letraBtn w-100'
                    onClick={()=>guardarCategoria()}>
                    <i className="fa-solid fa-floppy-disk fa-xl"></i> GUARDAR
                </button>
            </div>
        </div>
    )
}

export default AddEditCategoria
