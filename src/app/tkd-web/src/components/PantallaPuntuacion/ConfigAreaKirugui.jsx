import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header'
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { useNavigate, Link } from 'react-router-dom';
import MsgUtils from '../utils/MsgUtils';
import PrincipalKirugui from './PrincipalKirugui';
function ConfigAreaKirugui() {
    const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo } = useContext(ContextAplicacions);
    const navigate = useNavigate();
    const [pagina, setPagina] = useState(0);
    const [areas, setAreas] = useState([]);
    const [idArea,setIdArea] = useState(0);
    function elegirArea(){
        if(idArea!=0){
            setPagina(1);
        }else{
            MsgUtils.msgError("Elija el area Por favor")
        }
    }
    useEffect(() => {
        var sessionActiva = JSON.parse(localStorage.getItem('login'));
        var cmp = JSON.parse(localStorage.getItem('campeonato'));
        var conf = JSON.parse(localStorage.getItem('kirugui'));
        if (sessionActiva !== null) {
            setTitulo('PUNTUACION COMBATE');
            setCampeonato(cmp);
            setLogin(true);
            setUserLogin(sessionActiva);
            navigate("/nuevaPantallaK", { replace: true });
            //getClubes(cmp);
        }
        if (conf !== null) {
            var listaAr = []
            for (var i = 0; i < parseInt(conf.cantAreas); i++) {
                listaAr.push({ 'id': i + 1, 'nombre': 'Area ' + (i + 1) })
            }
            setAreas(listaAr)
        } else {
            MsgUtils.msgError("Configuracion no Existente ....")
        }
    }, [])

    return (
        <>
            <Header />
            {pagina == 0 &&
                <div className='container text-center py-4'>
                    <div className='card mx-auto bg-dark' style={{ minWidth: '300px', maxWidth: '300px' }}>
                        <div className='card-header text-light'>
                            Configuración Area
                        </div>
                        <div className='card-body'>
                            <select className="form-select form-select-sm" value={idArea} onChange={(e) => setIdArea(e.target.value)}>
                                <option value={0}>Area ?</option>
                                {areas.map((item, index) => {
                                    return (
                                        <option value={item.id} key={index}>{item.nombre}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className='card-fotter mb-2'>
                            <button className='btn btn-sm btn-success' onClick={()=>elegirArea()}>
                                <i className="fa-solid fa-thumbs-up"></i> Aceptar
                            </button>
                        </div>
                    </div>
                </div>}
            {pagina==1&&<PrincipalKirugui area={idArea} setPagina={setPagina}/>}
        </>
    )
}

export default ConfigAreaKirugui
