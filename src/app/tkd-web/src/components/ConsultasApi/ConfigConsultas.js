import { server } from '../utils/MsgUtils';

async function getCategoriasUnidos(params) {//idcampeonato
    var categorias=await fetch(`${server}/config/getConfiCategoriaUnido`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(params)
    })
    return categorias.json();
}

export default {getCategoriasUnidos}
