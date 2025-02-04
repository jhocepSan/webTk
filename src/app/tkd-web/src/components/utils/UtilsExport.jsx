import { server } from './MsgUtils';
import imgTK from '../../assets/tkd.png'
import jsPDF from 'jspdf';
import 'jspdf-autotable';

async function exportarLlaves(categorias, listaLLavesi) {
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
    var areas = [...new Set(listaLLavesi.map(item => item.area))];
    for (var area of areas) {
        var listaLLaves = listaLLavesi.filter((item) => item.area == area);
        var x = 10;
        var y = 5;
        for (var cat of categorias) {
            for (var subcat of cat.SUBCATEGORIA) {
                var compe = listaLLaves.filter((item) => item.idcategoria == cat.idcategoria && item.idsubcategoria == subcat.idsubcategoria);
                compe.sort((a, b) => a.area - b.area)
                var tipol = compe.length
                if (tipol != 0) {
                    for (var peel of compe) {
                        var lsPele = peel.PELEAS.filter((item) => item.tipo == 0);
                        if (lsPele.length !== 0) {
                            //doc.setTextColor(0, 0, 0);
                            doc.setFontSize(12);
                            doc.text(`Pagina: ${numPag}`, (width / 2) - 20, y + 5);
                            doc.text(`Categoria: ${cat.nombre} -> Edad ${cat.edadini} - ${cat.edadfin} años`, x, y + 10);
                            doc.text(`Sub Categoria: ${subcat.nombre} -> Peso ${subcat.pesoini} - ${subcat.pesofin} kg`, x, y + 15);
                            doc.text(`Genero: ${cat.genero == 'M' ? 'MASCULINO' : 'FEMENINO'}`, x, y + 20)
                            doc.text(`Grado: ${peel.nombregrado}`, x + 70, y + 20)
                            doc.setFontSize(17);
                            doc.text(`Area: ${peel.area != null ? peel.area : ''}`, x + 140, y + 20)
                            doc.setFontSize(9);
                            y = y + 25
                            if (lsPele.length == 1) {
                                for (var cmp of lsPele) {
                                    doc.setTextColor(0, 0, 255);
                                    /*if (cmp.clubdos != null) {
                                        doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x, y + 5)
                                        doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x, y + 10)
                                        doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno : ''}`, x, y + 15)
                                    }*/
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                                    doc.setTextColor(0, 0, 255);
                                    doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x + 85, y + 5)
                                    doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x + 85, y + 10)
                                    doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno+' Altura:'+ cmp.alturauno : ''}`, x + 85, y + 15)
                                    y = y + 20
                                    doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.setFontSize(15);
                                    doc.setTextColor(0, 0, 0);
                                    doc.setFont('arial', 'bold');
                                    doc.text("Pelea #" + cmp.nropelea, x + 75, y + 30)
                                    doc.setFontSize(9)
                                    y = y + 50
                                    doc.setTextColor(0, 0, 0);
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                                    y = y + 20
                                    doc.setTextColor(255, 0, 0);
                                    doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x + 85, y + 5)
                                    doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x + 85, y + 10)
                                    doc.text(`${cmp.edaddos !== null ? 'Edad: ' + cmp.edaddos + ' Peso:' + cmp.pesodos+' Altura:'+ cmp.alturados : ''}`, x + 85, y + 15)
                                    doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    y = y + 50;
                                    doc.setTextColor(0, 0, 0);
                                }
                                doc.line(x + 105, y - 122, x + 105, y - 52, 'S');
                                doc.line(x + 105, y - 85, x + 135, y - 85, 'S');
                            } else if (lsPele.length == 2) {
                                for (var cmp of lsPele) {
                                    doc.setTextColor(0, 0, 255);
                                    if (cmp.clubdos != null) {
                                        doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x, y + 5)
                                        doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x, y + 10)
                                        doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno+' Altura:'+ cmp.alturauno : ''}`, x, y + 15)
                                    }
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                                    doc.setFontSize(15);
                                    doc.setTextColor(0, 0, 0);
                                    doc.setFont('arial', 'bold');
                                    doc.text("Pelea #" + cmp.nropelea, x + 50, y + 20)
                                    doc.setFontSize(9);
                                    if (cmp.clubuno == null) {
                                        doc.setTextColor(0, 0, 255);
                                        doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x + 85, y + 5)
                                        doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x + 85, y + 10)
                                        doc.text(`${cmp.edaddos !== null ? 'Edad: ' + cmp.edaddos + ' Peso:' + cmp.pesodos+' Altura:'+ cmp.alturados : ''}`, x + 85, y + 15)
                                    }
                                    y = y + 20
                                    if (cmp.clubdos == null) {
                                        doc.setTextColor(255, 0, 0);
                                        doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x + 85, y + 5)
                                        doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x + 85, y + 10)
                                        doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno+' Altura:'+ cmp.alturauno : ''}`, x + 85, y + 15)
                                    }
                                    if (cmp.clubuno != null) {
                                        doc.setTextColor(255, 0, 0);
                                        doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x, y + 5)
                                        doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x, y + 10)
                                        doc.text(`${cmp.edaddos !== null ? 'Edad: ' + cmp.edaddos + ' Peso:' + cmp.pesodos+' Altura:'+ cmp.alturados : ''}`, x, y + 15)
                                    }
                                    doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    y = y + 50
                                    doc.setTextColor(0, 0, 0);
                                }
                                doc.line(x + 105, y - 122, x + 105, y - 52, 'S');
                                doc.line(x + 105, y - 85, x + 135, y - 85, 'S');
                            }
                            if (lsPele.length == 4) {
                                for (var cmp of lsPele) {
                                    doc.setTextColor(0, 0, 255);
                                    if (cmp.clubdos != null) {
                                        doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x, y + 5)
                                        doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x, y + 10)
                                        doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno+' Altura:'+ cmp.alturauno: ''}`, x, y + 15)
                                    }
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                                    doc.setFontSize(15);
                                    doc.setTextColor(0, 0, 0);
                                    doc.setFont('arial', 'bold');
                                    doc.text("Pelea #" + cmp.nropelea, x + 50, y + 20)
                                    doc.setFontSize(9);
                                    if (cmp.clubuno == null) {
                                        doc.setTextColor(0, 0, 255);
                                        doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x + 85, y + 5)
                                        doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x + 85, y + 10)
                                        doc.text(`${cmp.edaddos !== null ? 'Edad: ' + cmp.edaddos + ' Peso:' + cmp.pesodos+' Altura:'+ cmp.alturados : ''}`, x + 85, y + 15)
                                    }
                                    y = y + 20
                                    if (cmp.clubdos == null) {
                                        doc.setTextColor(255, 0, 0);
                                        doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x + 85, y + 5)
                                        doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x + 85, y + 10)
                                        doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno+' Altura:'+ cmp.alturauno : ''}`, x + 85, y + 15)
                                    }
                                    if (cmp.clubuno != null) {
                                        doc.setTextColor(255, 0, 0);
                                        doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x, y + 5)
                                        doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x, y + 10)
                                        doc.text(`${cmp.edaddos !== null ? 'Edad: ' + cmp.edaddos + ' Peso:' + cmp.pesodos+' Altura:'+ cmp.alturados : ''}`, x, y + 15)
                                    }
                                    doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    y = y + 50
                                    doc.setTextColor(0, 0, 0);
                                }
                                doc.line(x + 105, y - 265, x + 105, y - 190, 'S');
                                doc.line(x + 105, y - 225, x + 135, y - 225, 'S');
                                doc.line(x + 105, y - 122, x + 105, y - 52, 'S');
                                doc.line(x + 105, y - 85, x + 135, y - 85, 'S');
                                doc.line(x + 135, y - 225, x + 135, y - 85, 'S');
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
        doc.setPage(numPag);
        var nbp = 0;
        var categoriasManual = categorias.filter(item => item.idcategoria == -1)
        for (var cate of categoriasManual) {
            var listaManual = listaLLaves.filter(item => item.idcategoria == cate.idcategoria && item.genero == cate.genero);
            for (var cmpe of listaManual) {
                var lsPele = cmpe.PELEAS.filter((item) => item.tipo == 0);
                if (lsPele.length == 2) {
                    if (nbp !== 0) {
                        doc.addPage();
                        numPag += 1;
                        doc.setPage(numPag);
                        nbp = 0;
                    }
                    x = 10;
                    y = 5;
                    doc.setFontSize(12);
                    doc.text(`Pagina: ${numPag}`, (width / 2) - 20, y + 5);
                    doc.text(`Peleas de Exhibición`, x, y + 10);
                    doc.text(`Genero: ${cmpe.genero == 'M' ? 'MASCULINO' : 'FEMENINO'}`, x, y + 15)
                    doc.setFontSize(17)
                    doc.text(`Area: ${cmpe.area != null ? cmpe.area : ''}`, x + 140, y + 15)
                    doc.setFontSize(9);
                    y = y + 25
                    for (var cmp of lsPele) {
                        doc.setTextColor(0, 0, 255);
                        if (cmp.clubdos != null) {
                            doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x, y + 5)
                            doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x, y + 10)
                            doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno+' Altura:'+ cmp.alturauno : ''}`, x, y + 15)
                        }
                        doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                        doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                        doc.setFontSize(15);
                        doc.setTextColor(0, 0, 0);
                        doc.setFont('arial', 'bold');
                        doc.text("Pelea #" + cmp.nropelea, x + 45, y + 18)
                        doc.setFontSize(9)
                        doc.setTextColor(255, 0, 0);
                        if (cmp.clubuno == null) {
                            doc.setTextColor(0, 0, 255);
                            doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x + 85, y + 5)
                            doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x + 85, y + 10)
                            doc.text(`${cmp.edaddos !== null ? 'Edad: ' + cmp.edaddos + ' Peso:' + cmp.pesodos+' Altura:'+ cmp.alturados : ''}`, x + 85, y + 15)
                        }

                        y = y + 20
                        if (cmp.clubdos == null) {
                            doc.setTextColor(255, 0, 0);
                            doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x + 85, y + 5)
                            doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x + 85, y + 10)
                            doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno+' Altura:'+ cmp.alturauno : ''}`, x + 85, y + 15)
                        }
                        if (cmp.clubuno != null) {
                            doc.setTextColor(255, 0, 0);
                            doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x, y + 5)
                            doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x, y + 10)
                            doc.text(`${cmp.edaddos !== null ? 'Edad: ' + cmp.edaddos + ' Peso:' + cmp.pesodos+' Altura:'+ cmp.alturados : ''}`, x, y + 15)
                        }
                        doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                        doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                        doc.setTextColor(0, 0, 0);
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
                    doc.setFontSize(17)
                    doc.text(`Area: ${cmpe.area != null ? cmpe.area : ''}`, x + 140, y + 15)
                    doc.setFontSize(9);
                    y = y + 25
                    doc.setTextColor(0, 0, 255);
                    doc.text(`${comp.nombres} (${comp.clubuno !== null ? comp.clubuno : '-'})`, x, y + 5)
                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                    doc.text(`${comp.apellidos !== null ? comp.apellidos + ' Grado:' + comp.cinturonuno : ''}`, x, y + 10)
                    doc.text(`${comp.edaduno !== null ? 'Edad: ' + comp.edaduno + ' Peso:' + comp.pesouno+' Altura:'+ comp.alturauno : ''}`, x, y + 15)
                    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                    doc.setFontSize(15);
                    doc.setTextColor(0, 0, 0);
                    doc.setFont('arial', 'bold');
                    doc.text("Pelea #" + comp.nropelea, x + 45, y + 18)
                    doc.setFontSize(9)
                    y = y + 20;
                    doc.setTextColor(255, 0, 0);
                    doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                    doc.text(`${comp.nombres2} (${comp.clubdos !== null ? comp.clubdos : '-'})`, x, y + 5)
                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                    doc.text(`${comp.apellidos2 !== null ? comp.apellidos2 + ' Grado:' + comp.cinturondos : ''}`, x, y + 10)
                    doc.text(`${comp.edaddos !== null ? 'Edad: ' + comp.edaddos + ' Peso:' + comp.pesodos+' Altura:'+ comp.alturados : ''}`, x, y + 15)
                    doc.setTextColor(0, 0, 0);
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
        }
    }
    var fecha = new Date();
    doc.save(`llavesGeneradas${fecha.toISOString().substring(0, 10)}.pdf`);
}
async function getFondoTargeta(nombre) {
    try {
        var imagen = await fetch(`${server}/adjunto/${nombre}.png`)
        const arrayBuffer = await imagen.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        return uint8Array;
    } catch (error) {
        return null
    }
}
async function exportarTargetaCompetidor(listaCompetidores, tipo) {
    try {
        var cmpSelect = JSON.parse(localStorage.getItem('campeonato'));
        var subtitulo = '';
        if (tipo == 'C') {
            subtitulo = 'KYORUGUI';
        } else if (tipo == 'P') {
            subtitulo = 'POOMSAE';
        } else if (tipo == 'D') {
            subtitulo = 'DEMOSTRACIONES';
        } else if (tipo == 'R') {
            subtitulo = 'ROMPIMIENTO';
        }
        var optiones = {
            orientation: 'l',
            unit: 'mm',
            format: 'A4',
            putOnlyUsedFonts: true,
            floatPrecision: 16 // or "smart", default is 16
        }
        var doc = new jsPDF(optiones);
        var imageBase64 = await getFondoTargeta('tarjetaUno');
        var imageBasePie = await getFondoTargeta('tarjetaDos');
        var x = 10, y = 10, numCard = 0, numPag = 1;
        for (var est of listaCompetidores) {
            console.log(est.nombres)
            doc.addImage(imageBase64, 'PNG', x - 2, y - 2, 70, 65);
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 255);
            doc.setFont('arial', 'bold');
            doc.text('ASOCIACIÓN TRADICIONAL DE CLUBES', x + 1, y + 2);
            doc.text('DE TAEKWONDO COCHABAMBA', x + 1, y + 6);
            doc.setTextColor(252, 173, 3);
            doc.setFontSize(11);
            doc.text('Tarjeta de Competidor', x + 1, y + 11);
            doc.setFontSize(13);
            doc.text(subtitulo, x + 10, y + 16);
            doc.addImage(imgTK, 'JPEG', x + 50, y + 4, 14, 14);
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.setFont('arial', '');
            doc.text(est.nombres + ' ' + est.apellidos, x + 1, y + 21);
            doc.text('Club.- ' + est.club, x + 1, y + 25);
            doc.text('Peso/kg.- ' + est.peso, x + 1, y + 29);
            doc.text('Grado.- ' + est.grado, x + 1, y + 33);
            doc.text(est.cinturon, x + 12, y + 36)
            doc.text('Categoria.- ' + est.nombrecategoria, x + 1, y + 40);
            doc.setFontSize(8);
            doc.setTextColor(255, 0, 0);
            doc.text(cmpSelect.nombre, x + 1, y + 43)
            //doc.text(, x + 1, y + 46)
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.line(x + 25, y + 52, x + 42, y + 52, 'FD')
            doc.setFont('arial', 'bold');
            doc.text('Puesto', x + 25, y + 55);
            doc.addImage(imageBasePie, 'PNG', x - 2, y + 64, 70, 29);
            doc.setFontSize(12);
            doc.line(x + 1, y + 73, x + 15, y + 73, 'FD')
            doc.setFont('arial', 'bold');
            doc.text('Puesto', x + 1, y + 77);
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);
            doc.setFont('arial', '');
            doc.text((est.genero == 'M' ? '(Varon' : '(Mujer') + ') ' + est.nombres, x + 16, y + 67);
            doc.text(est.apellidos, x + 16, y + 70)
            doc.setFontSize(9);
            doc.text(est.club + ' / kg' + est.peso, x + 16, y + 74);
            doc.text(est.cinturon + ' / ' + est.nombrecategoria, x + 16, y + 77)
            doc.line(x + 1, y + 78, x + 67, y + 78, 'FD')
            doc.text('|    1ºCombate     |     2ºCombate     |     3ºCombate     |', x + 1, y + 81)
            doc.line(x + 1, y + 83, x + 67, y + 83, 'FD')
            doc.text('| Gano  |  Perdio  |  Gano  |  Perdio  |  Gano  |  Perdio  |', x + 1, y + 86)
            doc.line(x + 1, y + 88, x + 67, y + 88, 'FD')
            if (numCard <= 2) {
                x += 71;
                y = 10;
            } else if (numCard == 3) {
                x = 10;
                y = 108;
            } else if (numCard >= 4) {
                x += 71;
                y = 108;
            }
            if (numCard == 7) {
                x = 10;
                y = 10;
                numPag += 1
                numCard = 0;
                doc.addPage();
                doc.setPage(numPag);
            } else {
                numCard += 1;
            }
        }
        var fechaDescarga = new Date()
        doc.save(`Tarjetas${subtitulo}-${fechaDescarga.toISOString().substring(0, 10)}.pdf`);
    } catch (error) {
        console.log(error)
    }
}

export default {
    exportarLlaves,
    exportarTargetaCompetidor
}