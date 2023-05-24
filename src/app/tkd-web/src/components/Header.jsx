import React, { useState, useContext } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';
import ImgHeader from '../assets/tkd.png'
import ImgUser from '../assets/user.png'
import MenuHerramientas from './MenuHerramientas';
import { ContextAplicacions } from './Context/ContextAplicacion';

function Header(props) {
    const { puntuacion } = props;
    const navigate = useNavigate();
    const { login, setLogin, setUserLogin, titulo, setTitulo, setMenuActivo } = useContext(ContextAplicacions);
    const [showMenu, setShowMenu] = useState(false);
    const salirSistema = () => {
        localStorage.clear();
        setShowMenu(false);
        setLogin(false);
        setUserLogin({});
        setTitulo('');
        setMenuActivo(0);
        navigate("/", { replace: true });
    }
    const inicioSistema = () => {
        setMenuActivo(0);
        navigate("/inicio", { replace: true });
    }
    return (
        <div>
            {puntuacion == undefined && <nav className="navbar navbar-dark bg-dark bg-gradient m-0 p-0">
                <div className="container-fluid">
                    <div className="navbar-brand card flex-row bg-transparent m-0 p-0" >
                        <img src={ImgHeader} alt="" width="38" height="38" className="d-inline-block align-text-top fa-flip my-auto" />
                        <div className='ps-2 my-auto d-none d-sm-inline'>
                            <div className="tituloHeader">SISTEMA TKD</div>
                            <div className='tituloHeader'>CBBA</div>
                        </div>
                    </div>
                    {titulo !== '' && <div className='text-light fw-bold fs-6 text-uppercase fa-bounce'>{titulo}</div>}
                    {login &&
                        <div className="navbar-brand card flex-row bg-transparent m-0 p-0 " >
                            <img src={ImgUser} width="38" height="38" className=" my-auto rounded-circle card-img-left" />
                            <div className='ps-2 my-auto d-none d-sm-inline'>
                                <div className="userHeader">{JSON.parse(localStorage.getItem('login')).nombres}</div>
                                <div className='userHeader'>{JSON.parse(localStorage.getItem('login')).apellido}</div>
                            </div>
                            <button className='btn btn-sm btn-transparent text-light' onClick={() => setShowMenu(true)}>
                                <i className="fa-solid fa-bars fa-xl"></i>
                            </button>
                        </div>}
                </div>
            </nav>}
            {puntuacion &&
                <div className='btn-flotante' style={{}}>
                        <button className='btn btn-sm btn-transparent text-light' onClick={() => setShowMenu(true)}>
                            <i className="fa-solid fa-bars fa-xl"></i>
                        </button>
                </div>
            }
            <Offcanvas show={showMenu} onHide={setShowMenu} placement='end' backdrop={true} bsPrefix=' offcanvas offcanvas-end bg-dark'>
                <Offcanvas.Header closeButton closeVariant='white'>
                    <Offcanvas.Title bsPrefix='text-light fw-bold offcanvas-title tituloMenu fa-bounce '>
                        <a className='btn btn-sm btn-dark' onClick={() => inicioSistema()}><i className="fa-solid fa-house"></i> MENU </a>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <MenuHerramientas setShowMenu={setShowMenu} />
                </Offcanvas.Body>
                <div className='container-fluid text-center pb-2'>
                    <button className='btn btn-sm btn-danger bg-gradient fw-bold tituloMenu' onClick={salirSistema}>
                        <i className="fa-solid fa-right-from-bracket fa-xl fa-fade"></i> SALIR SISTEMA
                    </button>
                </div>
            </Offcanvas>
        </div>
    )
}

export default Header
