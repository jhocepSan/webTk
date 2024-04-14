import React, { useEffect, useRef, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import UtilsDate from '../utils/UtilsDate';
import jsPDF from 'jspdf';
import ImgUser from '../../assets/user.png'
import { server } from '../utils/MsgUtils';
import MsgDialogo from '../utils/MsgDialogo';

function PrincipalLlaves(props) {
    const { idcampeonato, genero, callback, tipoL, setCargador, tipoComp } = props;
    const pdfRef = useRef(null);
    const [categorias, setCategorias] = useState([]);
    const [selectItem, setSelectItem] = useState(0);
    const [lista, setLista] = useState([]);
    const [numLlave, setNumLlave] = useState(0);
    const [listaLLaves, setListaLLaves] = useState();
    const [listaManual, setListaManual] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [areas, setAreas] = useState([]);
    const [actualizar,setActualizar] = useState(false);
    function verLlavesCategoriaOficial(dato) {
        setSelectItem(dato);
        setLista(listaLLaves.filter((item) => item.idcategoria === dato));
        setNumLlave(0);
    }

    function verLlavesCategoria(dato) {
        setSelectItem(dato);
        setNumLlave(0);
    }
    function getLlavesCategoria() {
        var dtAux = llaves[0];
        fetch(`${server}/competidor/obtenerLlavesManuales`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'tipo': dtAux.tipo, 'idCampeonato': idcampeonato, 'genero': dtAux.genero, 'idCategoria': -1 })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    //setLista(llaves.filter((item) => item.idcategoria === dato));
                    setListaManual(data.ok)
                    //MsgUtils.msgCorrecto(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));

    }
    function cambiarLlave(tipo, tamanio) {
        if (tipo === 'N') {
            if (numLlave < tamanio - 1) {
                setNumLlave(numLlave + 1);
            }
        } else if (tipo === 'B') {
            if (numLlave > 0) {
                setNumLlave(numLlave - 1);
            }
        }
    }
    function eliminarLLaves() {
        setCargador(true);
        fetch(`${server}/competidor/eliminarLlavesGeneradas`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'idcampeonato': idcampeonato, 'tipo': tipoComp })
        })
            .then(res => res.json())
            .then(data => {
                setCargador(false);
                if (data.ok) {
                    callback()
                    MsgUtils.msgCorrecto(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    function getLLavesOficiales() {
        fetch(`${server}/competidor/obtenerLlaves`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'idCampeonato':idcampeonato, genero, 'tipo': tipoComp })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    console.log(data.ok)
                    setListaLLaves(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    const exportPDF = () => {
        console.log("generando")
        var optiones = {
            orientation: 'p',
            unit: 'mm',
            format: 'letter',
            putOnlyUsedFonts: true,
            floatPrecision: 16 // or "smart", default is 16
        }
        var doc = new jsPDF(optiones);
        var x = 10;
        var y = 5;
        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        var numPag = 1;
        for (var cat of categorias) {
            for (var subcat of cat.SUBCATEGORIA) {
                console.log(subcat.idsubcategoria, subcat.idcategoria, cat.idcategoria);
                var compe = listaLLaves.filter((item) => item.idcategoria == cat.idcategoria && item.idsubcategoria == subcat.idsubcategoria);
                var tipol = compe.length
                if (tipol != 0) {
                    for (var peel of compe) {
                        console.log("pealeas", peel.PELEAS)
                        var lsPele = peel.PELEAS;
                        if (lsPele.length !== 0) {
                            //doc.setTextColor(0, 0, 0);
                            doc.setFontSize(12);
                            doc.text(`Pagina: ${numPag}`, (width / 2) - 20, y + 5);
                            doc.text(`Categoria: ${cat.nombre} -> Edad ${cat.edadini} - ${cat.edadfin} años`, x, y + 10);
                            doc.text(`Sub Categoria: ${subcat.nombre} -> Peso ${subcat.pesoini} - ${subcat.pesofin} kg`, x, y + 15);
                            doc.text(`Genero: ${cat.genero == 'M' ? 'MASCULINO' : 'FEMENINO'}`, x, y + 20)
                            doc.setFontSize(9);
                            y = y + 25
                            if (lsPele.length == 2) {
                                for (var cmp of lsPele) {
                                    //doc.setTextColor(0, 0, 255);
                                    doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x, y + 5)
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.text(`${cmp.apellidos !== null ? cmp.apellidos : ''}`, x, y + 10)
                                    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                                    y = y + 20
                                    //doc.setTextColor(255, 0, 0);
                                    doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                                    doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x, y + 5)
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 : ''}`, x, y + 10)
                                    y = y + 50
                                    //doc.setTextColor(0, 0, 0);
                                }
                                doc.line(x + 105, y - 122, x + 105, y - 52, 'S');
                                doc.line(x + 105, y - 85, x + 135, y - 85, 'S');
                            }
                            if (lsPele.length == 4){
                                for (var cmp of lsPele) {
                                    //doc.setTextColor(0, 0, 255);
                                    doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x, y + 5)
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.text(`${cmp.apellidos !== null ? cmp.apellidos : ''}`, x, y + 10)
                                    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                                    y = y + 20
                                    //doc.setTextColor(255, 0, 0);
                                    doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                                    doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x, y + 5)
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 : ''}`, x, y + 10)
                                    y = y + 50
                                    //doc.setTextColor(0, 0, 0);
                                }
                                doc.line(x + 105, y - 300, x + 105, y - 300, 'S');
                                doc.line(x + 105, y - 185, x + 135, y - 185, 'S');
                                doc.line(x + 105, y - 122, x + 105, y - 52, 'S');
                                doc.line(x + 105, y - 85, x + 135, y - 85, 'S');
                            }
                            doc.addPage();
                            x = 10;
                            y = 5;
                            numPag += 1;
                            doc.setPage(numPag);
                        }
                    }
                }
            }
        }
        var nbp = 0;
        listaManual.sort((a, b) => b.PELEAS.length - a.PELEAS.length);
        for (var cmpe of listaManual) {
            var lsPele = cmpe.PELEAS
            if (lsPele.length == 2) {
                x = 10;
                y = 5;
                doc.setFontSize(12);
                doc.text(`Pagina: ${numPag}`, (width / 2) - 20, y + 5);
                doc.text(`Peleas de Exhibición`, x, y + 10);
                doc.text(`Genero: ${cmpe.genero == 'M' ? 'MASCULINO' : 'FEMENINO'}`, x, y + 15)
                doc.setFontSize(9);
                y = y + 25
                for (var cmp of lsPele) {
                    //doc.setTextColor(0, 0, 255);
                    doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x, y + 5)
                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                    doc.text(`${cmp.apellidos !== null ? cmp.apellidos : ''}`, x, y + 10)
                    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                    //doc.setTextColor(255, 0, 0);
                    y = y + 20
                    doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                    doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x, y + 5)
                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                    doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 : ''}`, x, y + 10)
                    //doc.setTextColor(0, 0, 0);
                    y = y + 50
                }
                doc.line(x + 105, y - 122, x + 105, y - 52, 'S');
                doc.line(x + 105, y - 85, x + 135, y - 85, 'S');
                doc.addPage();
                x = 10;
                y = 5;
                numPag += 1;
                doc.setPage(numPag);
            } else if (lsPele.length == 1) {
                var comp = cmpe.PELEAS[0]
                doc.setFontSize(12);
                if (nbp == 0) {
                    x = 10;
                    y = 5;
                    doc.text(`Pagina: ${numPag}`, (width / 2) - 20, y + 5);
                }
                doc.setTextColor(0, 0, 0);
                doc.text(`Peleas de Exhibición`, x, y + 10);
                doc.text(`Genero: ${cmpe.genero == 'M' ? 'MASCULINO' : 'FEMENINO'}`, x, y + 15)
                doc.setFontSize(9);
                y = y + 25
                //doc.setTextColor(0, 0, 255);
                doc.text(`${comp.nombres} (${comp.clubuno !== null ? comp.clubuno : '-'})`, x, y + 5)
                doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                doc.text(`${comp.apellidos !== null ? comp.apellidos : ''}`, x, y + 10)
                doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                y = y + 20;
                //doc.setTextColor(255, 0, 0);
                doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                doc.text(`${comp.nombres2} (${comp.clubdos !== null ? comp.clubdos : '-'})`, x, y + 5)
                doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                doc.text(`${comp.apellidos2 !== null ? comp.apellidos2 : ''}`, x, y + 10)
                //doc.setTextColor(0, 0, 0);
                y = y + 50
                nbp += 1;
                if (nbp == 2) {
                    nbp = 0;
                    doc.addPage();
                    numPag += 1;
                    doc.setPage(numPag);
                }
            }

        }
        doc.save(`llavesGeneradas.pdf`);
        /*const content = pdfRef.current;
        const unit = "pt";
        const size = "letter"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const doc = new jsPDF(orientation, unit, size);
        doc.html(content, {
            callback: function (doc) {
                doc.save('listaCampeonato.pdf');
            },
            html2canvas: { scale: 0.54 },
            windowWidth: 700
        });*/
    }
    function cambiarValor(dato, valor, i, j) {
        console.log(dato, valor, j);
        fetch(`${server}/competidor/cambiarNumPelea`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'nropelea': valor, 'idpelea': dato.idpelea })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    var aux = listaLLaves;
                    aux[i].PELEAS[j].nropelea = parseInt(valor)
                    setListaLLaves([...aux]);
                    MsgUtils.msgCorrecto(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    function cambiarAreaLlave(dato, valor,i) {
        console.log(dato, valor);
        var aux = listaLLaves;
        setListaLLaves([]);
        fetch(`${server}/competidor/cambiarAreaLlave`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'area': valor, 'idllave': dato.idllave })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setSelectItem(0);
                    setActualizar(!actualizar);
                    MsgUtils.msgCorrecto(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    const getMargin = (valor) => {
        if (valor < 6) {
            return '100px';
        } else if (valor > 8) {
            return '60px'
        } else {
            return '20px'
        }
    }

    useEffect(() => {
        //if (categorias.length == 0) {
        fetch(`${server}/config/getConfiCategoriaUnido`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ idcampeonato })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setCategorias(data.ok);
                    getLlavesCategoria();
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
        //}
        getLLavesOficiales();
    }, [actualizar])
    useEffect(() => {
        var conf = JSON.parse(localStorage.getItem('kirugui'));
        if (conf != undefined) {
            var listaAr = []
            for (var i = 0; i < parseInt(conf.cantAreas); i++) {
                listaAr.push({ 'id': i + 1, 'nombre': 'Area ' + (i + 1) })
            }
            setAreas(listaAr)
        } else {
            MsgUtils.msgError("Configuracion de KIRUGUI no existe...")
        }
        if (selectItem !== 0) {
            verLlavesCategoriaOficial(selectItem);
        }
    }, [listaLLaves, selectItem])
    return (
        <div className='container-fluid'>
            {tipoL == 'E' && <div className='btn-group btn-group-sm mb-1'>
                <button className='btn btn-sm letraBtn btn-success' onClick={exportPDF}>
                    <i className="fa-solid fa-file-pdf"></i> PDF
                </button>
                <button className='btn btn-sm btn-info mx-1'>
                    <i className="fa-solid fa-arrow-up-9-1"></i> Numerar LLaves
                </button>
                <button className='btn btn-sm btn-danger ' onClick={() => setShowModal(true)}>
                    <i className="fa-solid fa-trash"></i> Eliminar LLaves
                </button>
            </div>}
            <div className='overflow-auto'>
                <div className='btn-group btn-group-sm mb-1'>
                    {categorias.map((item, index) => {
                        return (
                            <button className={`btn btn-sm lh-1 letraBtn ${selectItem === item.idcategoria ? 'botonLlave' : item.genero == 'M' ? 'botonMasc' : 'botonFeme'}`} onClick={() => verLlavesCategoriaOficial(item.idcategoria)}
                                key={index} style={{ marginRight: '2px' }}>
                                {item.nombre}
                            </button>
                        )
                    })}
                    <button className={`btn btn-sm  lh-1 letraBtn ${selectItem === -1 ? 'botonLlave' : 'btn-light'}`} onClick={() => verLlavesCategoria(-1)}
                        style={{ marginRight: '2px' }}>
                        EXHIBICIONES
                    </button>
                </div>
            </div>
            <div className='container-fluid' ref={pdfRef}>
                {lista.length !== 0 && selectItem !== 0 && selectItem !== -1 &&
                    lista.map((item, index) => {
                        if (numLlave == index) {
                            return (
                                <div className='card' key={index} >
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
                                                <select className="form-select form-select-sm text-light" style={{ background: '#1B8DFF' }}
                                                    value={(item.area==undefined||item.area==null)?0:item.area}
                                                    onChange={(e)=>cambiarAreaLlave(item,e.target.value,index)}>
                                                    <option selected>Ninguno</option>
                                                    {areas.map((item, index) => {
                                                        return (
                                                            <option value={item.id} key={index}>{item.nombre}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-body' >
                                        <div className='table table-responsive'>
                                            <table className="table">
                                                <tbody>
                                                    {item.PELEAS.map((itemm, indexx) => {
                                                        return (
                                                            <tr key={indexx} >
                                                                <th className='col-4'>
                                                                    <div className='container-fluid'>
                                                                        <div className="navbar-brand card flex-row bg-primary m-0 p-0 " >
                                                                            <img src={ImgUser} width="38" height="38" className=" my-auto rounded-circle card-img-left" />
                                                                            <div className='ps-2 my-auto d-none d-sm-inline'>
                                                                                <div className="userHeader text-light lh-sm" style={{ fontSize: '20px' }}>{itemm.nombres}</div>
                                                                                <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.apellidos}</div>
                                                                                <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.clubuno}</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row row-cols-2 g-0'>
                                                                            <div className='col-4 my-auto'>
                                                                                {tipoL == 'O' && <button className='btn btn-sm btn-dark letraNumPelea w-100' onClick={() => callback(itemm)}>
                                                                                    {itemm.nropelea}
                                                                                </button>}
                                                                                {tipoL == 'E' &&
                                                                                    <input className="form-control form-control-lg text-light bg-secondary"
                                                                                        type="number" placeholder="#"
                                                                                        value={itemm.nropelea} onChange={(e) => cambiarValor(itemm, e.target.value, index, indexx)}>
                                                                                    </input>}
                                                                            </div>
                                                                            <div className='col-8 my-auto'>
                                                                                #PELEA<hr style={{ border: "15px", background: "#f6f6f" }}></hr>
                                                                            </div>
                                                                        </div>
                                                                        <div className="navbar-brand card flex-row bg-danger m-0 p-0 " >
                                                                            <img src={ImgUser} width="38" height="38" className=" my-auto rounded-circle card-img-left" />
                                                                            <div className='ps-2 my-auto d-none d-sm-inline'>
                                                                                <div className="userHeader text-light lh-sm" style={{ fontSize: '20px' }}>{itemm.nombres2}</div>
                                                                                <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.apellidos2}</div>
                                                                                <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.clubdos}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </th>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })
                }
                {listaManual.length != 0 && selectItem == -1 &&
                    listaManual.map((item, index) => {
                        if (numLlave == index) {
                            return (
                                <div className='card' key={index} >
                                    <div className='card-header bg-transparent'>
                                        <div className='row row-cols-2 g-0'>
                                            <div className='col'>
                                                <div className='tituloHeader' style={{ fontSize: '20px' }}>
                                                    EXHIBICIONES {item.genero == 'M' ? 'MASCULINO' : 'FEMENINO'}
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className='tituloHeader' style={{ fontSize: '20px' }}>
                                                    {UtilsDate.getDateFormato(item.fecha)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-body' >
                                        <div className='table table-responsibe'>
                                            <table className="table">
                                                <tbody>
                                                    {item.PELEAS.map((itemm, indexx) => {
                                                        return (
                                                            <tr key={indexx} >
                                                                <th className='col-4'>
                                                                    <div className='container-fluid'>
                                                                        <div className="navbar-brand card flex-row bg-primary m-0 p-0 " >
                                                                            <img src={ImgUser} width="38" height="38" className=" my-auto rounded-circle card-img-left" />
                                                                            <div className='ps-2 my-auto d-none d-sm-inline'>
                                                                                <div className="userHeader text-light lh-sm" style={{ fontSize: '20px' }}>{itemm.nombres}</div>
                                                                                <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.apellidos}</div>
                                                                                <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.clubuno}</div>
                                                                                <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.edad} años</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row row-cols-2 g-0'>
                                                                            <div className='col-4 my-auto'>
                                                                                {tipoL == 'O' && <button className='btn btn-sm btn-dark letraNumPelea w-100' onClick={() => callback(itemm)}>
                                                                                    {itemm.nropelea}
                                                                                </button>}
                                                                                {tipoL == 'E' &&
                                                                                    <div className='btn-group'>
                                                                                        <input className="form-control form-control-lg text-light bg-secondary"
                                                                                            type="number"
                                                                                            defaultValue={itemm.nropelea} onChange={(e) => cambiarValor(itemm, e.target.value)}>
                                                                                        </input>
                                                                                        <h1 className='tituloHeader'>{itemm.nropelea}</h1>
                                                                                    </div>}
                                                                            </div>
                                                                            <div className='col-8 my-auto'>
                                                                                #PELEA<hr style={{ border: "15px", background: "#f6f6f" }}></hr>
                                                                            </div>
                                                                        </div>
                                                                        <div className="navbar-brand card flex-row bg-danger m-0 p-0 " >
                                                                            <img src={ImgUser} width="38" height="38" className=" my-auto rounded-circle card-img-left" />
                                                                            <div className='ps-2 my-auto d-none d-sm-inline'>
                                                                                <div className="userHeader text-light lh-sm" style={{ fontSize: '20px' }}>{itemm.nombres2}</div>
                                                                                <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.apellidos2}</div>
                                                                                <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.clubdos}</div>
                                                                                <div className='userHeader text-light lh-sm' style={{ fontSize: '20px' }}>{itemm.edad2} años</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </th>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })
                }
            </div>
            {lista.length !== 0 && selectItem !== -1 &&
                <div className='py-1'>
                    <div className='row row-cols-3 g-0'>
                        <div className='col-5 text-start my-auto'>
                            <button className='btn btn-sm text-light' onClick={() => cambiarLlave('B', lista.length)}>
                                <i className="fa-solid fa-square-caret-left fa-2xl"></i>
                            </button>
                        </div>
                        <div className='col-2 text-center my-auto bg-light'>
                            <div className='text-dark letraMontserratr'>{(numLlave + 1) + '/' + lista.length}</div>
                        </div>
                        <div className='col-5 text-end my-auto'>
                            <button className='btn btn-sm text-light' onClick={() => cambiarLlave('N', lista.length)}>
                                <i className="fa-solid fa-square-caret-right fa-2xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            }
            {listaManual.length !== 0 && selectItem == -1 &&
                <div className='py-1'>
                    <div className='row row-cols-3 g-0'>
                        <div className='col-5 text-start my-auto'>
                            <button className='btn btn-sm text-light' onClick={() => cambiarLlave('B', listaManual.length)}>
                                <i className="fa-solid fa-square-caret-left fa-2xl"></i>
                            </button>
                        </div>
                        <div className='col-2 text-center my-auto bg-light'>
                            <div className='text-dark letraMontserratr'>{(numLlave + 1) + '/' + listaManual.length}</div>
                        </div>
                        <div className='col-5 text-end my-auto'>
                            <button className='btn btn-sm text-light' onClick={() => cambiarLlave('N', listaManual.length)}>
                                <i className="fa-solid fa-square-caret-right fa-2xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            }
            <MsgDialogo show={showModal} msg='Seguro de eliminar las llaves generadas' okFunction={() => { setShowModal(false); eliminarLLaves(); }} notFunction={() => setShowModal(false)} />
        </div >
    )
}

export default PrincipalLlaves
