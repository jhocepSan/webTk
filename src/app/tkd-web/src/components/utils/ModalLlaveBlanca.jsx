import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';

function MsgDialogo(props) {
    const { show, msg, okFunction, notFunction } = props;
    
    // 1. Estado para almacenar el valor numérico (1, 2, 4, 8)
    const [valor, setValor] = useState(0);
    
    // 2. Estado para cambiar el texto del botón dinámicamente
    const [textoBoton, setTextoBoton] = useState("LLave de?");

    // 3. NUEVO: Estado para almacenar la cantidad de llaves
    const [cantidad, setCantidad] = useState(1);

    // 4. Función manejadora al seleccionar una opción
    const handleSeleccion = (texto, numero) => {
        setTextoBoton(texto);
        setValor(numero);
    };

    // Reiniciar valores al abrir el modal
    useEffect(() => {
        if (show) {
            setValor(0);
            setTextoBoton("LLave de?");
            setCantidad(1); // Reiniciamos la cantidad a 1
        }
    }, [show]);

    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            centered
            contentClassName='bg-dark bg-secondary text-light'>
            <Modal.Header bsPrefix='modal-header bg-secondary m-0 p-0 py-1'>
                <div className='mx-auto text-light tituloMenu'>Generar Llave Limpia</div>
            </Modal.Header>
            <Modal.Body bsPrefix="modal-body border-none">
                <div className='row row-cols-2 g-1 align-items-center'>
                    <div className='col col-2 text-center'>
                        <i className="fa-solid fa-circle-info fa-2xl fa-fade"></i>
                    </div>
                    <div className='col col-10'>
                        {/* Agrupamos el dropdown y el input usando input-group de Bootstrap */}
                        <div className="input-group">
                            <div className="dropdown flex-grow-1 mx-1">
                                <button className="btn btn-secondary dropdown-toggle w-100 rounded-end-0" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                    {textoBoton}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <li>
                                        <button className="dropdown-item" type="button" onClick={() => handleSeleccion("De 1 Llave", 1)}>
                                            De 1 Llave
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" type="button" onClick={() => handleSeleccion("De 2 Llave", 2)}>
                                            De 2 Llave
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" type="button" onClick={() => handleSeleccion("De 4 Llave", 4)}>
                                            De 4 Llave
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" type="button" onClick={() => handleSeleccion("De 8 Llave", 8)}>
                                            De 8 Llave
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            
                            {/* Input para la cantidad integrado estéticamente al lado */}
                            <span className="input-group-text bg-secondary text-light border-secondary">Cant:</span>
                            <input 
                                type="number" 
                                className="form-control bg-dark text-light border-secondary" 
                                style={{ maxWidth: '80px' }}
                                min="1"
                                value={cantidad}
                                onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </div>
                <div className='text-light letraMontserratr mt-3'>
                    {msg}
                </div>
            </Modal.Body>
            <Modal.Footer className='modal-footer bg-dark bg-gradient py-1 m-0 p-0'>
                <button className='btn btn-sm btn-secondary' onClick={notFunction}>
                    Cancelar
                </button>
                {/* Enviamos tanto el tipo de llave (valor) como la cantidad seleccionada */}
                <button className='btn btn-sm btn-success' onClick={() => okFunction(valor, cantidad)}>
                    Aceptar
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default MsgDialogo;
