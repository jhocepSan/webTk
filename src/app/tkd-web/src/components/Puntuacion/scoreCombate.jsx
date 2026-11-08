import React, { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti';
import VisorPunto from '../GamePad/VisorPunto';
import VisorFaltas from '../GamePad/VisorFaltas';

// Estado que se muestra cuando todavia no hay nada guardado
const PUNTAJE_INICIAL = {
  isPlay: false, round: 1,
  puntoA: 0, faltaA: 0, puntoR: 0, faltaR: 0,
  nombreA: '', nombreR: '', gano: ''
};

// Codigos que usa la pantalla principal en 'doblePant.gano'
const GANADORES_AZUL = ['A', 'AP', 'AR'];
const GANADORES_ROJO = ['R', 'RP', 'RR'];
const EMPATES = ['EM', 'EP', 'ER'];

function leerJSON(clave, porDefecto) {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : porDefecto;
  } catch (error) {
    return porDefecto;
  }
}

function formatearTiempo(segundosTotales) {
  const total = Math.max(0, segundosTotales || 0);
  const minutos = Math.floor(total / 60);
  const segundos = total % 60;
  return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

// Serpentinas para celebrar al ganador en la pantalla del publico (canvas-confetti)
function lanzarSerpentinas() {
  const zIndex = 2000; // por encima del panel del ganador
  const fin = Date.now() + 5000;
  confetti({ particleCount: 90, spread: 100, origin: { y: 0.4 }, zIndex });
  const intervalo = setInterval(() => {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, zIndex });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, zIndex });
    if (Date.now() >= fin) clearInterval(intervalo);
  }, 250);
}

function scoreCombate() {
  const [puntoJuego, setPuntoJuego] = useState(() => ({ ...PUNTAJE_INICIAL, ...leerJSON('doblePant', {}) }));
  const [configure, setConfigure] = useState(() => leerJSON('kirugui', {}));
  const [segundo, setSegundo] = useState(() => parseInt(localStorage.getItem('segundo')) || 0);
  const [inicioPausa, setInicioPausa] = useState(() => Date.now());
  const [ahora, setAhora] = useState(() => Date.now());

  // Ultimo valor leido de cada clave: solo se actualiza el estado cuando cambia
  const cache = useRef({
    doblePant: localStorage.getItem('doblePant'),
    segundo: localStorage.getItem('segundo'),
    kirugui: localStorage.getItem('kirugui')
  });

  // Lee el estado compartido de la pantalla principal (misma origen / localStorage)
  const sincronizar = useCallback(() => {
    const doblePant = localStorage.getItem('doblePant');
    if (doblePant !== cache.current.doblePant) {
      cache.current.doblePant = doblePant;
      setPuntoJuego({ ...PUNTAJE_INICIAL, ...leerJSON('doblePant', {}) });
    }

    const segundoGuardado = localStorage.getItem('segundo');
    if (segundoGuardado !== cache.current.segundo) {
      cache.current.segundo = segundoGuardado;
      setSegundo(parseInt(segundoGuardado) || 0);
    }

    const kirugui = localStorage.getItem('kirugui');
    if (kirugui !== cache.current.kirugui) {
      cache.current.kirugui = kirugui;
      setConfigure(leerJSON('kirugui', {}));
    }
  }, []);

  useEffect(() => {
    // El evento 'storage' llega al instante desde la otra ventana; el intervalo
    // es solo un respaldo por si el navegador no lo dispara.
    const alCambiarAlmacen = (evento) => {
      if (evento.key === null || ['doblePant', 'segundo', 'kirugui'].includes(evento.key)) {
        sincronizar();
      }
    };
    window.addEventListener('storage', alCambiarAlmacen);
    const intervalo = setInterval(sincronizar, 400);
    return () => {
      window.removeEventListener('storage', alCambiarAlmacen);
      clearInterval(intervalo);
    };
  }, [sincronizar]);

  // El reloj del descanso se cuenta desde el momento en que se pausa el combate
  useEffect(() => {
    if (!puntoJuego.isPlay) setInicioPausa(Date.now());
  }, [puntoJuego.isPlay, puntoJuego.gano, puntoJuego.round]);

  useEffect(() => {
    if (puntoJuego.isPlay) return;
    const intervalo = setInterval(() => setAhora(Date.now()), 500);
    return () => clearInterval(intervalo);
  }, [puntoJuego.isPlay]);

  const tiempoRound = parseInt(configure.timeRound) || 60;
  const tiempoDescanso = parseInt(configure.timeDescanso) || 30;
  const restanteRound = Math.max(0, tiempoRound - (segundo || 0));
  const restanteDescanso = Math.max(0, tiempoDescanso - Math.floor((ahora - inicioPausa) / 1000));

  const ganoAzul = GANADORES_AZUL.includes(puntoJuego.gano);
  const ganoRojo = GANADORES_ROJO.includes(puntoJuego.gano);
  const hayGanador = ganoAzul || ganoRojo;
  const empate = EMPATES.includes(puntoJuego.gano);
  const nombreA = puntoJuego.nombreA || 'TKD AZUL';
  const nombreR = puntoJuego.nombreR || 'TKD ROJO';
  const nombreGanador = ganoAzul ? nombreA : nombreR;
  const colorGanador = ganoAzul ? 'bg-primary' : ganoRojo ? 'bg-danger' : 'bg-dark';
  const totalRound = parseInt(configure.numRound) || 0;
  // Resultado final (victoria por rounds o por puntos): lo publica la pantalla principal
  const resultadoFinal = puntoJuego.final || null;
  const etiquetaFinal = resultadoFinal?.tipo === 'rounds' ? 'ROUNDS GANADOS'
    : resultadoFinal?.tipo === 'puntos' ? 'PUNTOS TOTALES'
      : 'MARCADOR FINAL';
  // La pantalla principal no siempre marca isPlay en false al cerrar el combate,
  // por eso el ganador tambien abre el panel
  const mostrarPanel = !puntoJuego.isPlay || hayGanador || empate;

  // Serpentinas cuando aparece un ganador (fin de round o resultado final)
  const claveFestejo = resultadoFinal ? `final-${resultadoFinal.gano}`
    : hayGanador ? `round-${puntoJuego.round}-${puntoJuego.gano}`
      : '';
  const festejado = useRef('');
  useEffect(() => {
    if (!claveFestejo) {
      festejado.current = '';
      return;
    }
    if (festejado.current === claveFestejo) return;
    festejado.current = claveFestejo;
    lanzarSerpentinas();
  }, [claveFestejo]);

  return (
    <>
      <div className='text-center mx-auto py-2' style={{ width: '100%' }}>
        <div className='text-light tituloMenu bg-success bg-gradient mx-auto' style={{ fontSize: 'clamp(20px, 3.4vw, 60px)', borderRadius: '20px' }}>
          ROUND {puntoJuego.round}{configure.enableMaxRound && totalRound > 0 ? ` de ${totalRound}` : ''}
        </div>
        <div className='reloj-digital text-center text-light fw-bold lh-1 mx-auto mt-2'
          style={{ borderRadius: '15px', fontSize: 'clamp(34px, 7vw, 140px)' }}>
          {formatearTiempo(restanteRound)}
        </div>
      </div>
      <div className='container-fluid'>
        <div className='row row-cols-2 gx-0'>
          <div className='col bg-danger bg-gradient col-6'>
            <div className='w-100 p-2'>
              <h1 className='text-start tituloMenu text-light' style={{ fontSize: 'clamp(16px, 2.2vw, 44px)' }}>
                {nombreR}
              </h1>
            </div>
            <VisorPunto valor={puntoJuego} tipo='R' />
            <VisorFaltas valor={puntoJuego} tipo='R' resultPre={puntoJuego.faltaR || 0} maxFaltas={parseInt(configure.maxFaltas) || 0} />
          </div>
          <div className='col bg-primary bg-gradient col-6'>
            <div className='w-100 p-2'>
              <h1 className='text-end tituloMenu text-light' style={{ fontSize: 'clamp(16px, 2.2vw, 44px)' }}>
                {nombreA}
              </h1>
            </div>
            <VisorPunto valor={puntoJuego} tipo='A' />
            <VisorFaltas valor={puntoJuego} tipo='A' resultPre={puntoJuego.faltaA || 0} maxFaltas={parseInt(configure.maxFaltas) || 0} />
          </div>
        </div>
      </div>
      {puntoJuego.area != undefined &&
        <div className='text-center mx-auto py-2'>
          <div className='text-light tituloMenu bg-success bg-gradient mx-auto' style={{ fontSize: 'clamp(20px, 3.4vw, 60px)', borderRadius: '20px' }}>
            Area {puntoJuego.area}
          </div>
        </div>}
      {mostrarPanel &&
        <div className={`position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center text-light tituloMenu fw-bold ${colorGanador} bg-gradient`}
          style={{ zIndex: 1080 }}>
          {resultadoFinal &&
            <div className='lh-1'>
              <div style={{ fontSize: 'clamp(20px, 3.5vw, 70px)' }}>
                {empate ? 'RESULTADO FINAL' : 'GANADOR'}
              </div>
              <div className='fa-fade' style={{ fontSize: 'clamp(36px, 8vw, 170px)' }}>
                {empate ? 'EMPATE' : nombreGanador}
              </div>
              <div style={{ fontSize: 'clamp(26px, 5vw, 110px)' }}>
                {resultadoFinal.rojo} - {resultadoFinal.azul}
              </div>
              <div className='fw-normal' style={{ fontSize: 'clamp(14px, 1.8vw, 34px)' }}>
                {etiquetaFinal}
              </div>
            </div>}
          {!resultadoFinal && hayGanador &&
            <div className='lh-1'>
              <div style={{ fontSize: 'clamp(22px, 4vw, 80px)' }}>GANADOR</div>
              <div className='fa-fade' style={{ fontSize: 'clamp(40px, 9vw, 190px)' }}>{nombreGanador}</div>
              <div style={{ fontSize: 'clamp(26px, 5vw, 110px)' }}>{puntoJuego.puntoR} - {puntoJuego.puntoA}</div>
            </div>}
          {!resultadoFinal && !hayGanador &&
            <div className='lh-1'>
              <div className='reloj-digitaP text-light fw-bold mx-auto' style={{ borderRadius: '15px', fontSize: 'clamp(30px, 8vw, 160px)' }}>
                {formatearTiempo(restanteDescanso)}
              </div>
              <div style={{ fontSize: 'clamp(24px, 6vw, 120px)' }}>
                {empate ? 'EMPATE' : 'PAUSA'}
              </div>
            </div>}
        </div>}
    </>
  )
}

export default scoreCombate
