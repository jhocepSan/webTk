import React, { useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import UtilsDate from '../utils/UtilsDate';
import ImgUser from '../../assets/user.png'
const server = process.env.REACT_APP_SERVER;

function PrincipalLlaves(props) {
    const { idcampeonato, genero, llaves } = props;
    const [categorias, setCategorias] = useState([]);
    const [selectItem, setSelectItem] = useState(0);
    const [lista, setLista] = useState([]);
    const [numLlave, setNumLlave] = useState(0);
    function verLlavesCategoria(dato) {
        setSelectItem(dato);
        setLista(llaves.filter((item) => item.idcategoria === dato));
        setNumLlave(0);
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
    useEffect(() => {
        fetch(`${server}/config/getConfiCategoria`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ idcampeonato, genero })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setCategorias(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }, [])
    return (
        <div className='container-fluid py-2'>
            <div className='btn-group btn-group-sm mb-2'>
                {categorias.map((item, index) => {
                    return (
                        <button className={`btn btn-sm letraBtn ${selectItem === item.idcategoria ? 'botonLlave' : 'btn-light'}`} onClick={() => verLlavesCategoria(item.idcategoria)}
                            key={index} style={{ marginRight: '2px' }}>
                            {item.nombre}
                        </button>
                    )
                })}
                <button className={`btn btn-sm letraBtn ${selectItem === -1 ? 'botonLlave' : 'btn-light'}`} onClick={() => verLlavesCategoria(-1)}
                    style={{ marginRight: '2px' }}>
                    MANUALES
                </button>
            </div>
            {lista.length !== 0 &&
                <div className='card bg-light bg-gradient'>
                    <div className='card-header'>
                        <div className='row row-cols-2 g-0'>
                            <div className='col'>
                                <div className='tituloHeader'>
                                    {lista[numLlave].nombregrado}
                                </div>
                                <div className='tituloHeader'>
                                    {lista[numLlave].nombrecategoria + ' => ' + lista[numLlave].edadini + ' - ' + lista[numLlave].edadfin + ' Años'}
                                </div>
                            </div>
                            <div className='col'>
                                <div className='tituloHeader'>
                                    {UtilsDate.getDateFormato(lista[numLlave].fecha)}
                                </div>
                                <div className='tituloHeader'>
                                    {lista[numLlave].nombresubcategoria + ' => ' + lista[numLlave].pesoini + ' - ' + lista[numLlave].pesofin + ' Kg'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className='table table-responsibe'>
                            <table className="table">
                                <tbody>
                                    {lista[numLlave].PELEAS.map((item,index)=>{
                                        return(
                                            <tr key={index} >
                                                <th className='col-4'>
                                                    <div className='container-fluid'>
                                                        <div className="navbar-brand card flex-row bg-primary bg-gradient m-0 p-0 " >
                                                            <img src={ImgUser} width="38" height="38" className=" my-auto rounded-circle card-img-left" />
                                                            <div className='ps-2 my-auto d-none d-sm-inline'>
                                                                <div className="userHeader text-light">{item.nombres}</div>
                                                                <div className='userHeader text-light'>{item.apellidos}</div>
                                                                <div className='userHeader text-light'>{item.clubuno}</div>
                                                            </div>
                                                        </div>
                                                        <div className='row row-cols-2 g-0'>
                                                            <div className='col-2 my-auto'>
                                                                <button className='btn btn-sm btn-dark'>
                                                                    {item.nropelea}
                                                                </button>
                                                            </div>
                                                            <div className='col-10 my-auto'>
                                                                <hr style={{border:"15px",background:"#f6f6f"}}></hr>
                                                            </div>
                                                        </div>
                                                        <div className="navbar-brand card flex-row bg-danger bg-gradient m-0 p-0 " >
                                                            <img src={ImgUser} width="38" height="38" className=" my-auto rounded-circle card-img-left" />
                                                            <div className='ps-2 my-auto d-none d-sm-inline'>
                                                                <div className="userHeader text-light">{item.nombres2}</div>
                                                                <div className='userHeader text-light'>{item.apellidos2}</div>
                                                                <div className='userHeader text-light'>{item.clubdos}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </th>
                                                <td>Mark</td>
                                                <td>Otto</td>
                                                <td>@mdo</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>}
            {lista.length !== 0 &&
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
                </div>}
        </div>
    )
}

export default PrincipalLlaves
