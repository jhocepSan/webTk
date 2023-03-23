import React, { useRef } from 'react'
import jsPDF from 'jspdf';

function CompetidoresPdf(props) {
    const pdfRef = useRef(null);
    const { categorias, listaCompetidores, campeonato } = props;
    const exportPDF = () => {
        const content = pdfRef.current;
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const doc = new jsPDF(orientation, unit, size);
        doc.html(content, {
            callback: function (doc) {
                doc.save('listaCampeonato'+campeonato+'.pdf');
            },
            html2canvas: { scale: 0.54 },
            windowWidth: 700 
        });
    }
    function getTipoLista(){
        var subtitulo='';
        if(listaCompetidores.length!==0){
            var info = listaCompetidores[0];
            if(info.tipo=='C'){
                subtitulo='COMBATE'
            }else if(info.tipo=='P'){
                subtitulo='POOMSE'
            }else if(info.tipo=='D'){
                subtitulo='DEMOSTRACIONES'
            }else if(info.tipo=='R'){
                subtitulo='ROMPIMIENTO'
            }
            subtitulo += info.genero=='M'?' genero MASCULINO':'genero FEMENINO';
            return 'tipo '+subtitulo;
        }else{
            return ''
        }
    }
    return (
        <>
        <button className='btn btn-sm btn-success' onClick={()=>exportPDF()}>Descargar PDF</button>
        <div className='container py-2 bg-light' ref={pdfRef}>
            <div className='text-center tituloPdf'>Lista Del Campeonato {campeonato}</div>
            <div className='text-center tituloPdf'>{getTipoLista()}</div>
            {categorias.map((item, index) => {
                return (
                    <div className='container-fluid' key={index}>
                        {item.SUBCATEGORIA.map((subcat, idx) => {
                            var listaFiltrada=listaCompetidores.filter((dato)=>dato.idcategoria==item.idcategoria&&dato.idsubcategoria==subcat.idsubcategoria)
                            return (
                                <div key={idx}>
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
                                                {listaFiltrada.map((competidor,cmp) => {
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
                        })}
                    </div>
                )
            })}
        </div>
        </>
    )
}

export default CompetidoresPdf
