import jsPDF from 'jspdf';

async function exportarLlaves(categorias, listaLLaves) {
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
            var compe = listaLLaves.filter((item) => item.idcategoria == cat.idcategoria && item.idsubcategoria == subcat.idsubcategoria);
            var tipol = compe.length
            if (tipol != 0) {
                for (var peel of compe) {
                    var lsPele = peel.PELEAS.filter((item)=>item.tipo==0);
                    if (lsPele.length !== 0) {
                        //doc.setTextColor(0, 0, 0);
                        doc.setFontSize(12);
                        doc.text(`Pagina: ${numPag}`, (width / 2) - 20, y + 5);
                        doc.text(`Categoria: ${cat.nombre} -> Edad ${cat.edadini} - ${cat.edadfin} años`, x, y + 10);
                        doc.text(`Sub Categoria: ${subcat.nombre} -> Peso ${subcat.pesoini} - ${subcat.pesofin} kg`, x, y + 15);
                        doc.text(`Genero: ${cat.genero == 'M' ? 'MASCULINO' : 'FEMENINO'}`, x, y + 20)
                        doc.text(`Grado: ${peel.nombregrado}`, x + 70, y + 20)
                        doc.setFontSize(17);
                        doc.text(`Area: ${peel.area!=null?peel.area:''}`, x + 140, y + 20)
                        doc.setFontSize(9);
                        y = y + 25
                        if (lsPele.length == 2) {
                            for (var cmp of lsPele) {
                                doc.setTextColor(0, 0, 255);
                                if (cmp.clubdos != null) {
                                    doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x, y + 5)
                                    doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x, y + 10)
                                    doc.text(`${cmp.edaduno!==null? 'Edad: '+cmp.edaduno+' Peso:' +cmp.pesouno:''}`, x, y + 15)
                                }
                                doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                                if (cmp.clubuno == null) {
                                    doc.setTextColor(0, 0, 255);
                                    doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x + 85, y + 5)
                                    doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x + 85, y + 10)
                                    doc.text(`${cmp.edaddos!==null? 'Edad: '+cmp.edaddos+' Peso:' +cmp.pesodos:''}`, x+85, y + 15)
                                }
                                y = y + 20
                                if (cmp.clubdos == null) {
                                    doc.setTextColor(255, 0, 0);
                                    doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x + 85, y + 5)
                                    doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x + 85, y + 10)
                                    doc.text(`${cmp.edaduno!==null? 'Edad: '+cmp.edaduno+' Peso:' +cmp.pesouno:''}`, x+85, y + 15)
                                }
                                if (cmp.clubuno != null) {
                                    doc.setTextColor(255, 0, 0);
                                    doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x, y + 5)
                                    doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x, y + 10)
                                    doc.text(`${cmp.edaddos!==null? 'Edad: '+cmp.edaddos+' Peso:' +cmp.pesodos:''}`, x, y + 15)
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
                                    doc.text(`${cmp.edaduno!==null? 'Edad: '+cmp.edaduno+' Peso:' +cmp.pesouno:''}`, x, y + 15)
                                }
                                doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                                doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                                if (cmp.clubuno == null) {
                                    doc.setTextColor(0, 0, 255);
                                    doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x + 85, y + 5)
                                    doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x + 85, y + 10)
                                    doc.text(`${cmp.edaddos!==null? 'Edad: '+cmp.edaddos+' Peso:' +cmp.pesodos:''}`, x+85, y + 15)
                                }
                                y = y + 20
                                if (cmp.clubdos == null) {
                                    doc.setTextColor(255, 0, 0);
                                    doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x + 85, y + 5)
                                    doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x + 85, y + 10)
                                    doc.text(`${cmp.edaduno!==null? 'Edad: '+cmp.edaduno+' Peso:' +cmp.pesouno:''}`, x+85, y + 15)
                                }
                                if (cmp.clubuno != null) {
                                    doc.setTextColor(255, 0, 0);
                                    doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x, y + 5)
                                    doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x, y + 10)
                                    doc.text(`${cmp.edaddos!==null? 'Edad: '+cmp.edaddos+' Peso:' +cmp.pesodos:''}`, x, y + 15)
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
        var listaManual = listaLLaves.filter(item=>item.idcategoria==cate.idcategoria && item.genero==cate.genero);
        for (var cmpe of listaManual) {
            var lsPele = cmpe.PELEAS.filter((item)=>item.tipo==0);
            if (lsPele.length == 2) {
                if(nbp!==0){
                    doc.addPage();
                    numPag += 1;
                    doc.setPage(numPag);
                    nbp=0;
                }
                x = 10;
                y = 5;
                doc.setFontSize(12);
                doc.text(`Pagina: ${numPag}`, (width / 2) - 20, y + 5);
                doc.text(`Peleas de Exhibición`, x, y + 10);
                doc.text(`Genero: ${cmpe.genero == 'M' ? 'MASCULINO' : 'FEMENINO'}`, x, y + 15)
                doc.setFontSize(17)
                doc.text(`Area: ${cmpe.area!=null?cmpe.area:''}`, x+140, y + 15)
                doc.setFontSize(9);
                y = y + 25
                for (var cmp of lsPele) {
                    doc.setTextColor(0, 0, 255);
                    if (cmp.clubdos != null) {
                        doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x, y + 5)
                        doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x, y + 10)
                        doc.text(`${cmp.edaduno!==null? 'Edad: '+cmp.edaduno+' Peso:' +cmp.pesouno:''}`, x, y + 15)
                    }
                    doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                    doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                    doc.setTextColor(255, 0, 0);
                    if (cmp.clubuno == null) {
                        doc.setTextColor(0, 0, 255);
                        doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x + 85, y + 5)
                        doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x + 85, y + 10)
                        doc.text(`${cmp.edaddos!==null? 'Edad: '+cmp.edaddos+' Peso:' +cmp.pesodos:''}`, x+85, y + 15)
                    }
                    y = y + 20
                    if (cmp.clubdos == null) {
                        doc.setTextColor(255, 0, 0);
                        doc.text(`${cmp.nombres} (${cmp.clubuno !== null ? cmp.clubuno : '-'})`, x + 85, y + 5)
                        doc.text(`${cmp.apellidos !== null ? cmp.apellidos + ' Grado:' + cmp.cinturonuno : ''}`, x + 85, y + 10)
                        doc.text(`${cmp.edaduno!==null? 'Edad: '+cmp.edaduno+' Peso:' +cmp.pesouno:''}`, x+85, y + 15)
                    }
                    if (cmp.clubuno != null) {
                        doc.setTextColor(255, 0, 0);
                        doc.text(`${cmp.nombres2} (${cmp.clubdos !== null ? cmp.clubdos : '-'})`, x, y + 5)
                        doc.text(`${cmp.apellidos2 !== null ? cmp.apellidos2 + ' Grado:' + cmp.cinturondos : ''}`, x, y + 10)
                        doc.text(`${cmp.edaddos!==null? 'Edad: '+cmp.edaddos+' Peso:' +cmp.pesodos:''}`, x, y + 15)
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
                doc.text(`Area: ${cmpe.area!=null?cmpe.area:''}`, x+140, y + 15)
                doc.setFontSize(9);
                y = y + 25
                doc.setTextColor(0, 0, 255);
                doc.text(`${comp.nombres} (${comp.clubuno !== null ? comp.clubuno : '-'})`, x, y + 5)
                doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                doc.text(`${comp.apellidos !== null ? comp.apellidos + ' Grado:' + comp.cinturonuno : ''}`, x, y + 10)
                doc.text(`${cmp.edaduno!==null? 'Edad: '+cmp.edaduno+' Peso:' +cmp.pesouno:''}`, x, y + 15)
                doc.line(x + 75, y + 7, x + 75, y + 27, 'S');
                y = y + 20;
                doc.setTextColor(255, 0, 0);
                doc.line(x + 75, y - 2, x + 105, y - 2, 'S');
                doc.text(`${comp.nombres2} (${comp.clubdos !== null ? comp.clubdos : '-'})`, x, y + 5)
                doc.line(x + 35, y + 7, x + 75, y + 7, 'S');
                doc.text(`${comp.apellidos2 !== null ? comp.apellidos2 + ' Grado:' + comp.cinturondos : ''}`, x, y + 10)
                doc.text(`${cmp.edaddos!==null? 'Edad: '+cmp.edaddos+' Peso:' +cmp.pesodos:''}`, x, y + 15)
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
    var fecha = new Date();
    doc.save(`llavesGeneradas${fecha.toISOString().substring(0,10)}.pdf`);
}

export default { exportarLlaves }