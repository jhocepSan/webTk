import React from 'react'
import Modal from 'react-bootstrap/Modal';

function MsgDialogo(props) {
    const {show,tipo,okFunction,notFunction} = props;
    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            centered
            contentClassName='bg-transparent text-light'>
            <Modal.Body bsPrefix="modal-body border-none">
                <div className='card bg-dark bg-gradient'>
                    <div className='card-header text-light'>
                        <h3>Información</h3>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default MsgDialogo