import React, { useEffect, useState } from 'react'
import Header from '../Header';
import MsgUtils from '../utils/MsgUtils';
import UtilsCargador from '../utils/UtilsCargador';
const server = process.env.REACT_APP_SERVER;
function AdminUsuario() {
    const [cargador,setCargador]=useState(false);
    const [usuarios,setUsuarios] = useState([]);
    useEffect(() => {
        setCargador(true);
        fetch(`${server}/usuario/getUsuarios`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    console.log(data.ok);
                    setUsuarios(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
                setCargador(false);
            })
            .catch(error => MsgUtils.msgError(error));
    }, [])
    return (
        <div>
            <Header/>
            <UtilsCargador show={cargador}/>
            administrarUsuariosDEL SISTEMA
        </div>
    )
}

export default AdminUsuario
