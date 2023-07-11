import React from 'react'
import Modal from 'react-bootstrap/Modal';

function MsgDialogo(props) {
    const {show,msg,okFunction,notFunction} = props;
    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            centered
            contentClassName='bg-dark bg-secondary text-light'>
            <Modal.Header bsPrefix='modal-header bg-secondary m-0 p-0 py-1'>
                <div className='mx-auto text-light tituloMenu'>Información</div>
            </Modal.Header>
            <Modal.Body bsPrefix="modal-body border-none">
                <div className='row row-cols-2 g-1'>
                    <div className='col col-3'>
                        <i className="fa-solid fa-circle-info fa-2xl fa-fade"></i>
                    </div>
                    <div className='col col-9'>
                        <div className='text-light letraMontserratr'>
                            {msg}
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='modal-footer bg-dark bg-gradient py-1 m-0 p-0'>
                <button className='btn btn-sm btn-secondary' onClick={notFunction}>
                    Cancelar
                </button>
                <button className='btn btn-sm btn-success' onClick={okFunction}>
                    Aceptar
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default MsgDialogo