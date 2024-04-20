import axios from 'axios';
import { server } from '../utils/MsgUtils';
const consultasMandos = axios.create({
    baseURL: server
})
export const getMandosPuntuados = async (cuerpo) => {
    var resul = await consultasMandos.post('/mandojuec/getPuntosMando', cuerpo)
    return resul.data
}
export const setPuntuacionPoomse = async (cuerpo) => {
    var resul = await consultasMandos.post('/mandojuec/setPuntuacionPoomse', cuerpo)
    return resul.data
}
export const getPuntosPoomse = async (cuerpo) => {
    var resul = await consultasMandos.post('/mandojuec/getPuntosPoomse', cuerpo)
    return resul.data
}
export const limpiarMandos = async(sector)=>{
    await consultasMandos.get(`${server}/mandojuec/limpiarLecturas/${sector}`)
}
export const limpiarLecturasPoomse = async(cuerpo)=>{
    await consultasMandos.post(`/mandojuec/limpiarLecturasPoomse`,cuerpo)
}
export const getPuntosMando = async (sector) => {
    const response = await fetch(`${server}/mandojuec/getPuntosMando/${sector}`);
    if (!response.ok) {
        throw new Error('Error al obtener los datos del usuario');
    }
    return response.json();
}
export const getListaClubs = async ()=>{
    const respuesta = await fetch(`${server}/club/getListaClub`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        }
    });
    return respuesta.json();
}