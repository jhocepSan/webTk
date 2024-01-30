import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import VisorPunto from '../GamePad/VisorPunto';
import VisorFaltas from '../GamePad/VisorFaltas';
import RelojKirugui from '../GamePad/RelojKirugui';
import RelojDoble from '../GamePad/RelojDoble';
function scoreCombate() {
  const [configure, setConfigure] = useState({});
  const [puntoJuego, setPuntoJuego] = useState({});
  function actualizarInfo() {
    var valor = localStorage.getItem('doblePant');
    if (valor != undefined) {
      setPuntoJuego(JSON.parse(valor));
    }
  }
  useEffect(() => {
    var valor = localStorage.getItem('doblePant');
    var conf = JSON.parse(localStorage.getItem('kirugui'));
    if (valor != undefined) {
      setPuntoJuego(JSON.parse(valor));
    }
    if (conf !== null) {
      setConfigure(conf)
    }
  }, [])
  return (
    <>
      <div className='text-center mx-auto py-2' style={{ fontSize: '85px', width: '320px' }} >
        <div style={{ fontSize: '60px', borderRadius: '20px' }} className='text-light tituloMenu bg-success bg-gradient'>ROUND {puntoJuego.round}</div>
        <RelojDoble valor={puntoJuego} conf={configure} tipo='r' collback={() => actualizarInfo()} doble={true} />
      </div>
      <div className='container-fluid'>
        <div className='row row-cols-2 gx-0'>
          <div className='col bg-danger bg-gradient col-6'>
            <div className='w-100 p-2'>
              <h1 className='text-start tituloMenu text-light' style={{ fontSize: '30px' }}>
                {puntoJuego.nombreR != '' ? puntoJuego.nombreR : 'TKD ROJO'}
              </h1>
            </div>
            <VisorPunto valor={puntoJuego} tipo='R' />
            <VisorFaltas valor={puntoJuego} tipo='R' />
          </div>
          <div className='col bg-primary bg-gradient col-6'>
            <div className='w-100 p-2'>
              <h1 className='text-end tituloMenu text-light' style={{ fontSize: '30px' }}>
                {puntoJuego.nombreA != '' ? puntoJuego.nombreA : 'TKD AZUL'}
              </h1>
            </div>
            <VisorPunto valor={puntoJuego} tipo='A' />
            <VisorFaltas valor={puntoJuego} tipo='A' />
          </div>
        </div>
      </div>
      <Modal show={puntoJuego.isPlay == false}
        size={'xl'} centered
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName={`${(puntoJuego.gano == 'A' || puntoJuego.gano == 'AP' || puntoJuego.gano == 'AR') ? 'bg-primary' : (puntoJuego.gano == 'R' || puntoJuego.gano == 'RP' || puntoJuego.gano == 'RR') ? 'bg-danger' : 'bg-transparent'} bg-gradient`}>
        {(puntoJuego.gano == undefined || puntoJuego.gano == '') && <Modal.Header bsPrefix='modal-header m-0 p-0 px-2 w-100 ' closeButton={false} closeVariant='white'>
          <div className='text-center w-100' style={{ fontSize: '75px', width: '200px' }} >
            <RelojKirugui valor={puntoJuego} conf={configure} tipo='s' collback={() => ''} doble={false} />
            <h1 className='text-light tituloMenu' style={{ fontSize: '70px' }}>Pausa</h1>
          </div>
        </Modal.Header>}
        {puntoJuego.gano !== '' &&puntoJuego.gano!=undefined&&
          <Modal.Header bsPrefix='modal-header m-0 p-0 px-2 w-100 ' closeButton={false} closeVariant='white'>
            <div className='fa-fade tituloMenu text-light fw-bold mx-auto' style={{ fontSize: '100px' }}>
              Ganador ...!!
            </div>
          </Modal.Header>
        }
      </Modal>
    </>
  )
}

export default scoreCombate
