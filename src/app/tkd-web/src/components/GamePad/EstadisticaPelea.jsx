import React, { useEffect, useState } from 'react'

function EstadisticaPelea(props) {
    const { lista } = props;
    const [resultados, setResultados] = useState(null);
    function functionContarPunto(lista) {
        let conteo = {}
        let rep_max = 0;
        let elem_max;
        lista.map(element => {
            if (conteo[element]) {
                conteo[element] += 1;
            } else {
                conteo[element] = 1;
            }
            if (rep_max < conteo[element]) {
                rep_max = conteo[element];
                elem_max = element
            }
        });
        return [rep_max, elem_max]
    }
    useEffect(() => {
        var valores = {
            'd': { 'cant': 0, 'simbolo': '🤕', 'color': 'bg-primary' }, 'D': { 'cant': 0, 'simbolo': '🤯', 'color': 'bg-primary' }, 'P': { 'cant': 0, 'simbolo': '✊', 'color': 'bg-primary' },
            'c': { 'cant': 0, 'simbolo': '🚶', 'color': 'bg-primary' }, 'C': { 'cant': 0, 'simbolo': '🤸', 'color': 'bg-primary' },
            'b': { 'cant': 0, 'simbolo': '🤕', 'color': 'bg-danger' }, 'B': { 'cant': 0, 'simbolo': '🤯', 'color': 'bg-danger' }, 'E': { 'cant': 0, 'simbolo': '✊', 'color': 'bg-danger' },
            'a': { 'cant': 0, 'simbolo': '🚶', 'color': 'bg-danger' }, 'A': { 'cant': 0, 'simbolo': '🤸', 'color': 'bg-danger' }
        }
        for (var val of lista) {
            if(val.length!=0){
            var calcullo = functionContarPunto(val);
            if (calcullo[1].dato != '') {
                valores[calcullo[1].dato].cant = valores[calcullo[1].dato].cant + 1;
            }
            }
        }
        console.log(valores)
        setResultados(Object.values(valores));
    }, [lista])
    return (
        <div className='container-fluid bg-transparent'>
            {resultados != null && resultados.map((item, index) => {
                return (
                    <div className={`${item.color} w-100 fs-5`}>{`${item.simbolo} puntuados en total -> ${item.cant}`}</div>
                )
            })}
        </div>
    )
}

export default EstadisticaPelea