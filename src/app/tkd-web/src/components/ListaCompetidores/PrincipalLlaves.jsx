import React, { useEffect, useRef, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import UtilsDate from '../utils/UtilsDate';
import jsPDF from 'jspdf';
import ImgUser from '../../assets/user.png'
import {server} from '../utils/MsgUtils';

function PrincipalLlaves(props) {
    const { idcampeonato, genero, llaves, callback, tipoL } = props;
    const pdfRef = useRef(null);
    const [categorias, setCategorias] = useState([]);
    const [selectItem, setSelectItem] = useState(0);
    const [lista, setLista] = useState([]);
    const [numLlave, setNumLlave] = useState(0);
    const [actualizar, setActualizar] = useState(0);
    const [listaManual, setListaManual] = useState([]);
    function verLlavesCategoriaOficial(dato){
        setSelectItem(dato);
        setLista(llaves.filter((item) => item.idcategoria === dato));
        setNumLlave(0);
    }
    function verLlavesCategoria(dato){
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
    function cambiarLlave(tipo) {
        if (tipo === 'N') {
            if (numLlave < lista.length - 1) {
                setNumLlave(numLlave + 1);
            }
        } else if (tipo === 'B') {
            if (numLlave > 0) {
                setNumLlave(numLlave - 1);
            }
        }
    }
    const exportPDF = () => {
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
        var numPag=1;
        for (var cat of categorias){
            for(var subcat of cat.SUBCATEGORIA){
                var compe = llaves.filter((item)=>item.idcategoria==cat.idcategoria && item.idsubcategoria==subcat.idsubcategoria);
                var tipol = compe.length
                if(tipol!=0){
                    doc.setFontSize(12);
                    doc.text(`Pagina: ${numPag}`, (width/2)-20, y + 5);
                    doc.text(`Categoria: ${cat.nombre} -> Edad ${cat.edadini} - ${cat.edadfin} años`, x, y + 10);
                    doc.text(`Sub Categoria: ${subcat.nombre} -> Peso ${subcat.pesoini} - ${subcat.pesofin} kg`, x, y + 15);
                    doc.text(`Genero: ${cat.genero=='M'?'MASCULINO':'FEMENINO'}`,x,y+20)
                    doc.setFontSize(11);
                    y = y + 22
                    doc.addPage();
                    x=10;
                    y=5;
                    doc.line(x, y + 17, width - 10, y + 17, 'S');
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
    function cambiarValor(dato, valor) {
        console.log(dato,valor);
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
                    //callback();
                    MsgUtils.msgCorrecto(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    const getMargin=(valor)=>{
        if(valor<6){
            return '100px';
        }else if(valor>8){
            return '60px'
        }else {
            return '20px'
        }
    }

    useEffect(() => {
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
                    console.log(data.ok);
                    setCategorias(data.ok);
                    getLlavesCategoria();
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }, [])
    useEffect(() => {

    }, [llaves,selectItem])
    return (
        <div className='container-fluid py-2'>
            <div className='overflow-auto'>
            <div className='btn-group btn-group-sm mb-2'>
                {categorias.map((item, index) => {
                    return (
                        <button className={`btn btn-sm letraBtn ${selectItem === item.idcategoria ? 'botonLlave' : item.genero=='M'?'botonMasc':'botonFeme'}`} onClick={() => verLlavesCategoriaOficial(item.idcategoria)}
                            key={index} style={{ marginRight: '2px' }}>
                            {item.nombre}
                        </button>
                    )
                })}
                <button className={`btn btn-sm letraBtn ${selectItem === -1 ? 'botonLlave' : 'btn-light'}`} onClick={() => verLlavesCategoria(-1)}
                    style={{ marginRight: '2px' }}>
                    EXHIBICIONES
                </button>
                {tipoL == 'E' && <button className='btn btn-sm letraBtn btn-success' onClick={exportPDF}>
                    <i className="fa-solid fa-file-pdf"></i> PDF
                </button>}
            </div>
            </div>
            <div className='container-fluid' ref={pdfRef}>
            {lista.length !== 0 && selectItem !== 0 && selectItem !== -1 &&
                    lista.map((item, index) => {
                        return (
                            <div className='card' key={index} style={{ marginBottom: '70px' }}>
                                <div className='card-header bg-transparent'>
                                    <div className='row row-cols-2 g-0'>
                                        <div className='col'>
                                            <div className='tituloHeader' style={{ fontSize: '20px' }}>
                                                {`${item.nombregrado} ${item.genero=='M'?'MASCULINO':'FEMENINO'}`}
                                            </div>
                                            <div className='tituloHeader' style={{ fontSize: '20px' }}>
                                                {item.nombrecategoria + ' => ' + item.edadini + ' - ' + item.edadfin + ' Años'}
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div className='tituloHeader' style={{ fontSize: '20px' }}>
                                                {UtilsDate.getDateFormato(item.fecha)}
                                            </div>
                                            <div className='tituloHeader' style={{ fontSize: '20px' }}>
                                                {item.nombresubcategoria + ' => ' + item.pesoini + ' - ' + item.pesofin + ' Kg'}
                                            </div>
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
                                                                            <div className="userHeader text-light" style={{ fontSize: '20px' }}>{itemm.nombres}</div>
                                                                            <div className='userHeader text-light' style={{ fontSize: '20px' }}>{itemm.apellidos}</div>
                                                                            <div className='userHeader text-light' style={{ fontSize: '20px' }}>{itemm.clubuno}</div>
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
                                                                                    value={itemm.nropelea} onChange={(e) => cambiarValor(itemm, e.target.value)}>
                                                                                </input>}
                                                                        </div>
                                                                        <div className='col-8 my-auto'>
                                                                            #PELEA<hr style={{ border: "15px", background: "#f6f6f" }}></hr>
                                                                        </div>
                                                                    </div>
                                                                    <div className="navbar-brand card flex-row bg-danger m-0 p-0 " >
                                                                        <img src={ImgUser} width="38" height="38" className=" my-auto rounded-circle card-img-left" />
                                                                        <div className='ps-2 my-auto d-none d-sm-inline'>
                                                                            <div className="userHeader text-light" style={{ fontSize: '20px' }}>{itemm.nombres2}</div>
                                                                            <div className='userHeader text-light' style={{ fontSize: '20px' }}>{itemm.apellidos2}</div>
                                                                            <div className='userHeader text-light' style={{ fontSize: '20px' }}>{itemm.clubdos}</div>
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
                    })
                }
                {listaManual.length != 0 && selectItem == -1 &&
                    listaManual.map((item, index) => {
                        return (
                            <div className='card' key={index} style={{ marginBottom: `${getMargin(index)}` }}>
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
                                                                            <div className="userHeader text-light" style={{ fontSize: '20px' }}>{itemm.nombres}</div>
                                                                            <div className='userHeader text-light' style={{ fontSize: '20px' }}>{itemm.apellidos}</div>
                                                                            <div className='userHeader text-light' style={{ fontSize: '20px' }}>{itemm.clubuno}</div>
                                                                            <div className='userHeader text-light' style={{ fontSize: '20px' }}>{itemm.edad} años</div>
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
                                                                            <div className="userHeader text-light" style={{ fontSize: '20px' }}>{itemm.nombres2}</div>
                                                                            <div className='userHeader text-light' style={{ fontSize: '20px' }}>{itemm.apellidos2}</div>
                                                                            <div className='userHeader text-light' style={{ fontSize: '20px' }}>{itemm.clubdos}</div>
                                                                            <div className='userHeader text-light' style={{ fontSize: '20px' }}>{itemm.edad2} años</div>
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
                    })
                }
            </div>
            {
                lista.length !== 0 &&
                <div className='py-1'>
                    <div className='row row-cols-3 g-0'>
                        <div className='col-5 text-start my-auto'>
                            <button className='btn btn-sm text-light' onClick={() => cambiarLlave('B')}>
                                <i className="fa-solid fa-square-caret-left fa-2xl"></i>
                            </button>
                        </div>
                        <div className='col-2 text-center my-auto bg-light'>
                            <div className='text-dark letraMontserratr'>{(numLlave + 1) + '/' + lista.length}</div>
                        </div>
                        <div className='col-5 text-end my-auto'>
                            <button className='btn btn-sm text-light' onClick={() => cambiarLlave('N')}>
                                <i className="fa-solid fa-square-caret-right fa-2xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}

export default PrincipalLlaves
