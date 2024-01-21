import React, { useContext, useEffect, useState } from 'react'
import { ContextPuntuacion } from './PrincipalPuntuacion';

function RelojPausa() {
    const { runPelea, setRunPelea, configJuego,pausa,resetJuego } = useContext(ContextPuntuacion)
    const [segundo, setSegundo] = useState(configJuego.timeDescanso/60);
    const [minuto, setMinuto] = useState(null);
    const [tiempo, setTiempo] = useState('00:00');
    const [compensar, setCompensar] = useState(false);
    const [iniciado,setIniciado] = useState(false);
    setTimeout(() => {
        if (pausa) {
            if (minuto == null && iniciado ===false) {
                setMinuto((configJuego.timeDescanso+1)/60);
                setIniciado(true);
                setSegundo(0+1);
            }else{
                setSegundo(segundo + 1);
            }
        }
    }, 1000);
    function compensarFallo() {
        if (segundo !== 0) {
            setCompensar(true);
            setSegundo(segundo - 1);
        }
    }
    useEffect(() => {
        if (pausa) {
            setCompensar(false);
            var sec = (minuto * 60) - segundo;
            var aux = Math.round(((sec / 60) - Math.trunc(sec / 60)) * 60);
            aux = aux < 10 ? '0' + aux : aux;
            var seco = Math.trunc(sec / 60) == 0 ? '00' : Math.trunc(sec / 60)
            var conversion = seco + ':' + aux
            if (seco=='00'&& aux=='00'&&minuto!==null) {
                setSegundo(segundo-10);
            }
            setTiempo(conversion);
        }else{
            setIniciado(false);
            setMinuto(null);

        }
    }, [segundo]);
    useEffect(()=>{
        if(minuto!==null){
            setMinuto(null);
            setSegundo(0);
            setTiempo('00:00');
        }
    },[resetJuego])
    return (
        <div className='reloj-digital text-center fa-fade relojPausa'>
            {tiempo}
        </div>
    )
}

export default RelojPausa
