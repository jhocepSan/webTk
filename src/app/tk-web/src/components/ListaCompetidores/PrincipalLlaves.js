import React, { useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
const server = process.env.REACT_APP_SERVER;

function PrincipalLlaves(props) {
    const { idcampeonato, genero, llaves } = props;
    const [categorias, setCategorias] = useState([]);
    const [selectItem, setSelectItem] = useState(0);
    const [lista, setLista] = useState([]);
    function verLlavesCategoria(dato) {
        setSelectItem(dato);
        setLista(llaves.filter((item) => item.idcategoria === dato));
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
            <div className='btn-group btn-group-sm'>
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
                <div className='py-1'>
                    <div className='row row-cols-3 g-0'>
                        <div className='col-5 text-start my-auto'>
                            <button className='btn btn-sm text-light'><i className="fa-solid fa-square-caret-left fa-2xl"></i></button>
                        </div>
                        <div className='col-2 text-center my-auto bg-light'>
                            <div className='text-dark letraMontserratr'>{1 + '/' + lista.length}</div>
                        </div>
                        <div className='col-5 text-end my-auto'>
                            <button className='btn btn-sm text-light'><i className="fa-solid fa-square-caret-right fa-2xl"></i></button>
                        </div>
                    </div>
                </div>}
        </div>
    )
}

export default PrincipalLlaves
