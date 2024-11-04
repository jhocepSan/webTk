import { server } from '../utils/MsgUtils';

async function obtenerLlaves(params) {//idcampeonato,genero,tipo
    var llaves = await fetch(`${server}/competidor/obtenerLlaves`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({...params})
    })
    return llaves.json()
}

async function cambiarNumeroPelea(params){//nropelea,idpelea
    var numPelea = await fetch(`${server}/competidor/cambiarNumPelea`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(params)
    })
    return numPelea.json()
}

async function cambiarAreaLlave(params){
    var cambLlave = await fetch(`${server}/competidor/cambiarAreaLlave`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(params)
    })
    return cambLlave.json()
}
async function eliminarLlaves(params) {
    var result = await fetch(`${server}/competidor/eliminarLlavesGeneradas`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({...params})
    })
    return result.json()
}
async function eliminarLlaveManual(params){
    console.log(params)
    var result = await fetch(`${server}/competidor/eliminarLlaveManual`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({...params})
    })
    return result.json()
}
async function addSeguimientoPelea(params){
    var result = await fetch(`${server}/competidor/addSeguimientoPelea`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({...params})
    })
    return result.json()
}
export default {obtenerLlaves,cambiarNumeroPelea,
    cambiarAreaLlave,eliminarLlaves,
    eliminarLlaveManual,addSeguimientoPelea}