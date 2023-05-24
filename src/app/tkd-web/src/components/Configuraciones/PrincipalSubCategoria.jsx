import React, { useEffect, useState } from 'react'
import AddEditSubCategoria from './AddEditSubCategoria';
import Modal from 'react-bootstrap/Modal';
import MsgUtils from '../utils/MsgUtils';
import UtilsCargador from '../utils/UtilsCargador';
import {server} from '../utils/MsgUtils';
function PrincipalSubCategoria(props) {
    const { selectCategoria } = props;
    const [showModal, setShowModal] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [cargador, setCargador] = useState(false);
    const [subCategorias, setSubCategorias] = useState([]);
    const [idCategoria,setIdCategoria] =useState(0);
    const [selectSubCategoria,setSelectSubCategoria] = useState({});
    const [actualizar,setActualizar] =useState(false);
    const actualizarPagina =()=>{
        setActualizar(!actualizar);
        setShowModal(false);
    }
    const editarSubCategoria=(dato)=>{
        setSelectSubCategoria(dato);
        setTitulo("Editar Sub Categoria "+dato.nombre);
        setShowModal(true);
    }
    const eliminarSubCategoria=(dato)=>{
        fetch(`${server}/config/deleteSubcategoria`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(dato)
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setActualizar(!actualizar);
                } else {
                    MsgUtils.msgError(data.error);
                }
                setCargador(false);
            })
            .catch(error => MsgUtils.msgError(error));
    }
    useEffect(() => {
        setCargador(true);
        setIdCategoria(selectCategoria.idcategoria);
        fetch(`${server}/config/getSubCategoria`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                info: selectCategoria
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setSubCategorias(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
                setCargador(false);
            })
            .catch(error => MsgUtils.msgError(error));
    }, [actualizar,selectCategoria])
    return (
        <div>
            <UtilsCargador show={cargador} />
            <div className='container-fluid  bg-secondary bg-gradient text-center text-uppercase'>
                categoria {selectCategoria.nombre}
            </div>
            {cargador === false &&
                <div className='container-fluid p-0 m-0'>
                    <table className="table table-hover table-dark table-sm">
                        <thead className='text-center bg-gradient'>
                            <tr>
                                <th className="col-3">
                                    <div className='container-fluid'>
                                        <div className='row row-cols-2 g-0'>
                                            <div className='col-10'>SubCategoria</div>
                                            <div className='col-2'>
                                                <button className='btn btn-sm text-success m-0 p-0'
                                                    onClick={() => {setSelectSubCategoria({}); setShowModal(true); setTitulo("Agregar Nueva SubCategoria") }}>
                                                    <i className="fa-solid fa-circle-plus fa-fade fa-xl"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </th>
                                <th className="col-2">Peso Ini</th>
                                <th className="col-2">Peso Fin</th>
                                <th className="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {subCategorias.map((item, index) => {
                                return (
                                    <tr key={index} className={`text-center`}>
                                        <th>{item.nombre}</th>
                                        <td>{item.pesoini}</td>
                                        <td>{item.pesofin}</td>
                                        <td className='text-end'>
                                            <div className='btn-group btn-group-sm'>
                                                <button className='btn btn-sm text-danger' onClick={() => eliminarSubCategoria(item)}>
                                                    <i className="fa-solid fa-trash fa-xl"></i>
                                                </button>
                                                <button className='btn btn-sm text-warning' onClick={() => editarSubCategoria(item)}>
                                                    <i className="fa-solid fa-file-pen fa-xl"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>}
            <Modal show={showModal} onHide={() => setShowModal(false)}
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName='bg-dark bg-gradient'>
                <Modal.Header closeButton closeVariant='white' bsPrefix='modal-header m-0 p-0 px-2 '>
                    <Modal.Title >
                        <div className='text-light letraMontserratr mx-auto'>
                            {titulo}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body bsPrefix='modal-header m-0 p-0'>
                    <AddEditSubCategoria idCategoria={idCategoria} selectSubCategoria={selectSubCategoria}
                     actualizarPagina={actualizarPagina} subCategorias={subCategorias}/>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default PrincipalSubCategoria
