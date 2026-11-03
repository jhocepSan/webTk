import React, { useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import { server } from '../utils/MsgUtils';
import MsgDialogo from '../utils/MsgDialogo';

function CardCinturon(props) {
    const { info, eliminarGrado, tipou } = props;
    const [cinturones, setCinturones] = useState([]);
    const [nombre, setNombre] = useState('');
    const [selectItem, setSelectItem] = useState({});
    const [showMessage, setShowMessage] = useState(false);
    const [tipoG, setTipoG] = useState('');

    const agregarCinturon = () => {
        if (nombre !== '') {
            var cnt = cinturones.filter((item) => item.nombre === nombre);
            if (cnt.length === 0) {
                fetch(`${server}/config/addCinturon`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                        info: {
                            nombre, idgrado: info.idgrado,
                        }
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.ok) {
                            if (data.ok.affectedRows === 1) {
                                setCinturones([...cinturones, { idcinturon: data.ok.insertId, nombre }]);
                                setNombre('');
                            } else {
                                MsgUtils.msgError("Intente Nuevamente");
                            }
                        } else {
                            MsgUtils.msgError(data.error);
                        }
                    })
                    .catch(error => MsgUtils.msgError(error));
            } else {
                MsgUtils.msgError("Ya se tiene el mismo nombre")
            }
        } else {
            MsgUtils.msgError("Ponga el nombre del cinturon")
        }
    }

    const eliminarCinturon = (dato) => {
        fetch(`${server}/config/deleteCinturon`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                info: dato
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    if (data.ok.affectedRows === 1) {
                        setCinturones(cinturones.filter((item) => item.idcinturon !== dato.idcinturon));
                    } else {
                        MsgUtils.msgError("Intente Nuevamente");
                    }
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }

    useEffect(() => {
        setCinturones(info.cinturon || []);
    }, [info])

    return (
        /* Cambiamos altura fija por flexbox dinámico y min-height para control en móviles */
        <div className="card h-100 border border-secondary border-opacity-25 bg-dark bg-gradient d-flex flex-column" 
             style={{ minHeight: '380px', '--bs-bg-opacity': '0.95' }}>
            
            {/* Cabecera estilizada con padding adecuado */}
            <div className='card-header py-3 text-center text-light fw-bold border-bottom border-secondary border-opacity-25 tracking-wide fs-5'>
                {info.nombre}
            </div>

            {/* Cuerpo flexible que empuja al footer hacia abajo de forma natural */}
            <div className="card-body p-3 text-light d-flex flex-column flex-grow-1 overflow-hidden">
                
                {/* Input adaptativo: en móviles muy chicos se apilará si es necesario gracias a flex-wrap */}
                {tipou === 'A' && (
                    <div className="input-group input-group-sm mb-3 flex-nowrap shadow-sm">
                        <span className="input-group-text bg-secondary bg-opacity-25 border-secondary border-opacity-25 text-light text-opacity-70 small px-2">
                            CINTURÓN
                        </span>
                        <input 
                            type="text" 
                            className="form-control bg-dark text-light border-secondary border-opacity-25" 
                            value={nombre}
                            placeholder="Ej. Negro 1er Dan" 
                            onChange={(e) => setNombre(e.target.value.toUpperCase())} 
                        />
                        <button className='btn btn-success bg-gradient px-3' onClick={() => agregarCinturon()}>
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                )}

                {/* Contenedor de la lista con scroll interno fluido si hay muchos elementos */}
                <div className='flex-grow-1 overflow-auto pe-1' style={{ maxHeight: '200px' }}>
                    <table className="table table-dark table-hover table-sm align-middle mb-0" style={{ '--bs-table-bg': 'transparent' }}>
                        <tbody>
                            {cinturones.map((item, index) => (
                                <tr key={item.idcinturon ?? index} className="border-bottom border-secondary border-opacity-10">
                                    <td className='py-2 fw-medium text-light text-opacity-90'>{item.nombre}</td>
                                    {tipou === 'A' && (
                                        <td className='text-end py-1'>
                                            <button 
                                                className='btn btn-link text-danger text-opacity-70 text-opacity-100-hover p-1 m-0' 
                                                onClick={() => { setShowMessage(true); setTipoG('C'); setSelectItem(item) }}
                                                title="Eliminar cinturón"
                                            >
                                                <i className="fa-solid fa-trash-can fs-6"></i>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {cinturones.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="text-center text-muted small py-4">
                                        Sin cinturones registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer pegado abajo sutilmente */}
            {tipou === 'A' && (
                <div className='card-footer p-2 bg-transparent border-top border-secondary border-opacity-25'>
                    <button className='btn btn-sm w-100 btn-outline-danger border-0 py-2' onClick={() => { setShowMessage(true); setTipoG('G'); setSelectItem(info) }}>
                        <i className="fa-solid fa-trash-can me-1"></i> Eliminar Grado
                    </button>
                </div>
            )}

            <MsgDialogo 
                show={showMessage} 
                msg={tipoG === 'G' ? '¿Está seguro de eliminar este Grado completo?' : '¿Está seguro de eliminar este Cinturón?'} 
                okFunction={() => { setShowMessage(false); tipoG === 'G' ? eliminarGrado(selectItem) : eliminarCinturon(selectItem) }} 
                notFunction={() => setShowMessage(false)}
            />
        </div>
    )
}

export default CardCinturon
