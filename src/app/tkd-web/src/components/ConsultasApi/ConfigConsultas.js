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
async function getConfigArea(params){//'idConf':id
    var config = await fetch(`${server}/config/getConfiAreas`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({...params})
    })
    return config.json()
}

export default {getCategoriasUnidos,getConfigArea}
