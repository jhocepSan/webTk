import React, { useEffect, useState } from 'react'
import AddEditSubCategoria from './AddEditSubCategoria';
import Modal from 'react-bootstrap/Modal';
import MsgUtils from '../utils/MsgUtils';
import UtilsCargador from '../utils/UtilsCargador';
import { server } from '../utils/MsgUtils';
import MsgDialogo from '../utils/MsgDialogo';

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
};

function PrincipalSubCategoria({ selectCategoria, tipo }) {
    const [showModal, setShowModal] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [cargador, setCargador] = useState(false);
    const [subCategorias, setSubCategorias] = useState([]);
    const [selectSubCategoria, setSelectSubCategoria] = useState({});
    const [actualizar, setActualizar] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const esAdmin = tipo === 'A';
    const idCategoria = selectCategoria.idcategoria;

    const actualizarPagina = () => {
        setActualizar(!actualizar);
        setShowModal(false);
    }

    const agregarSubCategoria = () => {
        setSelectSubCategoria({});
        setTitulo("Agregar nueva subcategoría");
        setShowModal(true);
    }

    const editarSubCategoria = (dato) => {
        setSelectSubCategoria(dato);
        setTitulo("Editar subcategoría " + dato.nombre);
        setShowModal(true);
    }

    const eliminarSubCategoria = (dato) => {
        fetch(`${server}/config/deleteSubcategoria`, {
            method: 'POST',
            headers,
            body: JSON.stringify(dato)
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) setActualizar(!actualizar);
                else MsgUtils.msgError(data.error);
                setShowMessage(false);
            })
            .catch(error => MsgUtils.msgError(error));
    }

    useEffect(() => {
        setCargador(true);
        fetch(`${server}/config/getSubCategoria`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ info: selectCategoria })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) setSubCategorias(data.ok);
                else MsgUtils.msgError(data.error);
            })
            .catch(error => MsgUtils.msgError(error))
            .finally(() => setCargador(false)); // antes el cargador quedaba activo si el fetch fallaba
    }, [actualizar, idCategoria])

    return (
        <div className='text-light'>
            <UtilsCargador show={cargador} />

            {/* Encabezado: título y acción principal */}
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2'>
                <div>
                    <h2 className='h6 mb-0'>Subcategorías de {selectCategoria.nombre}</h2>
                    {!cargador &&
                        <div className='small text-light text-opacity-50'>
                            {subCategorias.length} {subCategorias.length === 1 ? 'registrada' : 'registradas'}
                        </div>}
                </div>
                {esAdmin &&
                    <button className='btn btn-sm btn-success' onClick={agregarSubCategoria}>
                        <i className='fa-solid fa-plus me-1'></i> Agregar
                    </button>}
            </div>

            {cargador === false &&
                <div className='table-responsive'>
                    {/* fondo transparente para que se vea el color del panel contenedor */}
                    <table className='table table-dark table-hover table-sm align-middle mb-0'
                        style={{ '--bs-table-bg': 'transparent' }}>
                        <thead style={{
                            backgroundColor: 'rgba(10, 43, 92, 0.15)', // Azul Bootstrap (primary) con 15% de opacidad
                            borderBottom: '2px solid rgba(13, 110, 253, 0.4)' // Línea divisoria inferior azul más marcada
                        }}>
                            <tr className='text-light text-opacity-70 small border-bottom border-secondary border-opacity-10'>
                                {/* Usamos border-end para separar las secciones de la cabecera */}
                                <th rowSpan={2} className="align-middle border-end border-secondary border-opacity-10">
                                    <span className='d-none d-md-inline'>Subcategoría</span>
                                    <span className='d-inline d-md-none'>Subcat.</span>
                                </th>

                                <th colSpan={2} className='text-center border-end border-secondary border-opacity-10'>Peso</th>

                                {esAdmin && (
                                    <th rowSpan={2} className='text-end align-middle'>
                                        <span className='d-none d-sm-inline'>Acciones</span>
                                        <span className='d-inline d-sm-none'>Acc.</span>
                                    </th>
                                )}
                            </tr>
                            <tr className='text-light text-opacity-70 small'>
                                <th className='text-center border-end border-secondary border-opacity-10'>
                                    <span className='d-none d-sm-inline'>Inicial (kg)</span>
                                    <span className='d-inline d-sm-none'>Ini (kg)</span>
                                </th>
                                <th className='text-center border-end border-secondary border-opacity-10'>
                                    <span className='d-none d-sm-inline'>Final (kg)</span>
                                    <span className='d-inline d-sm-none'>Fin (kg)</span>
                                </th>
                            </tr>
                        </thead>


                        <tbody>
                            {subCategorias.length === 0 && (
                                <tr>
                                    <td colSpan={esAdmin ? 4 : 3} className='text-center text-light text-opacity-50 py-4'>
                                        Esta categoría aún no tiene subcategorías.
                                    </td>
                                </tr>
                            )}
                            {subCategorias.map((item, index) => (
                                <tr key={item.idsubcategoria ?? index}>
                                    {/* Evitamos que nombres extremadamente largos rompan la tabla truncando el texto con puntos suspensivos */}
                                    <td className='fw-semibold text-truncate' style={{ maxWidth: '120px' }} title={item.nombre}>
                                        {item.nombre}
                                    </td>
                                    <td className='text-center'>{item.pesoini}</td>
                                    <td className='text-center'>{item.pesofin}</td>
                                    {esAdmin && (
                                        <td className='text-end text-nowrap'>
                                            {/* En móviles removemos los textos de los botones si los tuvieran, y dejamos solo el icono ajustado */}
                                            <div className='btn-group btn-group-sm'>
                                                <button className='btn btn-outline-warning px-2 py-1' title='Editar'
                                                    aria-label={`Editar ${item.nombre}`}
                                                    onClick={() => editarSubCategoria(item)}>
                                                    <i className='fa-solid fa-pen-to-square'></i>
                                                </button>
                                                <button className='btn btn-outline-danger px-2 py-1' title='Eliminar'
                                                    aria-label={`Eliminar ${item.nombre}`}
                                                    onClick={() => { setSelectSubCategoria(item); setShowMessage(true); }}>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName='bg-dark text-light'>
                <Modal.Header closeButton closeVariant='white' className='border-secondary'>
                    <Modal.Title className='h5'>{titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddEditSubCategoria idCategoria={idCategoria} selectSubCategoria={selectSubCategoria}
                        actualizarPagina={actualizarPagina} subCategorias={subCategorias} />
                </Modal.Body>
            </Modal>
            <MsgDialogo show={showMessage} msg='¿Está seguro de eliminar esta subcategoría?'
                notFunction={() => setShowMessage(false)} okFunction={() => eliminarSubCategoria(selectSubCategoria)} />
        </div>
    )
}

export default PrincipalSubCategoria