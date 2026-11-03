import React, { useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import CardCinturon from './CardCinturon';
import Modal from 'react-bootstrap/Modal';
import { server } from '../utils/MsgUtils';
import AddEditTipoCompeticion from './AddEditTipoCompeticion';

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
};

function GradosConfig({ campeonato, tipou }) {
    const [actualizar, setActualizar] = useState(false);
    const [grados, setGrados] = useState([]);
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [showModal, setShowModal] = useState(false);

    const esAdmin = tipou === 'A';

    const agregarGrado = () => {
        const nuevo = nombre.trim();
        if (nuevo === '') {
            MsgUtils.msgError("Escriba el nombre del grado.");
            return;
        }
        if (grados.some((item) => item.nombre === nuevo)) {
            MsgUtils.msgError("Ya existe un grado con ese nombre.");
            return;
        }
        fetch(`${server}/config/addGrado`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ info: { nombre: nuevo, tipo, idcampeonato: campeonato.idcampeonato } })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    if (data.ok.affectedRows === 1) {
                        setNombre('');
                        setActualizar(!actualizar);
                    } else {
                        MsgUtils.msgError("Intente nuevamente.");
                    }
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }

    function recuperarInfo(valor) {
        if (valor === '') {
            setGrados([]);
            return;
        }
        fetch(`${server}/config/getGrados`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ info: { idcampeonato: campeonato.idcampeonato, tipo: valor } })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) setGrados(data.ok);
                else MsgUtils.msgError(data.error);
            })
            .catch(error => MsgUtils.msgError(error));
    }

    const cambiarTipo = (valor) => {
        setTipo(valor);
        recuperarInfo(valor);
    }

    const eliminarGrado = (dato) => {
        fetch(`${server}/config/deleteGrado`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ info: { idgrado: dato.idgrado } })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    if (data.ok.affectedRows === 1) setActualizar(!actualizar);
                    else MsgUtils.msgError("Intente nuevamente.");
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }

    useEffect(() => {
        if (tipo !== '') recuperarInfo(tipo);
    }, [actualizar])

    return (
        <div className='container-xl py-3'>

            {/* Filtro y acciones */}
            <div className='row g-2 align-items-end mb-3'>
                <div className='col-12 col-sm-5 col-md-3 col-lg-2'>
                    <label className='form-label small text-secondary mb-1' htmlFor='selTipoGrado'>Tipo</label>
                    <select id='selTipoGrado' className='form-select form-select-sm' value={tipo}
                        onChange={(e) => cambiarTipo(e.target.value)}>
                        <option value=''>Seleccione</option>
                        <option value='C'>Combate</option>
                        <option value='P'>Poomse</option>
                        <option value='D'>Demostraciones</option>
                        <option value='R'>Rompimiento</option>
                    </select>
                </div>

                {esAdmin && tipo !== '' &&
                    <div className='col-12 col-sm-7 col-md-6 col-lg-5'>
                        <label className='form-label small text-secondary mb-1' htmlFor='nombreGrado'>Nuevo grado</label>
                        <div className='input-group input-group-sm'>
                            <input id='nombreGrado' type='text' className='form-control' placeholder='Nombre del grado'
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value.toUpperCase())}
                                onKeyDown={(e) => { if (e.key === 'Enter') agregarGrado(); }} />
                            <button className='btn btn-success' onClick={agregarGrado}>
                                <i className='fa-solid fa-plus me-1'></i> Agregar
                            </button>
                        </div>
                    </div>}

                {esAdmin && tipo === 'R' &&
                    <div className='col-12 col-md-auto ms-md-auto'>
                        <button className='btn btn-sm btn-outline-warning w-100' onClick={() => setShowModal(true)}>
                            <i className='fa-solid fa-sliders me-1'></i> Tipos de rompimiento
                        </button>
                    </div>}
            </div>

            {/* Tarjetas de grados */}
            {grados.length === 0 ?
                <div className='text-center text-secondary py-5'>
                    {tipo === ''
                        ? 'Seleccione un tipo para ver sus grados.'
                        : 'Aún no hay grados para este tipo.'}
                </div>
                :
                <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-2'>
                    {grados.map((item) => (
                        <div key={item.idgrado} className='col'>
                            <CardCinturon info={item} eliminarGrado={eliminarGrado} tipou={tipou} />
                        </div>
                    ))}
                </div>}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName='bg-dark text-light'>
                <Modal.Header closeButton closeVariant='white' className='border-secondary'>
                    <Modal.Title className='h5'>Tipos de rompimiento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddEditTipoCompeticion campeonato={campeonato} tipo={tipo} />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default GradosConfig