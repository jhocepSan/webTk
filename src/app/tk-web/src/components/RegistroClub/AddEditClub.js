import React, { useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import UtilsBuffer from '../utils/UtilsBuffer';
const server = process.env.REACT_APP_SERVER
function AddEditClub(props) {
    const { setActualizar, dato, actualizar,setShowModal } = props;
    const [nombre, setNombre] = useState('');
    const [nombreAbr, setNombreAbr] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [error, setError] = useState({});
    const [idClub,setIdClub] = useState(0);
    function validarCampos(){
        if(nombre===''||nombreAbr===''||direccion===''||telefono===''){
            setError({"error":"Este campo no puede ser vacio"});
            return false;
        }else{
            return true;
        }
    }
    const editarClub = ()=>{
        if(validarCampos()){
            fetch(`${server}/club/editarClub`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    info: {
                        idClub,
                        nombre,
                        nombreAbr,
                        direccion,
                        telefono
                    }
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        console.log(data.ok);
                        setShowModal(false);
                        setActualizar(!actualizar);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        }
    }
    const guardarClub = () => {
        if (validarCampos()) {
            fetch(`${server}/club/addClub`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    info: {
                        nombre,
                        nombreAbr,
                        direccion,
                        telefono
                    }
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        console.log(data.ok);
                        setShowModal(false);
                        setActualizar(!actualizar);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        }
    }
    useEffect(() => {
        if (dato.idclub !== undefined) {
            setIdClub(dato.idclub);
            setNombre(dato.nombre);
            setNombreAbr(dato.abreviado);
            setDireccion(UtilsBuffer.getText(dato.direccion));
            setTelefono(dato.telefono);
        }
    }, [])
    return (
        <div>
            <div className="mb-3">
                <label className="form-label text-light fw-bold letraMontserratr"><i className="fa-solid fa-house"></i> Nombre Club</label>
                <input type="text" className="form-control letraMontserratr" placeholder='Nombre del Club'
                    value={nombre} onChange={(e) => {setNombre(e.target.value.toUpperCase());setError({})}} />
                {error.error && nombre === '' && <div className="alert alert-danger m-0 p-0 letraMontserratr" role="alert">
                    {error.error}
                </div>}
            </div>
            <div className="mb-3">
                <label className="form-label text-light fw-bold letraMontserratr"><i className="fa-solid fa-house"></i> Nombre Club Abreviado</label>
                <input type="text" className="form-control letraMontserratr" placeholder='Abreviatura'
                    value={nombreAbr} onChange={(e) => {setNombreAbr(e.target.value.toUpperCase());setError({})}} />
                {error.error && nombreAbr === '' && <div className="alert alert-danger m-0 p-0 letraMontserratr" role="alert">
                    {error.error}
                </div>}
            </div>
            <div className="mb-3">
                <label className="form-label text-light fw-bold letraMontserratr"><i className="fa-solid fa-map-location-dot"></i> Dirección</label>
                <textarea className="form-control letraMontserratr" placeholder="Dirección del club" style={{ height: "100px" }}
                    value={direccion} onChange={(e) => {setDireccion(e.target.value);setError({})}}></textarea>
                {error.error && direccion === '' && <div className="alert alert-danger m-0 p-0 letraMontserratr" role="alert">
                    {error.error}
                </div>}
            </div>
            <div className="mb-3">
                <label className="form-label text-light fw-bold letraMontserratr"><i className="fa-solid fa-phone"></i> Teléfono</label>
                <input type="number" className="form-control letraMontserratr" placeholder='# telefono'
                    value={telefono} onChange={(e) => {setTelefono(e.target.value);setError({})}} />
                {error.error && telefono === '' && <div className="alert alert-danger m-0 p-0 letraMontserratr" role="alert">
                    {error.error}
                </div>}
            </div>
            <div className='container-fluid'>
                <button className='btn btn-sm btn-success letraBtn w-100'
                    onClick={idClub===0?guardarClub:editarClub}>
                    <i className="fa-solid fa-floppy-disk"></i> GUARDAR
                </button>
            </div>
        </div>
    )
}

export default AddEditClub
