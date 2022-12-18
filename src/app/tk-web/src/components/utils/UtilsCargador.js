import React from 'react'
import Modal from 'react-bootstrap/Modal';
import DotLoader  from "react-spinners/DotLoader";

function UtilsCargador(props) {
    const {show}=props;
    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            centered
            contentClassName='bg-transparent text-light'>
            <Modal.Body bsPrefix="modal-body border-none">
                <div className='container text-center'>
                    <DotLoader  className="text-center mx-auto" color='#36d7b7' loading={show} size={200} />
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default UtilsCargador
