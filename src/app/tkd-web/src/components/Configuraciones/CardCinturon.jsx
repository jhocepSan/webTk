import React, { useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import {server} from '../utils/MsgUtils';
import MsgDialogo from '../utils/MsgDialogo';
function CardCinturon(props) {
    const { info,eliminarGrado,tipou } = props;
    const [cinturones, setCinturones] = useState([]);
    const [nombre, setNombre] = useState('');
    const [selectItem ,setSelectItem] = useState({});
    const [showMessage,setShowMessage] = useState(false);
    const [tipoG,setTipoG] = useState('');
    const agregarCinturon = () => {
        if (nombre !== '') {
            var cnt = cinturones.filter((item) => item.nombre === nombre);
            if (cnt.length === 0) {
                fetch(`${server}/config/addCinturon`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                        info: {
                            nombre, idgrado: info.idgrado,
                        }
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.ok) {
                            console.log(data.ok);
                            if (data.ok.affectedRows === 1) {
                                setCinturones([...cinturones, { idcinturon: data.ok.insertId, nombre }]);
                                setNombre('');
                            } else {
                                MsgUtils.msgError("Intente Nuevamente");
                            }
                        } else {
                            MsgUtils.msgError(data.error);
                        }
                    })
                    .catch(error => MsgUtils.msgError(error));
            } else {
                MsgUtils.msgError("Ya se tiene el mismo nombre")
            }
        } else {
            MsgUtils.msgError("Ponga el nombre del cinturon")
        }
    }
    const eliminarCinturon =(dato)=>{
        fetch(`${server}/config/deleteCinturon`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                info:dato
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    if (data.ok.affectedRows === 1) {
                        setCinturones(cinturones.filter((item)=>item.idcinturon!==dato.idcinturon));
                    } else {
                        MsgUtils.msgError("Intente Nuevamente");
                    }
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }

    useEffect(() => {
        setCinturones(info.cinturon);
    }, [info])
    return (
        <div className="card bg-dark bg-gradient" style={{height:'300px'}}>
            <div className='card-header m-0 p-0 text-center text-light fw-bold'>
                {info.nombre}
            </div>
            <div className="card-body m-0 p-0 text-light">
                {tipou=='A'&&<div className="input-group input-group-sm ">
                    <span className="input-group-text bg-transparent border-dark text-light letraMontserratr" >CINTURON : </span>
                    <input type="text" className="form-control letraMontserratr" value={nombre}
                        placeholder="Cinturon" onChange={(e) => setNombre(e.target.value.toUpperCase())} />
                    <button className='btn btn-sm btn-success bg-gradient letraBtn' onClick={() => agregarCinturon()}>
                        Agregar < i className="fa-solid fa-circle-plus fa-xl"></i>
                    </button>
                </div>}
                <div className='container table-responsive py-2'>
                    <table className="table table-secondary table-sm table-striped">
                        <tbody>
                            {cinturones.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row" className='col-6 text-start'>{item.nombre}</th>
                                        {tipou=='A'&&<td className='col-6 text-end'>
                                            <div className='btn-group btn-group-sm'>
                                                <button className='btn btn-sm text-danger' onClick={()=>{setShowMessage(true);setTipoG('C');setSelectItem(item)}}>
                                                    <i className="fa-solid fa-trash fa-xl"></i>
                                                </button>
                                            </div>
                                        </td>}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {tipou=='A'&&<div className='card-footer m-0 p-0 text-center'>
                <button className='btn btn-sm w-100 btn-danger bg-gradient letraBtn' onClick={() =>{setShowMessage(true);setTipoG('G'); setSelectItem(info)}}>
                    <i className="fa-solid fa-trash"></i> Eliminar
                </button>
            </div>}
            <MsgDialogo show={showMessage} msg='Esta seguro de Eliminar esta Grado' 
                okFunction={()=>{setShowMessage(false);tipoG=='G'?eliminarGrado(selectItem):eliminarCinturon(selectItem)}} notFunction={()=>setShowMessage(false)}/>
        </div>
    )
}

export default CardCinturon
