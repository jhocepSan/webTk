import React, { useContext, useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import CardCinturon from './CardCinturon';
import Modal from 'react-bootstrap/Modal';
import { server } from '../utils/MsgUtils';
import AddEditTipoCompeticion from './AddEditTipoCompeticion';
function GradosConfig(props) {
    const { campeonato, setCampeonato, tipou } = props;
    const [actualizar, setActualizar] = useState(false);
    const [grados, setGrados] = useState([]);
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [showModal, setShowModal] = useState(false);
    const agregarGrado = () => {
        if (nombre !== '') {
            const lista = grados.filter((item) => item.nombre === nombre);
            if (lista.length == 0) {
                fetch(`${server}/config/addGrado`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                        info: {
                            nombre, tipo, idcampeonato: campeonato.idcampeonato,
                        }
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.ok) {
                            if (data.ok.affectedRows === 1) {
                                setNombre('');
                                setActualizar(!actualizar);
                            } else {
                                MsgUtils.msgError("Intente Nuevamente");
                            }
                        } else {
                            MsgUtils.msgError(data.error);
                        }
                    })
                    .catch(error => MsgUtils.msgError(error));
            } else {
                MsgUtils.msgError("Ya TIENES UNO CON EL MISMO NOMBRE");
            }
        } else {
            MsgUtils.msgError("Coloque nombre del grado!!")
        }
    }
    
    function recuperarInfo(valor) {
        fetch(`${server}/config/getGrados`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                info: {
                    idcampeonato: campeonato.idcampeonato, tipo: valor
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.ok) {
                    setGrados(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    const recuperarDatos = (e) => {
        var valor = e.target.value;
        setTipo(valor);
        recuperarInfo(valor);
    }
 
    const eliminarGrado = (dato) => {
        console.log(dato);
        fetch(`${server}/config/deleteGrado`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                info: {
                    idgrado: dato.idgrado
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    if (data.ok.affectedRows === 1) {
                        setActualizar(!actualizar);
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
        if (tipo !== '') {
            recuperarInfo(tipo);
        }
    }, [actualizar])
    return (
        <>
            <div className='container-fluid bg-dark bg-gradient py-2'>
                <div className="row g-1">
                    <div className='col' style={{ maxWidth: '120px', minWidth: '120px' }}>
                        <select className="form-select form-select-sm btn-secondary" value={tipo}
                            onChange={(e) => recuperarDatos(e)}>
                            <option value=''>Ninguno</option>
                            <option value="C">Combate</option>
                            <option value="P">Poomse</option>
                            <option value="D">Demostraciones</option>
                            <option value="R">Rompimiento</option>
                        </select>
                    </div>
                    <div className='col' style={{ maxWidth: '300px', minWidth: '300px' }}>
                        {tipo !== '' &&tipou=='A'&&
                            <div className="input-group input-group-sm ">
                                <span className="input-group-text bg-transparent border-dark text-light letraMontserratr" >Nombre Grado: </span>
                                <input type="text" className="form-control letraMontserratr "
                                    placeholder="Grado" value={nombre} onChange={(e) => setNombre(e.target.value.toUpperCase())} />
                            </div>}
                    </div>
                    <div className='col' style={{ maxWidth: '120px', minWidth: '120px' }}>
                        {tipo !== '' &&tipou=='A'&&
                            <button className='btn btn-sm btn-success letraBtn w-100' onClick={() => agregarGrado()}>
                                <i className="fa-solid fa-circle-plus fa-fade fa-xl "></i> Agregar
                            </button>}
                    </div>
                    {tipo == 'R' &&tipou=='A'&& <div className='col' style={{ maxWidth: '220px', minWidth: '220px' }}>
                        <button className='btn btn-sm btn-warning letraBtn w-100 bg-gradient' onClick={() => setShowModal(true)}>
                            <i className="fa-solid fa-circle-plus fa-fade fa-xl "></i> Tipos de Rompimiento
                        </button>
                    </div>}
                </div>
            </div>
            <div className='container-fluid py-2'>
                <div className='row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-1'>
                    {grados.map((item, index) => {
                        return (
                            <div key={index} className='col'>
                                <CardCinturon info={item} eliminarGrado={eliminarGrado} tipou={tipou}/>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName='bg-dark bg-gradient'>
                <Modal.Header closeButton closeVariant='white' bsPrefix='modal-header m-0 p-0 px-2 '>
                    <Modal.Title >
                        <div className='text-light letraMontserratr mx-auto'>
                            Tipo de Rompimientos
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body bsPrefix='modal-header m-0 p-0'>
                    <AddEditTipoCompeticion campeonato={campeonato} tipo={tipo}/>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default GradosConfig
