import React, { useEffect, useRef, useState } from 'react'
import jsPDF from 'jspdf';
import MsgUtils from '../utils/MsgUtils';
import { server } from '../utils/MsgUtils';

function CompetidoresPdf(props) {
    const pdfRef = useRef(null);
    const { categorias, listaCompetidores, campeonato, tipo, idcampeonato } = props;
    const [grados, setGrados] = useState([]);
    const exportPDF = () => {
        const content = pdfRef.current;
        const unit = "mm";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const doc = new jsPDF(orientation, unit, size);
        var subtitulo = '';
        if (tipo == 'C') {
            subtitulo = 'COMBATE';
        } else if (tipo == 'P') {
            subtitulo = 'POOMSE';
        } else if (tipo == 'D') {
            subtitulo = 'DEMOSTRACIONES';
        } else if (tipo == 'R') {
            subtitulo = 'ROMPIMIENTO';
        }
        doc.html(content, {
            callback: function (doc) {
                doc.save('listaCampeonato' + campeonato + subtitulo + '.pdf');
            },
            autoPaging: 'text',
            putOnlyUsedFonts: true,
            html2canvas: { scale: 0.5 },
            windowWidth: 700
        });
    }
    function descargarPdf() {
        var cmpSelect = JSON.parse(localStorage.getItem('campeonato'));
        var subtitulo = '';
        if (tipo == 'C') {
            subtitulo = 'COMBATE';
        } else if (tipo == 'P') {
            subtitulo = 'POOMSE';
        } else if (tipo == 'D') {
            subtitulo = 'DEMOSTRACIONES';
        } else if (tipo == 'R') {
            subtitulo = 'ROMPIMIENTO';
        }
        var optiones = {
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,
            floatPrecision: 16 // or "smart", default is 16
        }
        var doc = new jsPDF(optiones);
        var x = 10;
        var y = 10;
        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        doc.setFontSize(13);
        doc.text('Lista de Estudiantes ' + getTipoLista(), x + 40, y);
        if (tipo == 'C') {
            for (var cat of categorias) {
                for (var subcat of cat.SUBCATEGORIA) {
                    if (y >= height - 20) {
                        doc.addPage();
                        x = 10;
                        y = 10;
                    }
                    var listaFiltrada = listaCompetidores.filter((dato) => dato.idcategoria == cat.idcategoria && dato.idsubcategoria == subcat.idsubcategoria);
                    if (listaFiltrada.length !== 0) {
                        doc.setFontSize(12);
                        doc.text(`Categoria: ${cat.nombre} -> Edad ${cat.edadini} - ${cat.edadfin} años`, x, y + 10);
                        doc.text(`Sub Categoria: ${subcat.nombre} -> Peso ${subcat.pesoini} - ${subcat.pesofin} kg`, x, y + 15);
                        doc.setFontSize(11);
                        doc.line(x, y + 17, width - 10, y + 17, 'S');
                        doc.text('Nombre Completo', x, y + 22);
                        doc.text('Edad', x + 80, y + 22);
                        doc.text('Peso', x + 93, y + 22);
                        doc.text('Grado', x + 106, y + 22);
                        doc.text('Cinturon', x + 136, y + 22);
                        doc.text('Club', x + 156, y + 22);
                        doc.line(x, y + 23, width - 10, y + 23, 'S');
                        y = y + 24
                        if (y >= height - 20) {
                            doc.addPage();
                            x = 10;
                            y = 10;
                        }
                        doc.setFontSize(9);
                        for (var cmp of listaFiltrada) {
                            doc.text(cmp.nombres + ' ' + cmp.apellidos, x, y + 5);
                            doc.text(cmp.edad.toString(), x + 80, y + 5);
                            doc.text(cmp.peso.toString(), x + 93, y + 5);
                            doc.text(cmp.grado.substring(0, 14), x + 106, y + 5);
                            doc.text(cmp.cinturon, x + 136, y + 5);
                            doc.text(cmp.club, x + 156, y + 5);
                            doc.line(x, y + 6, width - 10, y + 6, 'S');
                            y = y + 7;
                            if (y >= height - 20) {
                                doc.addPage();
                                x = 10;
                                y = 10;
                            }
                        }
                    }
                }
            }
        } else if (tipo == 'P') {
            for (var gr of grados) {
                for (var cat of categorias) {
                    if (y >= height - 20) {
                        doc.addPage();
                        x = 10;
                        y = 10;
                    }
                    var listaFiltrada = listaCompetidores.filter((dato) => dato.idcategoria == cat.idcategoria && dato.idgrado == gr.idgrado);
                    if (listaFiltrada.length !== 0) {
                        doc.setFontSize(12);
                        doc.text(`Nombre del grado: ${gr.nombre}`, x, y + 10);
                        doc.text(`Categoria: ${cat.nombre} -> EDAD ${cat.edadini} - ${cat.edadfin} años`, x, y + 15);
                        doc.setFontSize(11);
                        doc.line(x, y + 17, width - 10, y + 17, 'S');
                        doc.text('Nombre Completo', x, y + 22);
                        doc.text('Edad', x + 80, y + 22);
                        doc.text('Grado', x + 93, y + 22);
                        doc.text('Cinturon', x + 136, y + 22);
                        doc.text('Club', x + 156, y + 22);
                        doc.line(x, y + 23, width - 10, y + 23, 'S');
                        y = y + 24
                        if (y >= height - 20) {
                            doc.addPage();
                            x = 10;
                            y = 10;
                        }
                        doc.setFontSize(9);
                        for (var cmp of listaFiltrada) {
                            doc.text(cmp.nombres + ' ' + cmp.apellidos, x, y + 5);
                            doc.text(cmp.edad.toString(), x + 80, y + 5);
                            doc.text(cmp.grado, x + 93, y + 5);
                            doc.text(cmp.cinturon, x + 136, y + 5);
                            doc.text(cmp.club, x + 156, y + 5);
                            doc.line(x, y + 6, width - 10, y + 6, 'S');
                            y = y + 7;
                            if (y >= height - 20) {
                                doc.addPage();
                                x = 10;
                                y = 10;
                            }
                        }
                    }
                }
            }
        }
        doc.save(cmpSelect.nombre.replace(' ', '') + subtitulo + '.pdf');
    }
    function getTipoLista() {
        var subtitulo = '';
        if (listaCompetidores.length !== 0) {
            var info = listaCompetidores[0];
            if (info.tipo == 'C') {
                subtitulo = 'COMBATE';
            } else if (info.tipo == 'P') {
                subtitulo = 'POOMSE';
            } else if (info.tipo == 'D') {
                subtitulo = 'DEMOSTRACIONES';
            } else if (info.tipo == 'R') {
                subtitulo = 'ROMPIMIENTO';
            }
            subtitulo += info.genero == 'M' ? ' genero MASCULINO' : ' genero FEMENINO';
            return 'tipo ' + subtitulo;
        } else {
            return ''
        }
    }
    useEffect(() => {
        console.log(listaCompetidores);
        if (tipo === 'P') {
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
                    console.log(data);
                    if (data.ok) {
                        setGrados(data.ok);
                        //setActualizar(!actualizar);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        }
    }, [tipo])
    return (
        <>
            <button className='btn btn-sm btn-success' onClick={() => descargarPdf()}>Descargar PDF</button>
            <div className='container py-2 bg-light' ref={pdfRef}>
                <div className='text-center tituloPdf'>Lista Del Campeonato {campeonato}</div>
                <div className='text-center tituloPdf'>{getTipoLista()}</div>
                {tipo === 'C' &&
                    categorias.map((item, index) => {
                        return (
                            <div className='container-fluid' key={index}>
                                {item.SUBCATEGORIA.map((subcat, idx) => {
                                    var listaFiltrada = listaCompetidores.filter((dato) => dato.idcategoria == item.idcategoria && dato.idsubcategoria == subcat.idsubcategoria)
                                    if (listaFiltrada.length !== 0) {
                                        return (
                                            <div key={idx} >
                                                <div className='subtituloPdf text-dark'>{`Categoria: ${item.nombre} -> Edad ${item.edadini} - ${item.edadfin} años`}</div>
                                                <div className='subtituloPdf text-dark'>{`Sub Categoria: ${subcat.nombre} -> Peso ${subcat.pesoini} - ${subcat.pesofin} kg`}</div>
                                                <div className='table-responsive'>
                                                    <table className="table">
                                                        <thead className='bg-primary bg-gradient subtituloPdf text-light'>
                                                            <tr>
                                                                <th >Nombre Completo</th>
                                                                <th >Edad</th>
                                                                <th >Peso</th>
                                                                <th >Grado</th>
                                                                <th >Cinturon</th>
                                                                <th >Club</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {listaFiltrada.map((competidor, cmp) => {
                                                                return (
                                                                    <tr key={cmp}>
                                                                        <td >{`${competidor.nombres} ${competidor.apellidos}`}</td>
                                                                        <td>{`${competidor.edad}`}</td>
                                                                        <td>{`${competidor.peso}`}</td>
                                                                        <td>{`${competidor.grado}`}</td>
                                                                        <td>{`${competidor.cinturon}`}</td>
                                                                        <td>{`${competidor.club}`}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        )
                    })}
                {tipo === 'P' &&
                    grados.map((item, index) => {
                        return (
                            <div className='container-fluid' key={index}>
                                {categorias.map((cate, idx) => {
                                    var listaFiltrada = listaCompetidores.filter((dato) => dato.idcategoria == cate.idcategoria && dato.idgrado == item.idgrado)
                                    if (listaFiltrada.length !== 0) {
                                        return (
                                            <div key={idx} className='mb-2'>
                                                <div className='subtituloPdf text-dark'>{`Nombre del grado: ${item.nombre}`} </div>
                                                <div className='subtituloPdf text-dark'>{`Categoria: ${cate.nombre} -> EDAD ${cate.edadini} - ${cate.edadfin} años`}</div>
                                                <div className='table-responsive'>
                                                    <table className="table">
                                                        <thead className='bg-primary bg-gradient subtituloPdf text-light'>
                                                            <tr>
                                                                <th >Nombre Completo</th>
                                                                <th >Edad</th>
                                                                <th >Peso</th>
                                                                <th >Grado</th>
                                                                <th >Cinturon</th>
                                                                <th >Club</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {listaFiltrada.map((competidor, cmp) => {
                                                                return (
                                                                    <tr key={cmp}>
                                                                        <td >{`${competidor.nombres} ${competidor.apellidos}`}</td>
                                                                        <td>{`${competidor.edad}`}</td>
                                                                        <td>{`${competidor.peso}`}</td>
                                                                        <td>{`${competidor.grado}`}</td>
                                                                        <td>{`${competidor.cinturon}`}</td>
                                                                        <td>{`${competidor.club}`}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        )
                    })}
            </div>
        </>
    )
}

export default CompetidoresPdf
