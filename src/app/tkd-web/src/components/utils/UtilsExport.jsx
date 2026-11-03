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
                            doc.setTextColor(0, 0, 0);
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
                                    doc.setDrawColor(0, 0, 255);
                                    for (let i = 0; i < 3; i++) {
                                        doc.text('# Llamada', x + 85, y)
                                        doc.rect(x + 100 + (i * 6), y - 3, 4, 4, 'S');
                                    }
                                    doc.setDrawColor(0, 0, 0);
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                                    doc.setTextColor(0, 0, 255);
                                    doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x + 85, y + 5)
                                    doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x + 85, y + 10)
                                    doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno + ' Altura:' + cmp.alturauno : ''}`, x + 85, y + 15)
                                    y = y + 20
                                    doc.setDrawColor(0, 0, 0);
                                    doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.setFontSize(15);
                                    doc.setTextColor(0, 0, 0);
                                    doc.setFont('arial', 'bold');
                                    doc.text("Pelea #" + cmp.nropelea, x + 75, y + 30)
                                    doc.setFontSize(9)
                                    y = y + 50
                                    doc.setTextColor(0, 0, 0);
                                    doc.setDrawColor(0, 0, 0);
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                                    y = y + 20
                                    doc.setTextColor(255, 0, 0);
                                    doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x + 85, y + 5)
                                    doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x + 85, y + 10)
                                    doc.text(`${cmp.edaddos !== null ? 'Edad: ' + cmp.edaddos + ' Peso:' + cmp.pesodos + ' Altura:' + cmp.alturados : ''}`, x + 85, y + 15)
                                    doc.setDrawColor(0, 0, 0);
                                    doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.setDrawColor(255, 0, 0);
                                    for (let i = 0; i < 3; i++) {
                                        doc.text('# Llamada', x + 85, y + 20)
                                        doc.rect(x + 100 + (i * 6), y + 17, 4, 4, 'S');
                                    }
                                    y = y + 50;
                                    doc.setTextColor(0, 0, 0);
                                    doc.setDrawColor(0, 0, 0);
                                    doc.setFontSize(12)
                                    let header = ['#Pelea', '1 round', '2 round', '3 round', '4 round', 'Ganador'];
                                    for (let i = 0; i < 6; i++) {
                                        // Dibujar Header y Rectángulos base
                                        doc.text(header[i], x + 57 + (i * 20), y + 9);
                                        doc.rect(x + 55 + (i * 20), y + 10, 20, 7, 'S'); // Fila header
                                        doc.rect(x + 55 + (i * 20), y + 17, 20, 7, 'S'); // Fila 1
                                        doc.rect(x + 55 + (i * 20), y + 24, 20, 7, 'S'); // Fila 2
                                        // Si no es la primera columna, dibujamos los dos cuadros (Azul y Rojo) juntos
                                        if (i > 0) {
                                            doc.setDrawColor(0, 0, 255);
                                            doc.rect(x + 55 + (i * 20) + 4, y + 11.5, 4, 4, 'S'); // Azul (izquierda)
                                            doc.setDrawColor(255, 0, 0);
                                            doc.rect(x + 55 + (i * 20) + 12, y + 11.5, 4, 4, 'S');

                                            // --- CUADROS EN FILA 1 ---
                                            doc.setDrawColor(0, 0, 255);
                                            doc.rect(x + 55 + (i * 20) + 4, y + 18.5, 4, 4, 'S'); // Azul (izquierda)
                                            doc.setDrawColor(255, 0, 0);
                                            doc.rect(x + 55 + (i * 20) + 12, y + 18.5, 4, 4, 'S'); // Rojo (derecha)

                                            // --- CUADROS EN FILA 2 ---
                                            doc.setDrawColor(0, 0, 255);
                                            doc.rect(x + 55 + (i * 20) + 4, y + 25.5, 4, 4, 'S'); // Azul (izquierda)
                                            doc.setDrawColor(255, 0, 0);
                                            doc.rect(x + 55 + (i * 20) + 12, y + 25.5, 4, 4, 'S'); // Rojo (derecha)

                                            // Resetear color a negro para los bordes de la tabla
                                            doc.setDrawColor(0, 0, 0);
                                        }
                                    }
                                }
                                doc.line(x + 105, y - 122, x + 105, y - 52, 'S');
                                doc.line(x + 105, y - 85, x + 135, y - 85, 'S');

                            } else if (lsPele.length == 2) {
                                for (var cmp of lsPele) {
                                    doc.setTextColor(0, 0, 255);
                                    if (cmp.clubdos != null) {
                                        doc.setTextColor(0, 0, 255);
                                        doc.setDrawColor(0, 0, 255);
                                        for (let i = 0; i < 3; i++) {
                                            doc.text('# Llamada', x, y)
                                            doc.rect(x + 15 + (i * 6), y - 3, 4, 4, 'S');
                                        }
                                        doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x, y + 5)
                                        doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x, y + 10)
                                        doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno + ' Altura:' + cmp.alturauno : ''}`, x, y + 15)
                                    }
                                    doc.setDrawColor(0, 0, 0);
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                                    doc.setFontSize(15);
                                    doc.setTextColor(0, 0, 0);
                                    doc.setFont('arial', 'bold');
                                    doc.text("Pelea #" + cmp.nropelea, x + 50, y + 20)
                                    doc.setFontSize(9);
                                    if (cmp.clubuno == null) {
                                        doc.setTextColor(0, 0, 255);
                                        doc.setDrawColor(0, 0, 255);
                                        for (let i = 0; i < 3; i++) {
                                            doc.text('# Llamada', x + 85, y)
                                            doc.rect(x + 100 + (i * 6), y - 3, 4, 4, 'S');
                                        }
                                        doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x + 85, y + 5)
                                        doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x + 85, y + 10)
                                        doc.text(`${cmp.edaddos !== null ? 'Edad: ' + cmp.edaddos + ' Peso:' + cmp.pesodos + ' Altura:' + cmp.alturados : ''}`, x + 85, y + 15)
                                    }
                                    y = y + 20
                                    if (cmp.clubdos == null) {
                                        doc.setTextColor(255, 0, 0);
                                        doc.setDrawColor(255, 0, 0);
                                        for (let i = 0; i < 3; i++) {
                                            doc.text('# Llamada', x + 85, y)
                                            doc.rect(x + 100 + (i * 6), y - 3, 4, 4, 'S');
                                        }
                                        doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x + 85, y + 5)
                                        doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x + 85, y + 10)
                                        doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno + ' Altura:' + cmp.alturauno : ''}`, x + 85, y + 15)
                                    }
                                    if (cmp.clubuno != null) {
                                        doc.setTextColor(255, 0, 0);
                                        doc.setDrawColor(255, 0, 0);
                                        for (let i = 0; i < 3; i++) {
                                            doc.text('# Llamada', x, y + 19)
                                            doc.rect(x + 15 + (i * 6), y + 16, 4, 4, 'S');
                                        }
                                        doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x, y + 5)
                                        doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x, y + 10)
                                        doc.text(`${cmp.edaddos !== null ? 'Edad: ' + cmp.edaddos + ' Peso:' + cmp.pesodos + ' Altura:' + cmp.alturados : ''}`, x, y + 15)
                                    }
                                    doc.setDrawColor(0, 0, 0);
                                    doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    y = y + 50
                                    doc.setTextColor(0, 0, 0);
                                }
                                doc.setTextColor(255, 0, 0);
                                doc.setDrawColor(255, 0, 0);
                                for (let i = 0; i < 3; i++) {
                                    doc.text('# Llamada', x + 85, y - 50 + 2)
                                    doc.rect(x + 100 + (i * 6), y - 51, 4, 4, 'S');
                                }
                                doc.setTextColor(0, 0, 255);
                                doc.setDrawColor(0, 0, 255);
                                for (let i = 0; i < 3; i++) {
                                    doc.text('# Llamada', x + 85, y - 120 + 2)
                                    doc.rect(x + 100 + (i * 6), y - 121, 4, 4, 'S');
                                }
                                doc.setDrawColor(0, 0, 0);
                                doc.line(x + 105, y - 122, x + 105, y - 52, 'S');
                                doc.line(x + 105, y - 85, x + 135, y - 85, 'S');
                                doc.setFontSize(12)
                                let header = ['#Pelea', '1 round', '2 round', '3 round', '4 round', 'Ganador'];
                                for (let i = 0; i < 6; i++) {
                                    // Dibujar Header y Rectángulos base
                                    doc.text(header[i], x + 57 + (i * 20), y + 9);
                                    doc.rect(x + 55 + (i * 20), y + 10, 20, 7, 'S'); // Fila header
                                    doc.rect(x + 55 + (i * 20), y + 17, 20, 7, 'S'); // Fila 1
                                    doc.rect(x + 55 + (i * 20), y + 24, 20, 7, 'S'); // Fila 2
                                    // Si no es la primera columna, dibujamos los dos cuadros (Azul y Rojo) juntos
                                    if (i > 0) {
                                        doc.setDrawColor(0, 0, 255);
                                        doc.rect(x + 55 + (i * 20) + 4, y + 11.5, 4, 4, 'S'); // Azul (izquierda)
                                        doc.setDrawColor(255, 0, 0);
                                        doc.rect(x + 55 + (i * 20) + 12, y + 11.5, 4, 4, 'S');

                                        // --- CUADROS EN FILA 1 ---
                                        doc.setDrawColor(0, 0, 255);
                                        doc.rect(x + 55 + (i * 20) + 4, y + 18.5, 4, 4, 'S'); // Azul (izquierda)
                                        doc.setDrawColor(255, 0, 0);
                                        doc.rect(x + 55 + (i * 20) + 12, y + 18.5, 4, 4, 'S'); // Rojo (derecha)

                                        // --- CUADROS EN FILA 2 ---
                                        doc.setDrawColor(0, 0, 255);
                                        doc.rect(x + 55 + (i * 20) + 4, y + 25.5, 4, 4, 'S'); // Azul (izquierda)
                                        doc.setDrawColor(255, 0, 0);
                                        doc.rect(x + 55 + (i * 20) + 12, y + 25.5, 4, 4, 'S'); // Rojo (derecha)

                                        // Resetear color a negro para los bordes de la tabla
                                        doc.setDrawColor(0, 0, 0);
                                    }
                                }
                            }
                            if (lsPele.length == 4) {
                                for (var cmp of lsPele) {
                                    doc.setTextColor(0, 0, 255);
                                    if (cmp.clubdos != null) {
                                        doc.setDrawColor(0, 0, 255);
                                        for (let i = 0; i < 3; i++) {
                                            doc.text('# Llamada', x, y)
                                            doc.rect(x + 15 + (i * 6), y - 3, 4, 4, 'S');
                                        }
                                        doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x, y + 5)
                                        doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x, y + 10)
                                        doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno + ' Altura:' + cmp.alturauno : ''}`, x, y + 15)
                                    }
                                    doc.setDrawColor(0, 0, 0);
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                                    doc.setFontSize(15);
                                    doc.setTextColor(0, 0, 0);
                                    doc.setFont('arial', 'bold');
                                    doc.text("Pelea #" + cmp.nropelea, x + 50, y + 20)
                                    doc.setFontSize(9);
                                    if (cmp.clubuno == null) {
                                        doc.setTextColor(0, 0, 255);
                                        doc.text(`${cmp.nombres2} `, x, y + 5)
                                        if (cmp.apellidos2 !== null) {
                                            doc.setDrawColor(0, 0, 255);
                                            for (let i = 0; i < 3; i++) {
                                                doc.text('# Llamada', x + 85, y)
                                                doc.rect(x + 100 + (i * 6), y - 3, 4, 4, 'S');
                                            }
                                            doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x + 85, y + 5)
                                            doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x + 85, y + 10)
                                            doc.text(`${cmp.edaddos !== null ? 'Edad: ' + cmp.edaddos + ' Peso:' + cmp.pesodos + ' Altura:' + cmp.alturados : ''}`, x + 85, y + 15)
                                        } else {
                                            doc.setDrawColor(0, 0, 255);
                                            for (let i = 0; i < 3; i++) {
                                                doc.text('# Llamada', x + 85, y)
                                                doc.rect(x + 100 + (i * 6), y - 3, 4, 4, 'S');
                                            }
                                        }
                                        doc.setDrawColor(0, 0, 0);
                                    }
                                    y = y + 20
                                    if (cmp.clubdos == null) {
                                        doc.setTextColor(255, 0, 0);
                                        doc.text(`${cmp.nombres} `, x, y + 5)
                                        if (cmp.apellidos !== null) {
                                            doc.setDrawColor(255, 0, 0);
                                            for (let i = 0; i < 3; i++) {
                                                doc.text('# Llamada', x + 85, y)
                                                doc.rect(x + 100 + (i * 6), y - 3, 4, 4, 'S');
                                            }
                                            doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x + 85, y + 5)
                                            doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x + 85, y + 10)
                                            doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno + ' Altura:' + cmp.alturauno : ''}`, x + 85, y + 15)
                                        }
                                        doc.setDrawColor(0, 0, 0);
                                    }
                                    if (cmp.clubuno != null) {
                                        doc.setTextColor(255, 0, 0);
                                        doc.setDrawColor(255, 0, 0);
                                        for (let i = 0; i < 3; i++) {
                                            doc.text('# Llamada', x, y + 19)
                                            doc.rect(x + 15 + (i * 6), y + 17, 4, 4, 'S');
                                        }
                                        doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x, y + 5)
                                        doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x, y + 10)
                                        doc.text(`${cmp.edaddos !== null ? 'Edad: ' + cmp.edaddos + ' Peso:' + cmp.pesodos + ' Altura:' + cmp.alturados : ''}`, x, y + 15)
                                    }
                                    doc.setDrawColor(0, 0, 0);
                                    doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                    y = y + 30
                                    doc.setTextColor(0, 0, 0);
                                }
                                doc.line(x + 105, y - 182, x + 105, y - 132, 'S');
                                doc.line(x + 105, y - 157, x + 135, y - 157, 'S');
                                doc.line(x + 105, y - 82, x + 105, y - 32, 'S');
                                doc.line(x + 105, y - 57, x + 135, y - 57, 'S');
                                doc.line(x + 135, y - 157, x + 135, y - 57, 'S');
                                doc.line(x + 135, y - 107, x + 165, y - 107, 'S');
                                doc.setTextColor(0, 0, 255);
                                doc.setDrawColor(0, 0, 255);
                                for (let i = 0; i < 3; i++) {
                                    doc.text('# Llamada', x + 110, y - 158)
                                    doc.rect(x + 125 + (i * 6), y - 162, 4, 4, 'S');
                                    doc.text('# Llamada', x + 85, y - 85)
                                    doc.rect(x + 100 + (i * 6), y - 87, 4, 4, 'S');
                                }
                                doc.setTextColor(255, 0, 0);
                                doc.setDrawColor(255, 0, 0);
                                for (let i = 0; i < 3; i++) {
                                    doc.text('# Llamada', x + 110, y - 53)
                                    doc.rect(x + 125 + (i * 6), y - 55, 4, 4, 'S');
                                    doc.text('# Llamada', x + 85, y - 128)
                                    doc.rect(x + 100 + (i * 6), y - 131, 4, 4, 'S');
                                }
                                y=y-15
                                doc.setTextColor(0, 0, 0);
                                doc.setDrawColor(0, 0, 0);
                                doc.setFontSize(12)
                                let header = ['#Pelea', '1 round', '2 round', '3 round', '4 round', 'Ganador'];
                                for (let i = 0; i < 6; i++) {
                                    // Dibujar Header y Rectángulos base
                                    doc.text(header[i], x + 57 + (i * 20), y + 9);
                                    doc.rect(x + 55 + (i * 20), y + 10, 20, 7, 'S'); // Fila header
                                    doc.rect(x + 55 + (i * 20), y + 17, 20, 7, 'S'); // Fila 1
                                    doc.rect(x + 55 + (i * 20), y + 24, 20, 7, 'S'); // Fila 2
                                    doc.rect(x + 55 + (i * 20), y + 31, 20, 7, 'S'); // Fila header
                                    doc.rect(x + 55 + (i * 20), y + 38, 20, 7, 'S'); // Fila 1
                                    doc.rect(x + 55 + (i * 20), y + 45, 20, 7, 'S');
                                    // Si no es la primera columna, dibujamos los dos cuadros (Azul y Rojo) juntos
                                    if (i > 0) {
                                        doc.setDrawColor(0, 0, 255);
                                        doc.rect(x + 55 + (i * 20) + 4, y + 11.5, 4, 4, 'S'); // Azul (izquierda)
                                        doc.setDrawColor(255, 0, 0);
                                        doc.rect(x + 55 + (i * 20) + 12, y + 11.5, 4, 4, 'S');

                                        // --- CUADROS EN FILA 1 ---
                                        doc.setDrawColor(0, 0, 255);
                                        doc.rect(x + 55 + (i * 20) + 4, y + 18.5, 4, 4, 'S'); // Azul (izquierda)
                                        doc.setDrawColor(255, 0, 0);
                                        doc.rect(x + 55 + (i * 20) + 12, y + 18.5, 4, 4, 'S'); // Rojo (derecha)

                                        // --- CUADROS EN FILA 2 ---
                                        doc.setDrawColor(0, 0, 255);
                                        doc.rect(x + 55 + (i * 20) + 4, y + 25.5, 4, 4, 'S'); // Azul (izquierda)
                                        doc.setDrawColor(255, 0, 0);
                                        doc.rect(x + 55 + (i * 20) + 12, y + 25.5, 4, 4, 'S'); // Rojo (derecha)

                                        doc.setDrawColor(0, 0, 255);
                                        doc.rect(x + 55 + (i * 20) + 4, y + 32.5, 4, 4, 'S'); // Azul (izquierda)
                                        doc.setDrawColor(255, 0, 0);
                                        doc.rect(x + 55 + (i * 20) + 12, y + 32.5, 4, 4, 'S');

                                        // --- CUADROS EN FILA 1 ---
                                        doc.setDrawColor(0, 0, 255);
                                        doc.rect(x + 55 + (i * 20) + 4, y + 39.5, 4, 4, 'S'); // Azul (izquierda)
                                        doc.setDrawColor(255, 0, 0);
                                        doc.rect(x + 55 + (i * 20) + 12, y + 39.5, 4, 4, 'S'); // Rojo (derecha)

                                        // --- CUADROS EN FILA 2 ---
                                        doc.setDrawColor(0, 0, 255);
                                        doc.rect(x + 55 + (i * 20) + 4, y + 46.5, 4, 4, 'S'); // Azul (izquierda)
                                        doc.setDrawColor(255, 0, 0);
                                        doc.rect(x + 55 + (i * 20) + 12, y + 46.5, 4, 4, 'S');
                                        // Resetear color a negro para los bordes de la tabla
                                        doc.setDrawColor(0, 0, 0);
                                    }
                                }
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
                    doc.setTextColor(0, 0, 0);
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
                            doc.setTextColor(0, 0, 255);
                            doc.setDrawColor(0, 0, 255);
                            for (let i = 0; i < 3; i++) {
                                doc.text('# Llamada', x, y)
                                doc.rect(x + 15 + (i * 6), y - 3, 4, 4, 'S');
                            }
                            doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x, y + 5)
                            doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x, y + 10)
                            doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno + ' Altura:' + cmp.alturauno : ''}`, x, y + 15)
                        }
                        doc.setDrawColor(0, 0, 0);
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
                            doc.setDrawColor(0, 0, 255);
                            for (let i = 0; i < 3; i++) {
                                doc.text('# Llamada', x + 85, y)
                                doc.rect(x + 100 + (i * 6), y - 3, 4, 4, 'S');
                            }
                            doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x + 85, y + 5)
                            doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x + 85, y + 10)
                            doc.text(`${cmp.edaddos !== null ? 'Edad: ' + cmp.edaddos + ' Peso:' + cmp.pesodos + ' Altura:' + cmp.alturados : ''}`, x + 85, y + 15)
                        }

                        y = y + 20
                        if (cmp.clubdos == null) {
                            doc.setTextColor(0, 0, 255);
                            doc.setDrawColor(0, 0, 255);
                            for (let i = 0; i < 3; i++) {
                                doc.text('# Llamada', x + 85, y - 79)
                                doc.rect(x + 100 + (i * 6), y - 81, 4, 4, 'S');
                            }
                            doc.setTextColor(255, 0, 0);
                            doc.setDrawColor(255, 0, 0);
                            for (let i = 0; i < 3; i++) {
                                doc.text('# Llamada', x + 85, y + 2)
                                doc.rect(x + 100 + (i * 6), y - 1, 4, 4, 'S');
                            }
                            doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x + 85, y + 6)
                            doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x + 85, y + 11)
                            doc.text(`${cmp.edaduno !== null ? 'Edad: ' + cmp.edaduno + ' Peso:' + cmp.pesouno + ' Altura:' + cmp.alturauno : ''}`, x + 85, y + 16)
                        }
                        if (cmp.clubuno != null) {
                            doc.setTextColor(255, 0, 0);
                            doc.setDrawColor(255, 0, 0);
                            for (let i = 0; i < 3; i++) {
                                doc.text('# Llamada', x, y + 19)
                                doc.rect(x + 15 + (i * 6), y + 16, 4, 4, 'S');
                            }
                            doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x, y + 5)
                            doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x, y + 10)
                            doc.text(`${cmp.edaddos !== null ? 'Edad: ' + cmp.edaddos + ' Peso:' + cmp.pesodos + ' Altura:' + cmp.alturados : ''}`, x, y + 15)

                        }

                        doc.setDrawColor(0, 0, 0);
                        doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                        doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                        doc.setTextColor(0, 0, 0);
                        y = y + 50
                    }
                    doc.line(x + 105, y - 122, x + 105, y - 52, 'S');
                    doc.line(x + 105, y - 85, x + 135, y - 85, 'S');
                    if (cmp.clubuno != null && cmp.clubdos != null) {
                        doc.setTextColor(0, 0, 255);
                        doc.setDrawColor(0, 0, 255);
                        for (let i = 0; i < 3; i++) {
                            doc.text('# Llamada', x + 85, y - 125)
                            doc.rect(x + 100 + (i * 6), y - 127, 4, 4, 'S');
                        }
                        doc.setTextColor(255, 0, 0);
                        doc.setDrawColor(255, 0, 0);
                        for (let i = 0; i < 3; i++) {
                            doc.text('# Llamada', x + 85, y - 48)
                            doc.rect(x + 100 + (i * 6), y - 50, 4, 4, 'S');
                        }
                    }
                    doc.setTextColor(0, 0, 0);
                    doc.setDrawColor(0, 0, 0);
                    doc.setFontSize(12)
                    let header = ['#Pelea', '1 round', '2 round', '3 round', '4 round', 'Ganador'];
                    for (let i = 0; i < 6; i++) {
                        // Dibujar Header y Rectángulos base
                        doc.text(header[i], x + 57 + (i * 20), y + 9);
                        doc.rect(x + 55 + (i * 20), y + 10, 20, 7, 'S'); // Fila header
                        doc.rect(x + 55 + (i * 20), y + 17, 20, 7, 'S'); // Fila 1
                        doc.rect(x + 55 + (i * 20), y + 24, 20, 7, 'S'); // Fila 2
                        // Si no es la primera columna, dibujamos los dos cuadros (Azul y Rojo) juntos
                        if (i > 0) {
                            doc.setDrawColor(0, 0, 255);
                            doc.rect(x + 55 + (i * 20) + 4, y + 11.5, 4, 4, 'S'); // Azul (izquierda)
                            doc.setDrawColor(255, 0, 0);
                            doc.rect(x + 55 + (i * 20) + 12, y + 11.5, 4, 4, 'S');

                            // --- CUADROS EN FILA 1 ---
                            doc.setDrawColor(0, 0, 255);
                            doc.rect(x + 55 + (i * 20) + 4, y + 18.5, 4, 4, 'S'); // Azul (izquierda)
                            doc.setDrawColor(255, 0, 0);
                            doc.rect(x + 55 + (i * 20) + 12, y + 18.5, 4, 4, 'S'); // Rojo (derecha)

                            // --- CUADROS EN FILA 2 ---
                            doc.setDrawColor(0, 0, 255);
                            doc.rect(x + 55 + (i * 20) + 4, y + 25.5, 4, 4, 'S'); // Azul (izquierda)
                            doc.setDrawColor(255, 0, 0);
                            doc.rect(x + 55 + (i * 20) + 12, y + 25.5, 4, 4, 'S'); // Rojo (derecha)

                            // Resetear color a negro para los bordes de la tabla
                            doc.setDrawColor(0, 0, 0);
                        }
                    }
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
                    y = y + 25;
                    doc.setTextColor(0, 0, 255);
                    doc.setDrawColor(0, 0, 255);
                    for (let i = 0; i < 3; i++) {
                        doc.text('# Llamada', x, y)
                        doc.rect(x + 15 + (i * 6), y - 3, 4, 4, 'S');
                    }
                    doc.setDrawColor(0, 0, 0);
                    doc.text(`${comp.nombres} (${comp.clubuno !== null ? comp.clubuno : '-'})`, x, y + 5)
                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                    doc.text(`${comp.apellidos !== null ? comp.apellidos + ' Grado:' + comp.cinturonuno : ''}`, x, y + 10)
                    doc.text(`${comp.edaduno !== null ? 'Edad: ' + comp.edaduno + ' Peso:' + comp.pesouno + ' Altura:' + comp.alturauno : ''}`, x, y + 15)
                    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                    doc.setFontSize(15);
                    doc.setTextColor(0, 0, 0);
                    doc.setFont('arial', 'bold');
                    doc.text("Pelea #" + comp.nropelea, x + 45, y + 18)
                    doc.setFontSize(9)
                    y = y + 20;
                    doc.setTextColor(255, 0, 0);
                    doc.setDrawColor(255, 0, 0);
                    for (let i = 0; i < 3; i++) {
                        doc.text('# Llamada', x, y + 19)
                        doc.rect(x + 15 + (i * 6), y + 17, 4, 4, 'S');
                    }
                    doc.setDrawColor(0, 0, 0);
                    doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                    doc.text(`${comp.nombres2} (${comp.clubdos !== null ? comp.clubdos : '-'})`, x, y + 5)
                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                    doc.text(`${comp.apellidos2 !== null ? comp.apellidos2 + ' Grado:' + comp.cinturondos : ''}`, x, y + 10)
                    doc.text(`${comp.edaddos !== null ? 'Edad: ' + comp.edaddos + ' Peso:' + comp.pesodos + ' Altura:' + comp.alturados : ''}`, x, y + 15)
                    y = y + 30
                    doc.setTextColor(0, 0, 0);
                    doc.setDrawColor(0, 0, 0);
                    doc.setFontSize(12)
                    let header = ['#Pelea', '1 round', '2 round', '3 round', '4 round', 'Ganador'];
                    for (let i = 0; i < 6; i++) {
                        // Dibujar Header y Rectángulos base
                        doc.text(header[i], x + 57 + (i * 20), y + 9);
                        doc.rect(x + 55 + (i * 20), y + 10, 20, 7, 'S'); // Fila header
                        // Si no es la primera columna, dibujamos los dos cuadros (Azul y Rojo) juntos
                        if (i > 0) {
                            doc.setDrawColor(0, 0, 255);
                            doc.rect(x + 55 + (i * 20) + 4, y + 11.5, 4, 4, 'S'); // Azul (izquierda)
                            doc.setDrawColor(255, 0, 0);
                            doc.rect(x + 55 + (i * 20) + 12, y + 11.5, 4, 4, 'S');
                            // Resetear color a negro para los bordes de la tabla
                            doc.setDrawColor(0, 0, 0);
                        }
                    }
                    doc.addPage();
                    x = 10;
                    y = 5;
                    numPag += 1;
                    doc.setPage(numPag);
                    /*y = y + 50
                    nbp += 1;
                    if (true) {
                        nbp = 0;
                        doc.addPage();
                        numPag += 1;
                        doc.setPage(numPag);
                    }*/
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

/*
 * Genera un PDF con llaves VACÍAS para rellenar a mano.
 *
 *   exportarLlavesVacias(1)      -> 1 pelea  = llave de 2 peleadores
 *   exportarLlavesVacias(2)      -> 2 peleas = llave de 4 peleadores
 *   exportarLlavesVacias(4)      -> 4 peleas = llave de 8 peleadores
 *   exportarLlavesVacias(2, 5)   -> 5 hojas iguales de la llave de 4
 *
 * Mantiene la misma geometría, colores (azul / rojo), cuadros "# Llamada",
 * "Pelea #" y tabla de rounds del generador de llaves original.
 * Usa jsPDF igual que tu función actual (global o importado).
 */

const LV_AZUL = [0, 0, 255];
const LV_ROJO = [255, 0, 0];
const LV_NEGRO = [0, 0, 0];

// Filas de la tabla de rounds por tamaño de llave (igual que el original).
// Si quiere una fila por pelea de la llave: { 1: 1, 2: 3, 4: 7 }
const LV_FILAS_TABLA = { 1: 3, 2: 3, 4: 6 };

function lvColor(doc, c) {
    doc.setTextColor(c[0], c[1], c[2]);
    doc.setDrawColor(c[0], c[1], c[2]);
}

/*
 * Dibuja una fila de formulario: texto, líneas para escribir y casillas.
 *   string   -> texto
 *   número   -> línea de ese largo (mm)
 *   Infinity -> línea que se reparte el espacio libre hasta xFin
 *   {caja:n} -> casilla cuadrada de n mm
 * Devuelve la x final.
 */
function lvFila(doc, x, y, partes, xFin = 200, dyLinea = 0.9) {
    let fijo = 0, elasticos = 0;
    for (const p of partes) {
        if (typeof p === 'string') fijo += doc.getTextWidth(p);
        else if (p === Infinity) elasticos++;
        else if (typeof p === 'number') fijo += p;
        else fijo += p.caja;
    }
    const libre = elasticos ? Math.max((xFin - x - fijo) / elasticos, 8) : 0;
    let cx = x;
    for (const p of partes) {
        if (typeof p === 'string') {
            doc.text(p, cx, y);
            cx += doc.getTextWidth(p);
        } else if (p === Infinity || typeof p === 'number') {
            const largo = p === Infinity ? libre : p;
            doc.line(cx, y + dyLinea, cx + largo, y + dyLinea, 'S');
            cx += largo;
        } else {
            doc.rect(cx, y - p.caja + 0.8, p.caja, p.caja, 'S');
            cx += p.caja;
        }
    }
    return cx;
}

function lvEncabezado(doc, x, y, width, numPag) {
    doc.setFont('helvetica', 'normal');
    lvColor(doc, LV_NEGRO);
    doc.setFontSize(12);
    doc.text(`Pagina: ${numPag}`, (width / 2) - 20, y + 5);
    lvFila(doc, x, y + 10, ['Categoria: ', 40, '  ->  Edad ', 10, ' - ', 10, ' años']);
    lvFila(doc, x, y + 15, ['Sub Categoria: ', 40, '  ->  Peso ', 10, ' - ', 10, ' kg']);
    lvFila(doc, x, y + 20, ['Genero: ', { caja: 4 }, ' M   ', { caja: 4 }, ' F']);
    lvFila(doc, x + 70, y + 20, ['Grado: ', 50]);
    doc.setFontSize(17);
    lvFila(doc, x + 140, y + 20, ['Area: ', 25]);
    doc.setFontSize(9);
}

// "# Llamada" + 3 casillas
function lvLlamada(doc, tx, ty, bx, by, color) {
    lvColor(doc, color);
    doc.setFontSize(9);
    doc.text('# Llamada', tx, ty);
    for (let i = 0; i < 3; i++) doc.rect(bx + (i * 6), by, 4, 4, 'S');
}

// Datos a rellenar del competidor: nombre/club, apellidos/grado, edad/peso/altura
function lvDatos(doc, px, py, xFin, color, finFila1) {
    lvColor(doc, color);
    doc.setFontSize(9);
    if (finFila1 !== undefined) {
        // la línea del nombre se une con el brazo de la llave (y+7)
        lvFila(doc, px, py + 5, ['Nombre: ', Infinity], finFila1, 2);
    } else {
        lvFila(doc, px, py + 5, ['Nombre: ', Infinity], xFin);
    }
    lvFila(doc, px, py + 10, ['Club: ', Infinity, '  Grado: ', Infinity], xFin);
    lvFila(doc, px, py + 15, ['Edad: ', Infinity, '  Peso: ', Infinity, '  Altura: ', Infinity], xFin);
}

function lvPelea(doc, px, py, xFin) {
    lvColor(doc, LV_NEGRO);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    lvFila(doc, px, py, ['Pelea #', Infinity], xFin);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
}

// Brazo en forma de corchete + salida de la pelea
function lvBrazoSuperior(doc, x, y) {
    lvColor(doc, LV_NEGRO);
    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
}
function lvBrazoInferior(doc, x, y) {
    lvColor(doc, LV_NEGRO);
    doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
}

// Tabla de rounds (azul / rojo por casilla)
function lvTabla(doc, x, y, filas) {
    const header = ['#Pelea', '1 round', '2 round', '3 round', '4 round', 'Ganador'];
    lvColor(doc, LV_NEGRO);
    doc.setFontSize(12);
    for (let i = 0; i < 6; i++) {
        doc.text(header[i], x + 57 + (i * 20), y + 9);
        for (let f = 0; f < filas; f++) {
            doc.setDrawColor(0, 0, 0);
            doc.rect(x + 55 + (i * 20), y + 10 + (f * 7), 20, 7, 'S');
            if (i > 0) {
                doc.setDrawColor(0, 0, 255);
                doc.rect(x + 55 + (i * 20) + 4, y + 11.5 + (f * 7), 4, 4, 'S');
                doc.setDrawColor(255, 0, 0);
                doc.rect(x + 55 + (i * 20) + 12, y + 11.5 + (f * 7), 4, 4, 'S');
            }
        }
    }
    doc.setDrawColor(0, 0, 0);
    doc.setFontSize(9);
}

// Una pelea con los dos competidores a la izquierda (llaves de 4 y 8)
function lvPeleaIzquierda(doc, x, y, yRojoBox) {
    // azul
    lvLlamada(doc, x, y, x + 15, y - 3, LV_AZUL);
    lvDatos(doc, x, y, x + 70, LV_AZUL, x + 35);
    lvBrazoSuperior(doc, x, y);
    lvPelea(doc, x + 40, y + 20, x + 74);
    y += 20;
    // rojo
    lvLlamada(doc, x, y + 19, x + 15, y + yRojoBox, LV_ROJO);
    lvDatos(doc, x, y, x + 70, LV_ROJO, x + 35);
    lvBrazoInferior(doc, x, y);
    return y;
}

/* ---------- 1 pelea: llave de 2 peleadores ---------- */
function lvLlave2(doc, x, y) {
    // azul
    lvLlamada(doc, x + 85, y, x + 100, y - 3, LV_AZUL);
    lvDatos(doc, x + 85, y, x + 195, LV_AZUL);
    lvBrazoSuperior(doc, x, y);
    y += 20;
    lvBrazoInferior(doc, x, y);
    lvPelea(doc, x + 72, y + 30, x + 104);
    y += 50;
    lvBrazoSuperior(doc, x, y);
    y += 20;
    // rojo
    lvDatos(doc, x + 85, y, x + 195, LV_ROJO);
    lvBrazoInferior(doc, x, y);
    lvLlamada(doc, x + 85, y + 20, x + 100, y + 17, LV_ROJO);
    y += 50;
    lvTabla(doc, x, y, LV_FILAS_TABLA[1]);
    lvColor(doc, LV_NEGRO);
    doc.line(x + 105, y - 122, x + 105, y - 52, 'S');
    doc.line(x + 105, y - 85, x + 135, y - 85, 'S');
}

/* ---------- 2 peleas: llave de 4 peleadores ---------- */
function lvLlave4(doc, x, y) {
    for (let k = 0; k < 2; k++) {
        lvPeleaIzquierda(doc, x, y, 16);
        y += 70;
    }
    lvLlamada(doc, x + 85, y - 48, x + 100, y - 51, LV_ROJO);
    lvLlamada(doc, x + 85, y - 118, x + 100, y - 121, LV_AZUL);
    lvColor(doc, LV_NEGRO);
    doc.line(x + 105, y - 122, x + 105, y - 52, 'S');
    doc.line(x + 105, y - 85, x + 135, y - 85, 'S');
    lvTabla(doc, x, y, LV_FILAS_TABLA[2]);
}

/* ---------- 4 peleas: llave de 8 peleadores ---------- */
function lvLlave8(doc, x, y) {
    for (let k = 0; k < 4; k++) {
        y = lvPeleaIzquierda(doc, x, y, 17);
        y += 30;
    }
    lvColor(doc, LV_NEGRO);
    doc.line(x + 105, y - 182, x + 105, y - 132, 'S');
    doc.line(x + 105, y - 157, x + 135, y - 157, 'S');
    doc.line(x + 105, y - 82, x + 105, y - 32, 'S');
    doc.line(x + 105, y - 57, x + 135, y - 57, 'S');
    doc.line(x + 135, y - 157, x + 135, y - 57, 'S');
    doc.line(x + 135, y - 107, x + 165, y - 107, 'S');
    lvLlamada(doc, x + 110, y - 158, x + 125, y - 162, LV_AZUL);
    lvLlamada(doc, x + 85, y - 85, x + 100, y - 87, LV_AZUL);
    lvLlamada(doc, x + 110, y - 53, x + 125, y - 55, LV_ROJO);
    lvLlamada(doc, x + 85, y - 128, x + 100, y - 131, LV_ROJO);
    y -= 15;
    lvTabla(doc, x, y, LV_FILAS_TABLA[4]);
}

/*
 * cantidad: número de peleas de la primera ronda (1, 2 o 4).
 *           1 -> 2 peleadores, 2 -> 4 peleadores, 4 -> 8 peleadores.
 * copias:   cuántas hojas iguales generar (por defecto 1).
 */
async function exportarLlavesVacias(cantidad, copias = 1) {
    const n = Number(cantidad);
    const plantillas = { 1: lvLlave2, 2: lvLlave4, 4: lvLlave8 };
    if (!plantillas[n]) {
        throw new Error('Cantidad de llaves no soportada. Use 1 (2 peleadores), 2 (4 peleadores) o 4 (8 peleadores).');
    }
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'letter',
        putOnlyUsedFonts: true,
        floatPrecision: 16
    });
    const x = 10;
    const y = 5;
    const width = doc.internal.pageSize.getWidth();
    for (let pag = 1; pag <= copias; pag++) {
        if (pag > 1) doc.addPage();
        lvEncabezado(doc, x, y, width, pag);
        plantillas[n](doc, x, y + 25);
    }
    const fecha = new Date().toISOString().substring(0, 10);
    doc.save(`llavesVacias_${n * 2}peleadores_${fecha}.pdf`);
}
export default {
    exportarLlaves,
    exportarTargetaCompetidor,
    exportarLlavesVacias
}