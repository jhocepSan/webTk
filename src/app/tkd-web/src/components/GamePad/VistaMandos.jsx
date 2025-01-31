import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import useWebSocket from 'react-use-websocket'
function VistaMandos(props) {
    const { datos, setActivarLectura, activarLectura, configure, collback, puntoJuego, showStadistic,areaname } = props;
    const [lecturas, setLecturas] = useState([]);
    const [cantJueces, setCantJueces] = useState([]);
    const [serverIo, setServerIo] = useState(null);
    const [showModal,setShowModal] = useState(false);
    const [entradaTexto,setEntradaTexto] = useState('');
    const [mandos,setMandos] = useState([])
    const { lastJsonMessage, readyState } = useWebSocket(serverIo, {
        shouldReconnect: () => true,
        enabled: !!serverIo
    })
    function getDibujo(valor) {
        //'d': '', 'D': puntosCabezaGiro, 'P': puntosPunio, 'c': puntosPeto, 'C': puntosPetoGiro,
        //      'b': puntosCabeza, 'B': puntosCabezaGiro, 'E': puntosPunio, 'a': puntosPeto, 'A': puntosPetoGiro
        if (valor == 'd' || valor == 'b') {
            return (
                <button className={` m-0 p-0 btn btn-sm fs-4 ${valor == 'd' ? 'btn-primary' : 'btn-danger'} `}>🤕</button>
            )
        } else if (valor == 'D' || valor == 'B') {
            return (
                <button className={`m-0 p-0  btn btn-sm fs-4 ${valor == 'D' ? 'btn-primary' : 'btn-danger'}`}>🤯</button>
            )
        } else if (valor == 'P' || valor == 'E') {
            return (
                <button className={`m-0 p-0  btn btn-sm fs-4 ${valor == 'P' ? 'btn-primary' : 'btn-danger'}`}>✊</button>
            )
        } else if (valor == 'c' || valor == 'a') {
            return (
                <button className={`m-0 p-0 btn btn-sm fs-4 ${valor == 'c' ? 'btn-primary' : 'btn-danger'}`}>🚶</button>
            )
        } else if (valor == 'C' || valor == 'A') {
            return (
                <button className={`m-0 p-0  btn btn-sm fs-4 ${valor == 'C' ? 'btn-primary' : 'btn-danger'}`}>🤸</button>
            )
        }
    }
    function guardarServidor(){
        localStorage.setItem("serverIo",entradaTexto.replace('http://','ws://').replace('https://','wss://'));
        setServerIo(entradaTexto.replace('http://','ws://').replace('https://','wss://'))
        setShowModal(false);
    }
    useEffect(() => {
        if (serverIo != null) {
            /*collback(datos.ok.map(item=>item.dato));
            setLecturas([datos.ok, ...lecturas]) */
            if (readyState == 1 && lastJsonMessage!=null) {
                if(areaname==lastJsonMessage.sector && lastJsonMessage.tipo=='C'){
                    console.log(lastJsonMessage)
                    var datosl = mandos.filter(item=>item.id==lastJsonMessage.id)
                    var datosm = mandos.filter(item=>item.id!=lastJsonMessage.id)
                    var datoFinal=[]
                    if(datosl.length!=0){
                        var datoee = datosl[0]
                        datoee.dato==lastJsonMessage.dato;
                        datoFinal=[...datosm,datoee].sort((a, b) => a.id - b.id)
                    }else{
                        datoFinal=[...datosm,lastJsonMessage].sort((a, b) => a.id - b.id)
                    }
                    if(datoFinal.length==parseInt(configure.numMandos)-1){
                        collback(datoFinal.map(item=>item.dato));
                        setLecturas([...lecturas,datoFinal]);
                        setMandos([]);
                    }else{
                        setMandos(datoFinal);
                    }
                }
            }
        }
    }, [readyState, lastJsonMessage])
    useEffect(() => {
        console.log("modificacion de la lectura de mandos")
        if (configure != null) {
            var albitro = new Array(parseInt(configure.numMandos)).fill(0);
            setCantJueces(albitro);
        }
        if (puntoJuego.reset == true || (puntoJuego.newRound == true && puntoJuego.newRound != undefined)) {
            setLecturas([])
        }
    }, [configure, puntoJuego])
    useEffect(()=>{
        if(serverIo==null){
            setShowModal(true);
        }
    },[])
    return (
        <>
            <div className='card bg-dark bg-gradient'>
                <div className='card-header m-0 p-0'>
                    <div className="input-group">
                        <span className="text-light mx-2" >Lectura Mando</span>
                        <button className={`btn btn-sm ${activarLectura ? 'btn-success' : 'botonNegro'}`}
                            onClick={() => setActivarLectura(!activarLectura)}>
                            <i className="fa-solid fa-glasses"></i>{activarLectura ? '(l)' : '(L)'}</button>
                        <button className='btn btn-sm mx-2 botonNegro'
                            onClick={() => showStadistic(lecturas)}>
                            <i className="fa-solid fa-magnifying-glass-chart"></i>
                        </button>
                    </div>
                </div>
                <div className='table-responsive conainer-fluid' style={{ maxHeight: '58vh' }}>
                    <table className="table table-sm table-bordered bg-light text-center">
                        <thead>
                            <tr>
                                {cantJueces.map((i, index) => {
                                    return (<th scope="col" key={index}>{'Mando ' + (index + 1)}</th>)
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {lecturas.map((item, index) => {
                                return (
                                    <tr key={index} className='m-0 p-0'>
                                        {cantJueces.map((i, j) => {
                                            return (
                                                <td scope="col m-0 p-0" key={j}>
                                                    {item[j] != undefined ? getDibujo(item[j].dato) : <div className='m-0 p-0 my-auto'><i className="fa-solid fa-plug-circle-xmark text-danger fa-2xl"></i></div>}
                                                    {item[j] != undefined && <>
                                                        <div className='text-dark lh-1' style={{ fontSize: '9px' }}>{item[j].nombres}</div>
                                                        <div className='text-dark lh-1' style={{ fontSize: '9px' }}>{item[j].nameclub}</div>
                                                    </>}
                                                </td>)
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}
                size='sm' centered
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName='bg-dark bg-gradient'
            >
                <Modal.Header bsPrefix='modal-header m-0 p-0 px-2 w-100 ' closeButton={false} closeVariant='white'>
                    <div className='fa-fade tituloMenu text-light fw-bold mx-auto' style={{ fontSize: '20px' }}>
                        Url Mando
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid ">
                        <input type="txt" className="form-control form-control-sm" 
                        id="exampleFormControlInput1" placeholder="http://192.168.1.11:4001"
                        value={entradaTexto} onChange={(e)=>setEntradaTexto(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-success btn-sm'
                        onClick={()=>guardarServidor()}>
                        Guardar y Conectar
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default VistaMandos
