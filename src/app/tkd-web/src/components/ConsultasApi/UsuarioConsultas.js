import { server } from '../utils/MsgUtils';

async function getAlbitros(params) {//idcampeonato,genero,tipo
    var llaves = await fetch(`${server}/usuario/getAlbitros`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({...params})
    })
    return llaves.json()
}

async function recuperarContrasenia(params) {
    var llaves = await fetch(`${server}/usuario/recuperarContrasenia`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({...params})
    })
    return llaves.json()
}
export default {getAlbitros,recuperarContrasenia}