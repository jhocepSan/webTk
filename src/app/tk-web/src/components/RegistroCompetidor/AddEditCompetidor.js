import React, { useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
const server = process.env.REACT_APP_SERVER;
function AddEditCompetidor(props) {
    const { listaClubs, tipo, actualizarDatos,selectItem,club ,generoee} = props;
    const [idCompetidor, setIdCompetidor] = useState(0);
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [ciUser, setCiUser] = useState('');
    const [idClub, setIdClub] = useState(club);
    const [cinturon, setCinturon] = useState(0);
    const [grados, setGrados] = useState([]);
    const [error, setError] = useState({});
    const [peso, setPeso] = useState(0);
    const [altura, setAltura] = useState(0);
    const [idCampeonato, setIdCampeonato] = useState(0);
    const [tipos, setTipo] = useState(tipo);
    const [fecha, setFecha] = useState('');
    const [edad, setEdad] = useState(0);
    const [idGrado, setIdGrado] = useState(0);
    const [genero,setGenero] = useState(generoee);
    function validarDatos() {
        if (nombres !== '' && apellidos !== '' && ciUser !== '' && idClub !== 0 && cinturon !== 0 && peso !== 0 && altura !== 0&&genero!=='') {
            return true;
        } else {
            setError({ "error": "Campo Vacio!!!" })
            return false;
        }
    }
    function guardarCompetidor() {
        if (validarDatos()) {
            fetch(`${server}/competidor/addEditCompetidor`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    idCompetidor, nombres, apellidos, ciUser, idClub, cinturon, peso, altura, tipos, idCampeonato, edad, fecha, idGrado,genero
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        MsgUtils.msgCorrecto(data.ok);
                        actualizarDatos();
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        } else {
            MsgUtils.msgError("Coloque la información del Competidor !!!");
        }
    }
    function cambiarCinturon(valor){
        setCinturon(valor)
        var gr=0;
        for (var i=0 ;i<grados.length;i++){
            var lista= grados[i].cinturon.filter((item)=>item.idcinturon==valor);
            if(lista.length!==0){
                gr=grados[i].idgrado;
                break;
            }
        }
        setIdGrado(gr);
    }
    function verificarSeleccion(){
        if(selectItem.idcompetidor!==undefined){
            setIdCompetidor(selectItem.idcompetidor);
            setNombres(selectItem.nombres);
            setApellidos(selectItem.apellidos);
            setCiUser(selectItem.ci);
            setIdClub(selectItem.idclub);
            setCinturon(selectItem.idcinturon);
            setPeso(selectItem.peso);
            setAltura(selectItem.altura);
            setFecha(new Date(selectItem.fecha).toISOString().substring(0, 10));
            setEdad(selectItem.edad);
            setGenero(selectItem.genero);
            setIdGrado(selectItem.idgrado);
        }
    }
    function cambiarFecha(date){
        var fechaHoy= new Date();
        var fechaEle=new Date(date);
        if(fechaHoy.getMonth()<fechaEle.getMonth()){
            setEdad(fechaHoy.getFullYear()-fechaEle.getFullYear());
        }else{
            setEdad(fechaHoy.getFullYear()-fechaEle.getFullYear())
        }
        setFecha(date);
    }
    useEffect(() => {
        var idcampeonato = JSON.parse(localStorage.getItem('campeonato')).idcampeonato;
        setIdCampeonato(idcampeonato);
        verificarSeleccion();
        fetch(`${server}/config/getGrados`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                info: {
                    idcampeonato, tipo
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setGrados(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }, [])
    return (
        <div className='container-fluid'>
            <div className="mb-3">
                <label className="form-label text-light fw-bold"><i className="fa-solid fa-user fa-fade"></i> Nombres</label>
                <input type="text" className="form-control form-control-sm" placeholder='Escriba su nombre'
                    value={nombres} onChange={(e) => { setNombres(e.target.value.toUpperCase()); setError({}) }} />
                {error.error && nombres === '' && <div className="alert alert-danger m-0 p-0" role="alert">
                    {error.error}
                </div>}
            </div>
            <div className="mb-3">
                <label className="form-label text-light fw-bold"><i className="fa-solid fa-user fa-fade"></i> Apellidos</label>
                <input type="text" className="form-control form-control-sm" placeholder='Ingresa tus Apellidos'
                    value={apellidos} onChange={(e) => { setApellidos(e.target.value.toUpperCase()); setError({}) }} />
                {error.error && apellidos === '' && <div className="alert alert-danger m-0 p-0" role="alert">
                    {error.error}
                </div>}
            </div>
            <div className="mb-3">
                <div className='row row-cols-2 g-1'>
                    <div className='col'>
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-id-card fa-fade"></i> Carnet Identidad</label>
                        <input type="text" className="form-control form-control-sm" placeholder='Ingrese su CI'
                            value={ciUser} onChange={(e) => { setCiUser(e.target.value); setError({}) }} />
                        {error.error !== undefined && ciUser === '' && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                    </div>
                    <div className='col'>
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-venus-mars fa-fade"></i> Genero</label>
                        <select className="form-select form-select-sm bg-secondary text-light border-secondary"
                            value={genero} onChange={(e) => setGenero(e.target.value)}>
                            <option value={''}>Ninguno</option>
                            <option value={'M'}>Masculino</option>
                            <option value={'F'}>Femenino</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <div className='row row-cols-2 g-1'>
                    <div className='col'>
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-calendar-days fa-fade"></i> Fecha</label>
                        <input type="date" className="form-control form-control-sm" value={fecha} onChange={(e) => { cambiarFecha(e.target.value); setError({}) }} />
                        {error.error !== undefined && fecha === '' && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                    </div>
                    <div className='col'>
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-calendar-days fa-fade"></i> Edad</label>
                        <input type="number" className="form-control form-control-sm" placeholder='Edad' value={edad} onChange={(e) => { setEdad(e.target.value); setError({}) }} />
                        {error.error !== undefined && edad === 0 && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                    </div>
                </div>
            </div>
            <div className='mb-3'>
                <div className='row row-cols-2 g-1'>
                    <div className='col'>
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-school fa-fade"></i> Club</label>
                        <select className="form-select form-select-sm bg-secondary text-light border-secondary"
                            value={idClub} onChange={(e) => setIdClub(e.target.value)}>
                            {listaClubs.map((item, index) => {
                                return (
                                    <option value={item.idclub} key={index}>{item.nombre}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='col'>
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-graduation-cap fa-fade"></i> Cinturon</label>
                        <select className="form-select form-select-sm bg-secondary text-light border-secondary"
                            value={cinturon} onChange={(e) => cambiarCinturon(e.target.value)}>
                                <option value={0} >Ninguno</option>
                            {grados.map((item, index) => {
                                return (
                                    <optgroup key={index} label={item.nombre}>
                                        {item.cinturon.map((ctn, ind) => {
                                            return (
                                                <option value={ctn.idcinturon} key={ind}>{ctn.nombre}</option>
                                            )
                                        })}
                                    </optgroup>
                                )
                            })}
                        </select>
                        {error.error !== undefined && cinturon === 0 && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                    </div>
                </div>
            </div>
            <div className='mb-3'>
                <div className='row row-cols-2 g-1'>
                    <div className='col'>
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-weight-scale fa-fade"></i> Peso</label>
                        <input type="number" className="form-control form-control-sm" placeholder='Peso' value={peso}
                            onChange={(e) => { setPeso(e.target.value); setError({}) }} />
                        {error.error && peso === 0 && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                    </div>
                    <div className='col'>
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-ruler-vertical fa-fade"></i> Altura</label>
                        <input type="number" className="form-control form-control-sm" placeholder='Altura' value={altura}
                            onChange={(e) => { setAltura(e.target.value); setError({}) }} />
                        {error.error && altura === 0 && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                    </div>
                </div>
            </div>
            <div className='text-center'>
                <div className='row row-cols-2 g-1'>
                    <div className='col'>
                        <button className='btn btn-sm btn-success bg-gradient w-100' onClick={() => guardarCompetidor()}>
                            <i className="fa-solid fa-address-card fa-xl"></i> GUARDAR
                        </button>
                    </div>
                    <div className='col'>
                        <button className='btn btn-sm btn-danger bg-gradient w-100' onClick={() => actualizarDatos()}>
                            <i className="fa-solid fa-circle-xmark fa-xl"></i> SALIR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddEditCompetidor
