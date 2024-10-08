import React, { useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import { server } from '../utils/MsgUtils';
import axios from 'axios';
function AddEditCompetidor(props) {
    const { listaClubs, tipo, actualizarDatos, selectItem, club, generoee, listaTiposC } = props;
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
    const [genero, setGenero] = useState(generoee);
    const [idAdjunto,setIdAdjunto] = useState(0);
    const [urlImg,setUrlImg] = useState('');
    const [cargador,setCargador] = useState(false);
    const [itemTipoC, setItemTipo] = useState(0);
    const [listaCTipoC, setListaCTipoC] = useState([]);
    function validarDatos() {
        if (nombres !== '' && apellidos !== '' && ciUser !== '' && 
            idClub !== 0 && cinturon !== 0 && peso !== 0 && 
            altura !== 0 && genero !== '') {
            return true;
        } else {
            setError({ "error": "Campo Vacio!!!" })
            return false;
        }
    }
    function guardarCompetidor() {
        if (validarDatos()) {
            console.log({
                idCompetidor, nombres, apellidos, ciUser, idClub, cinturon,
                peso, altura, tipos, idCampeonato, edad, fecha, idGrado,
                genero, listaCTipoC,idAdjunto
            })
            fetch(`${server}/competidor/addEditCompetidor`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    idCompetidor, nombres, apellidos, ciUser, idClub, cinturon,
                    peso, altura, tipos, idCampeonato, edad, fecha, idGrado,
                    genero, listaCTipoC,idAdjunto
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
    function cambiarCinturon(valor) {
        setCinturon(valor)
        var gr = 0;
        for (var i = 0; i < grados.length; i++) {
            var lista = grados[i].cinturon.filter((item) => item.idcinturon == valor);
            if (lista.length !== 0) {
                gr = grados[i].idgrado;
                break;
            }
        }
        setIdGrado(gr);
    }
    function eliminarListaCtipo(dato) {
        var existe = listaCTipoC.filter((item) => item.idtipo === dato.idtipo);
        if (existe.length !== 0) {
            setListaCTipoC(listaCTipoC.filter((item) => item.idtipo !== dato.idtipo))
        }
    }
    function verificarSeleccion() {
        if (selectItem.idcompetidor !== undefined) {
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
            if (selectItem.idtipocompetencia != null && selectItem.idtipocompetencia != '' && selectItem.idtipocompetencia != undefined) {
                var listaP = selectItem.idtipocompetencia.split(':');
                console.log(listaP);
                var lista = []
                for (var l of listaP) {
                    lista.push(listaTiposC.filter((i) => i.idtipo == parseInt(l))[0])
                }
                setListaCTipoC(lista);
            }
        }
    }
    function cambiarFecha(date) {
        var fechaHoy = new Date();
        var fechaEle = new Date(date);
        setEdad(fechaHoy.getFullYear() - fechaEle.getFullYear());
        setFecha(date);
    }
    function cargarFoto(e, tipo) {
        setCargador(true);
        var archiv = e.target.files[0];
        console.log(archiv)
        if (archiv.size / 1000000 < 3.5) {
            var formData = new FormData()
            formData.append('FILE1', new Blob([archiv], 
                { contentType: 'application/octet-stream', contentTransferEncoding: 'binary' }),
                 archiv.name + "." + tipo + ".ESTU");
            console.log(formData)
            try {
                axios.post(`${server}/usuario/cargarAdjunto`, formData, {
                    'Accept': 'application/json',
                    'content-type': 'multipart/form-data'
                }).then(res => {
                    setCargador(false);
                    console.log(res.data.url);
                    if (res.data.ok) {
                        setIdAdjunto(res.data.ok);
                        setUrlImg(res.data.url);
                        MsgUtils.msgCorrecto("Imagen Cargada Correctamente")
                    } else {
                        MsgUtils.msgError(res.data.error);
                    }
                }).catch(error => {
                    console.log(error.message);
                    setCargador(false);
                })
            } catch (error) {
                setCargador(false);
                MsgUtils.msgError(error.message);
                console.error('Error al subir el archivo !!');
            }
        } else {
            setCargador(false);
            MsgUtils.msgError("Coloque Imagen < 3.5 Megas")
        }
    }
    useEffect(() => {
        console.log("recuperando información");
        var idcampeonato = JSON.parse(localStorage.getItem('campeonato')).idcampeonato;
        setIdCampeonato(idcampeonato);
        verificarSeleccion();
        //getListaTipos(idcampeonato);

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
            <div className='row row-cols-2 g-1'>
                <div className='col col-10'>
                    <div className="mb-3">
                        <label className="form-label text-light fw-bold">
                            <i className="fa-solid fa-user fa-fade"></i> Nombres</label>
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
                </div>
                <div className='col col-2 my-auto'>
                    {cargador==false&&idAdjunto==0&&selectItem.foto==null&&
                    <div>
                        <label for="file-upload" className="custom-file-upload text-light">
                            <i className="fa fa-cloud-upload"></i> Foto
                        </label>
                        <input id="file-upload" type="file" accept='image/*'
                            onChange={(e) => cargarFoto(e, 'IMG')} />
                    </div>}
                    {cargador==true && idAdjunto==0&&
                        <div className='fa-fade'>
                            <div className='text-light fs-1'><i className="fa fa-cloud-upload"></i></div>
                            <div className='text-light fw-bold'>Espere Por Favor ...</div>
                        </div>}
                    {cargador==false&&urlImg!=''&&
                        <div>
                            <img src={`${server}/adjunto/${urlImg}`} className='img-fluid'></img>
                        </div>}
                    {cargador==false&&selectItem.foto!=null&&
                        <div className='img-fluid'>
                            <img src={`${server}/adjunto/${selectItem.foto}`} className='img-fluid'></img>
                        </div>
                    }
                </div>
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
            {tipo == 'R' && <div className='mb-3'>
                <label className="form-label text-light fw-bold"><i className="fa-solid fa-table-list fa-fade"></i> Tipo de Rompimiento</label>
                <div className='btn-group w-100 mb-3'>
                    <select className="form-select form-select-sm bg-secondary text-light border-secondary"
                        value={itemTipoC} onChange={(e) => setItemTipo(e.target.value)}>
                        <option value={0} >Ninguno</option>
                        {listaTiposC.map((item, index) => {
                            return (
                                <option value={item.idtipo} key={index}>{item.descripcion}</option>
                            )
                        })}
                    </select>
                    <button className='mx-2 btn btn-sm btn-success' onClick={() => {
                        if (itemTipoC != 0) {
                            var dato = listaTiposC.filter((item) => item.idtipo == itemTipoC)[0]
                            var existe = listaCTipoC.filter((item) => item.idtipo == itemTipoC)
                            if (existe.length == 0) {
                                setListaCTipoC([...listaCTipoC, dato])
                            } else {
                                MsgUtils.msgError("Ya existe este tipo ...!")
                            }
                        } else {
                            MsgUtils.msgError("Elija un tipo,Por favor...")
                        }
                    }}>
                        Agregar
                    </button>
                </div>
                <div className='w-100 overflow-auto' style={{maxHeight:'100px'}}>
                    {listaCTipoC.map((item, index) => {
                        return (
                            <div className='container-fluid py-1' key={index}>
                                <span className="badge rounded-pill bg-primary position-relative">{item.descripcion}
                                    <button className="btn position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" onClick={() => eliminarListaCtipo(item)}>
                                        X</button>
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>}
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
