import React, { useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import Nav from 'react-bootstrap/Nav';
import LlavesConsultas from '../ConsultasApi/LlavesConsultas';
import ConfigConsultas from '../ConsultasApi/ConfigConsultas';
import UtilsDate from '../utils/UtilsDate';
import ImgUser from '../../assets/user.png';
import MsgDialogo from '../utils/MsgDialogo';
import UtilsExport from '../utils/UtilsExport';

function AdminLlaves(props) {
    const { idCampeonato, tipo, setVentana, tipoL,setCargador,area,collback} = props;
    const [listaLlaves, setListaLlaves] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [idCategoria, setIdCategoria] = useState(null);
    const [areas, setAreas] = useState([]);
    const [actualizar, setActualizar] = useState(false);
    const [genero, setGenero] = useState('');
    const [showModal,setShowModal] = useState(false);
    const obtenerLlaves = async (categoria) => {
        try {
            setCargador(true);
            var datos = categoria.split('#');
            setIdCategoria(parseInt(datos[0]))
            setGenero(datos[1]);
            var llaves = await LlavesConsultas.obtenerLlaves(
                { idCampeonato, tipo, 'genero': 'M', 'idCategoria': parseInt(datos[0]) });
            if (llaves.ok) {
                if(area==undefined){
                    setListaLlaves(llaves.ok);
                }else{
                    var filtroLista = llaves.ok.filter(item=>item.area==area)
                    setListaLlaves(filtroLista);
                }
            } else {
                MsgUtils.msgError(llaves.error);
            }
        } catch (error) {
            MsgUtils.msgError(error.message)
        }finally{
            setCargador(false);
        }
    }
    const obtenerCategorias = async () => {
        try {
            var categorias = await ConfigConsultas.getCategoriasUnidos({ 'idcampeonato': idCampeonato });
            if (categorias.ok) {
                setCategorias(categorias.ok);
            } else {
                MsgUtils.msgError(categorias.error);
            }
        } catch (error) {
            MsgUtils.msgError(error.message)
        }
    }
    const cambiarNumPelea = async (dato, valor) => {
        setListaLlaves([]);
        try {
            var changePelea = await LlavesConsultas.cambiarNumeroPelea({ 'nropelea': valor, 'idpelea': dato.idpelea });
            if (changePelea.ok) {
                setActualizar(!actualizar)
            } else {
                MsgUtils.msgError(changePelea.error);
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
        }
    }
    const cambiarAreaLlave = async (dato, valor) => {
        try {
            var cambioArea = await LlavesConsultas.cambiarAreaLlave({ 'area': valor, 'idllave': dato.idllave });
            if (cambioArea.ok) {
                setActualizar(!actualizar);
            } else {
                MsgUtils.msgError(cambioArea.error);
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
        }
    }
    const eliminarLLaves = async()=>{
        try {
            var eliminaLlave = await LlavesConsultas.eliminarLlaves( {'idcampeonato': idCampeonato, 'tipo': tipo} )
            if(eliminaLlave.ok){
                MsgUtils.msgCorrecto(eliminaLlave.ok)
            }else{
                MsgUtils.msgError(eliminaLlave.error);
            }
        } catch (error) {
            MsgUtils.msgError(error.message)
        }
    }
    const eliminarLLaveManual = async(valor)=>{
        try {
            console.log(valor);
            var idCompetidores =[]
            valor.PELEAS.map(item=>{idCompetidores.push(item.idcompetidor1);idCompetidores.push(item.idcompetidor2)})
            var result = await LlavesConsultas.eliminarLlaveManual(
                { 'idllave':valor.idllave,'idCompetidor':idCompetidores,'idcampeonato':idCampeonato,'tipo': tipo});
            if (result.ok){
                MsgUtils.msgCorrecto(result.ok);
                setActualizar(!actualizar);
            }else{  
                MsgUtils.msgError(result.error);
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
        }
    }
    useEffect(() => {
        obtenerCategorias();
        var conf = JSON.parse(localStorage.getItem('kirugui'));
        if (conf != undefined) {
            var listaAr = []
            for (var i = 0; i < parseInt(conf.cantAreas); i++) {
                listaAr.push({ 'id': i + 1, 'nombre': 'Area ' + (i + 1) })
            }
            setAreas(listaAr);
        } else {
            MsgUtils.msgError("Configuracion de KIRUGUI no existe...");
        }
    }, [])
    const exportPDF = async()=>{
        try {
            setCargador(true);
            var llaves = await LlavesConsultas.obtenerLlaves(
                { idCampeonato, tipo, 'genero': 'M', 'idCategoria': -2 });
                console.log(llaves)
            if (llaves.ok) {
                await UtilsExport.exportarLlaves(categorias,llaves.ok);
                MsgUtils.msgCorrecto("Llaves descargadas")
            } else {
                MsgUtils.msgError(llaves.error);
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
        }finally{
            setCargador(false);
        }
    }
    useEffect(() => {
        if (idCategoria != null) {
            obtenerLlaves(idCategoria + '#' + genero);
        }
    }, [actualizar])
    return (
        <>
            <div className='bg-dark bg-gradient py-1 container-fluid'>
                {tipoL=='E'&&<div className='row row-cols gx-1'>
                    <div className='col text-light fw-bold text-center'>
                        Administrador - Cantidad Llaves {listaLlaves.length}
                    </div>
                    <div className='col' style={{minWidth:'80px',maxWidth:'100px'}}>
                        <button className='btn btn-sm letraBtn btn-success w-100' 
                        title='Exportar llaves a PDF'
                        onClick={()=>exportPDF()}>
                            <i className="fa-solid fa-file-pdf fa-xl"></i> PDF
                        </button>
                    </div>
                    <div className='col' style={{minWidth:'80px',maxWidth:'100px'}}>
                        <button className='btn btn-sm btn-danger w-100'
                            title='Eliminar Llaves del Campeonato'
                            onClick={()=>setShowModal(true)}>
                            <i className="fa-solid fa-trash-can fa-xl"></i> Eliminar
                        </button>
                    </div>
                    <div className='col' style={{minWidth:'40px',maxWidth:'40px'}}>
                        <button className='btn btn-sm btn-transparent text-danger w-100'
                            title='Salir del administrador de llaves'
                            onClick={() => setVentana(0)}>
                            <i className="fa-solid fa-circle-xmark fa-2xl"></i>
                        </button>
                    </div>
                </div>}
            </div>
            <div className='bg-dark overflow-auto'>
                <Nav justify variant="tabs" onSelect={(e) => obtenerLlaves(e)}>
                    {categorias.map((categoria, index) => {
                        return (
                            <Nav.Item key={index}>
                                <Nav.Link
                                    bsPrefix={`nav-link m-0 p-0 ${((idCategoria == categoria.idcategoria) && (genero == categoria.genero)) ? 'botonLlave' : categoria.genero == 'M' ? 'botonMasc' : 'botonFeme'}`}
                                    eventKey={`${categoria.idcategoria}#${categoria.genero}`}>{categoria.nombre}
                                </Nav.Link>
                            </Nav.Item>
                        )
                    })}
                </Nav>
            </div>
            <div className='container-fluid'>
                {listaLlaves.length == 0 && <div className="alert alert-warning">
                    No hay Peleas en esta categoria
                </div>}
                {listaLlaves.map((item, index) => {
                    if (idCategoria == item.idcategoria && genero == item.genero) {
                        return (
                            <div className='card mb-2' key={index} >
                                <div className='card-header bg-transparent'>
                                    <div className='row row-cols gx-1'>
                                        <div className='col' style={{ minWidth: '430px', maxWidth: '430px' }}>
                                            <div className='tituloHeader' style={{ fontSize: '20px' }}>
                                                {`${item.nombregrado} ${item.genero == 'M' ? 'MASCULINO' : 'FEMENINO'}`}
                                            </div>
                                            <div className='tituloHeader' style={{ fontSize: '20px' }}>
                                                {item.nombrecategoria + ' => ' + item.edadini + ' - ' + item.edadfin + ' Años'}
                                            </div>
                                        </div>
                                        <div className='col' style={{ minWidth: '400px', maxWidth: '400px' }}>
                                            <div className='tituloHeader' style={{ fontSize: '20px' }}>
                                                {UtilsDate.getDateFormato(item.fecha)}
                                            </div>
                                            <div className='tituloHeader' style={{ fontSize: '20px' }}>
                                                {item.nombresubcategoria + ' => ' + item.pesoini + ' - ' + item.pesofin + ' Kg'}
                                            </div>
                                        </div>
                                        <div className='col lh-1' style={{ minWidth: '120px', maxWidth: '120px' }}>
                                            <label className="form-label tituloHeader" style={{ fontSize: '20px' }}>Area</label>
                                            {tipoL == 'E' && <select className="form-select form-select-sm text-light" 
                                                title='Cambiar Area de la llave'
                                                style={{ background: '#1B8DFF' }}
                                                value={(item.area == undefined || item.area == null) ? 0 : item.area}
                                                onChange={(e) => cambiarAreaLlave(item, e.target.value)}>
                                                <option selected>Ninguno</option>
                                                {areas.map((item, index) => {
                                                    return (
                                                        <option value={item.id} key={index}>{item.nombre}</option>
                                                    )
                                                })}
                                            </select>}
                                            {tipoL=='O'&&
                                            <div className='fw-bold' style={{fontSize:'24px'}}>{item.area==null?'':item.area}</div>}
                                        </div>
                                        {item.idcategoria==-1&&
                                        <div className='col my-auto' style={{minWidth:'120px',maxWidth:'120px'}}>
                                            <button className='btn btn-danger btn-sm'
                                            title='Eliminar esta llave'
                                                 onClick={()=>eliminarLLaveManual(item)}>
                                                <i className="fa-solid fa-trash"></i> Eliminar Llave
                                            </button>
                                        </div>
                                        }
                                    </div>
                                </div>
                                <div className='card-body m-1 p-0' >
                                    <div className='row row-cols gx-1'>
                                        <div className='col' style={{ minWidth: '340px', maxWidth: '340px' }}>
                                            {item.PELEAS.map((itemm, indexx) => {
                                                if (itemm.tipo == 0) {
                                                    return (
                                                        <>
                                                            <div className='container-fluid' key={indexx}>
                                                                <div className="navbar-brand card flex-row bg-primary m-0 p-0 " >
                                                                    <img src={ImgUser} width="38" height="38" className=" my-auto rounded-circle card-img-left" />
                                                                    <div className='ps-2 my-auto d-none d-sm-inline'>
                                                                        <div className="userHeader text-light lh-sm" style={{ fontSize: '20px' }}>{itemm.nombres}</div>
                                                                        <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.apellidos}</div>
                                                                        <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.clubuno}</div>
                                                                        <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>Edad: {itemm.edaduno}</div>
                                                                        <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>Peso: {itemm.pesouno}</div>
                                                                    </div>
                                                                </div>
                                                                <div className='row row-cols-2 g-0'>
                                                                    <div className='col-4 my-auto'>
                                                                        {tipoL == 'O' && 
                                                                        <button className='btn btn-sm btn-dark letraNumPelea w-100' 
                                                                            title='Elegir Pelea'
                                                                            onClick={() => collback(itemm)}>
                                                                            {itemm.nropelea}
                                                                        </button>}
                                                                        {tipoL == 'E' &&
                                                                            <input className="form-control form-control-lg text-light bg-secondary"
                                                                                type="number" placeholder="#"
                                                                                value={itemm.nropelea} onChange={(e) => cambiarNumPelea(itemm, e.target.value)}>
                                                                            </input>}
                                                                    </div>
                                                                    <div className='col-8 my-auto'>
                                                                        #PELEA<hr style={{ border: "15px", background: "#f6f6f" }} className='m-0 p-0'></hr>
                                                                    </div>
                                                                </div>
                                                                <div className="navbar-brand card flex-row bg-danger m-0 p-0 " >
                                                                    <img src={ImgUser} width="38" height="38" className=" my-auto rounded-circle card-img-left" />
                                                                    <div className='ps-2 my-auto d-none d-sm-inline'>
                                                                        <div className="userHeader text-light lh-sm" style={{ fontSize: '20px' }}>{itemm.nombres2}</div>
                                                                        <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.apellidos2}</div>
                                                                        <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.clubdos}</div>
                                                                        <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>Edad: {itemm.edaddos}</div>
                                                                        <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>Peso: {itemm.pesodos}</div>
                                                                    </div>
                                                                </div>
                                                                <hr style={{ border: "25px", background: "#f6f6f" }} className=''></hr>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            })}
                                        </div>
                                        <div className='col' style={{ minWidth: '340px', maxWidth: '340px' }}>
                                            {item.PELEAS.map((itemm, indexx) => {
                                                if (itemm.tipo == 1) {
                                                    return (
                                                        <div className='container-fluid'>
                                                            <div style={{ height: '80px' }}></div>
                                                            <div className="navbar-brand card flex-row bg-primary m-0 p-0 " >
                                                                <img src={ImgUser} width="38" height="38" className=" my-auto rounded-circle card-img-left" />
                                                                <div className='ps-2 my-auto d-none d-sm-inline'>
                                                                    <div className="userHeader text-light lh-sm" style={{ fontSize: '20px' }}>{itemm.nombres}</div>
                                                                    <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.apellidos}</div>
                                                                    <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.clubuno}</div>
                                                                    <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>Edad: {itemm.edaduno}</div>
                                                                    <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>Peso: {itemm.pesouno}</div>
                                                                </div>
                                                            </div>
                                                            <div className='row row-cols-2 g-0'>
                                                                <div className='col-4 my-auto'>
                                                                    {tipoL == 'O' && 
                                                                    <button className='btn btn-sm btn-dark letraNumPelea w-100' 
                                                                        title='Elegir pelea'
                                                                        onClick={() => collback(itemm)}>
                                                                        {itemm.nropelea}
                                                                    </button>}
                                                                    {tipoL == 'E' &&
                                                                        <input className="form-control form-control-lg text-light bg-secondary"
                                                                            type="number" placeholder="#"
                                                                            value={itemm.nropelea} onChange={(e) => cambiarValor(itemm, e.target.value, index, indexx)}>
                                                                        </input>}
                                                                </div>
                                                                <div className='col-8 my-auto'>
                                                                    #PELEA<hr style={{ border: "15px", background: "#f6f6f" }} className='m-0 p-0'></hr>
                                                                </div>
                                                            </div>
                                                            <div className="navbar-brand card flex-row bg-danger m-0 p-0 " >
                                                                <img src={ImgUser} width="38" height="38" className=" my-auto rounded-circle card-img-left" />
                                                                <div className='ps-2 my-auto d-none d-sm-inline'>
                                                                    <div className="userHeader text-light lh-sm" style={{ fontSize: '20px' }}>{itemm.nombres2}</div>
                                                                    <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.apellidos2}</div>
                                                                    <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.clubdos}</div>
                                                                    <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>Edad: {itemm.edaddos}</div>
                                                                    <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>Peso: {itemm.pesodos}</div>
                                                                </div>
                                                            </div>
                                                            <hr style={{ border: "25px", background: "#f6f6f" }} className=''></hr>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
            <MsgDialogo show={showModal} msg='Seguro de eliminar las llaves generadas' 
                okFunction={() => { setShowModal(false); eliminarLLaves(); }} 
                notFunction={() => setShowModal(false)} />
        </>
    )
}

export default AdminLlaves
