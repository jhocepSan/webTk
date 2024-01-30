import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { serverio } from '../utils/MsgUtils'
//import { connect } from 'socket.io-client';
//const socket = connect("http://192.168.1.6:4001");

function PrincipalKirugui() {
    const navigate = useNavigate();
    const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo } = useContext(ContextAplicacions);
    const [room, setRoom] = useState('');
    const [activarLectura, setActivarLectura] = useState(false);
    const [frecLectura, setFrecLectura] = useState(1000);
    const [configure, setConfigure] = useState({});
    const [clubes, setClubes] = useState([]);
    const [idClubA, setIdClubA] = useState(-1);
    const [idClubR, setIdClubR] = useState(-1);
    const [nombreA, setNombreA] = useState('');
    const [nombreR, setNombreR] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [tipoM, setTipoM] = useState('');
    const [mapPuntos, setMapPuntos] = useState({});
    const [puntoJuego, setPuntoJuego] = useState({
        'isPlay': false, 'round': 1, 'reset': false,
        'puntoA': 0, 'faltaA': 0,
        'puntoR': 0, 'faltaR': 0
    });
    const [msgModal, setMsgModal] = useState({});
    const [resultPre, setResultPre] = useState([]);
    const manejarAtajoTeclado = (event) => {
        if (puntoJuego.isPlay) {
            if (event.key == 'r') {
                document.getElementById('puntoRN').click()
            } else if (event.key == 'R') {
                document.getElementById('puntoRP').click()
            } else if (event.key == 'L') {
                setActivarLectura(true);
            } else if (event.key == 'l') {
                setActivarLectura(false);
            } else if (event.key == 'f') {
                document.getElementById('faltaA').click()
            } else if (event.key == 'F') {
                document.getElementById('faltaR').click()
            } else if (event.key == 'A') {
                document.getElementById('puntoAP').click()
            } else if (event.key == 'a') {
                document.getElementById('puntoAN').click()
            } else if (event.key == 'P') {
                document.getElementById('buttonPlay').click()
            } else if (event.key == 'p') {
                document.getElementById('buttonStop').click()
            }
        }
    };
    function saludarIo() {
        socket.emit("enviar", { message: "hello" })
    }
    function unirseReunion(){
        /*if(room!==""){
            socket.emit("join_room",room);
        }*/
    }
    useEffect(() => {
        //setCargador(true);
        localStorage.setItem("contAux", 0);
        var sessionActiva = JSON.parse(localStorage.getItem('login'));
        var cmp = JSON.parse(localStorage.getItem('campeonato'));
        var conf = JSON.parse(localStorage.getItem('kirugui'));
        if (sessionActiva !== null) {
            setTitulo('Puntuacion Combate');
            setCampeonato(cmp);
            setLogin(true);
            setUserLogin(sessionActiva);
            navigate("/nuevaPantallaK", { replace: true });
            //getClubes(cmp);
        }
        if (conf !== null) {
            setMapPuntos({
                'd': conf.puntosCabeza, 'D': conf.puntosCabezaGiro, 'P': conf.puntosPunio, 'c': conf.puntosPeto, 'C': conf.puntosPetoGiro,
                'b': conf.puntosCabeza, 'B': conf.puntosCabezaGiro, 'E': conf.puntosPunio, 'a': conf.puntosPeto, 'A': conf.puntosPetoGiro
            })
            setFrecLectura(parseInt(conf.frecLectura));
            setConfigure(conf)
        }
        window.addEventListener('keydown', manejarAtajoTeclado);

        // Limpiar el evento de escucha al desmontar el componente
        return () => {
            window.removeEventListener('keydown', manejarAtajoTeclado);
        };
    }, [])
    /*useEffect(() => {
        if (room !== '') {
            socket.on("receive_message", (data) => {
                console.log(data);
            });
        }
    }, [socket])*/
    return (
        <div>
            <Header />
            <div className="input-group input-group-sm mb-3" style={{ width: '260px' }}>
                <span className="input-group-text" id="basic-addon1">Nombre Sala</span>
                <input type="text" className="form-control" placeholder="Sala" onChange={(e) => setRoom(e.target.value.toLowerCase())} />
                <button className='btn btn-sm btn-success' onClick={()=>unirseReunion()}>Crear</button>
            </div>
            <button onClick={() => saludarIo()}>hola</button>
        </div>
    )
}

export default PrincipalKirugui
