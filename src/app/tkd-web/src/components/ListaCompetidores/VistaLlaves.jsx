import React, { useEffect, useState } from 'react'
// Ajusta estas dos rutas a las de tu proyecto (son los mismos imports que usabas)
import UtilsDate from '../utils/UtilsDate';
import ImgUser from '../../assets/user.png';

// Una columna por ronda; en pantallas chicas las rondas se apilan.
// Los conectores solo se dibujan cuando las rondas están lado a lado.
const ESTILOS = `
.pelea-card { position: relative; }
@media (min-width: 992px) {
  .llaves-lg .ronda:not(:last-child) .pelea-card::after,
  .llaves-lg .ronda:not(:first-child) .pelea-card::before {
    content: ''; position: absolute; top: 50%; width: .75rem; border-top: 2px solid #6c757d;
  }
  .llaves-lg .ronda:not(:last-child) .pelea-card::after { right: -.75rem; }
  .llaves-lg .ronda:not(:first-child) .pelea-card::before { left: -.75rem; }
}
@media (min-width: 1200px) {
  .llaves-xl .ronda:not(:last-child) .pelea-card::after,
  .llaves-xl .ronda:not(:first-child) .pelea-card::before {
    content: ''; position: absolute; top: 50%; width: .75rem; border-top: 2px solid #6c757d;
  }
  .llaves-xl .ronda:not(:last-child) .pelea-card::after { right: -.75rem; }
  .llaves-xl .ronda:not(:first-child) .pelea-card::before { left: -.75rem; }
}
`;

// Agrupa por ronda y ordena según la estructura de la llave (no por número de pelea):
// se parte de la final y, hacia atrás, cada ronda se ordena por la posición de su
// pelea padre (idpeleapadre). Así las dos peleas que alimentan una misma pelea quedan
// juntas, y esa pelea queda centrada entre ellas.
function agruparRondas(peleas = []) {
    const mapa = {};
    peleas.forEach((p) => { (mapa[p.tipo] = mapa[p.tipo] || []).push(p); });
    const rondas = Object.keys(mapa).map(Number).sort((a, b) => a - b)
        .map((tipo) => ({ tipo, peleas: [...mapa[tipo]] }));

    for (let r = rondas.length - 2; r >= 0; r--) {
        const posPadre = {};
        rondas[r + 1].peleas.forEach((p, i) => { posPadre[p.idpelea] = i; });
        const pos = (p) => (posPadre[p.idpeleapadre] !== undefined ? posPadre[p.idpeleapadre] : Infinity);
        // sort es estable: con el mismo padre se conserva el orden original
        rondas[r].peleas.sort((a, b) => (pos(a) === pos(b) ? 0 : pos(a) < pos(b) ? -1 : 1));
    }
    return rondas;
}

function nombreRonda(ronda) {
    const porCantidad = { 1: 'Final', 2: 'Semifinal', 4: 'Cuartos de final' };
    return porCantidad[ronda.peleas.length] || `Ronda ${ronda.tipo + 1}`;
}

// Editor del número de pelea (modo 'E'): sin usar document.getElementById
function NumeroPelea({ pelea, cambiarNumPelea }) {
    const [valor, setValor] = useState(pelea.nropelea ?? '');
    useEffect(() => { setValor(pelea.nropelea ?? ''); }, [pelea.nropelea]);
    const cambiado = String(valor) !== String(pelea.nropelea ?? '');
    const guardar = () => { if (cambiado && valor !== '') cambiarNumPelea(pelea, valor); };
    return (
        <div className='input-group input-group-sm' style={{ maxWidth: 140 }}>
            <input type='number' className='form-control' placeholder='#' aria-label='Número de pelea'
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') guardar(); }} />
            <button className={`btn ${cambiado ? 'btn-success' : 'btn-outline-secondary'}`}
                disabled={!cambiado} title='Guardar número' aria-label='Guardar número de pelea' onClick={guardar}>
                <i className='fa-solid fa-floppy-disk'></i>
            </button>
        </div>
    );
}

function Competidor({ color, nombres, apellidos, club, edad, grado, peso, altura, resultado }) {
    const definido = nombres != null && nombres !== '';
    const detalle = [
        edad != null && `Edad ${edad}`,
        grado,
        peso != null && `${peso} kg`,
        altura != null && `${altura} m`,
    ].filter(Boolean).join(' · ');
    return (
        <div className={`d-flex align-items-center gap-2 p-2 rounded-2 border-start border-4 border-${color} bg-${color} bg-opacity-25 ${resultado === 'perdedor' ? 'opacity-50' : ''}`}>
            <img src={ImgUser} width='36' height='36' className='rounded-circle flex-shrink-0' alt='' />
            <div className='flex-grow-1' style={{ minWidth: 0 }}>
                {definido ? <>
                    <div className='fw-semibold lh-sm text-break'>{nombres} {apellidos}</div>
                    <div className='small text-light text-opacity-75 lh-sm'>
                        {club && <span className='badge bg-dark bg-opacity-50 me-1'>{club}</span>}
                        {detalle}
                    </div>
                </> : <div className='text-light text-opacity-50 fst-italic'>Por definir</div>}
            </div>
            {resultado === 'ganador' &&
                <i className='fa-solid fa-trophy text-warning flex-shrink-0' title='Ganador' aria-label='Ganador'></i>}
        </div>
    );
}

function TarjetaPelea({ pelea, tipoL, collback, cambiarNumPelea }) {
    const ganoUno = pelea.idganador != null && pelea.idganador === pelea.idcompetidor1;
    const ganoDos = pelea.idganador != null && pelea.idganador === pelea.idcompetidor2;
    return (
        <div className='card bg-dark text-light border-secondary pelea-card' id={`Pelea${pelea.nropelea}`}>
            <div className='card-header border-secondary d-flex justify-content-between align-items-center py-1 px-2'>
                <span className='small text-light text-opacity-75 text-uppercase'>Pelea</span>
                {tipoL === 'E' && <NumeroPelea pelea={pelea} cambiarNumPelea={cambiarNumPelea} />}
                {tipoL === 'O' &&
                    <button className='btn btn-sm btn-light fw-bold px-3' title='Elegir pelea' onClick={() => collback(pelea)}>
                        # {pelea.nropelea}
                    </button>}
                {tipoL !== 'E' && tipoL !== 'O' && <span className='badge bg-secondary'># {pelea.nropelea}</span>}
            </div>
            <div className='card-body p-2 d-grid gap-1'>
                <Competidor color='primary' nombres={pelea.nombres} apellidos={pelea.apellidos} club={pelea.clubuno}
                    edad={pelea.edaduno} grado={pelea.cinturonuno} peso={pelea.pesouno} altura={pelea.alturauno}
                    resultado={ganoUno ? 'ganador' : ganoDos ? 'perdedor' : null} />
                <div className='text-center small text-light text-opacity-50 lh-1'>VS</div>
                <Competidor color='danger' nombres={pelea.nombres2} apellidos={pelea.apellidos2} club={pelea.clubdos}
                    edad={pelea.edaddos} grado={pelea.cinturondos} peso={pelea.pesodos} altura={pelea.alturados}
                    resultado={ganoDos ? 'ganador' : ganoUno ? 'perdedor' : null} />
            </div>
        </div>
    );
}

function VistaLlave({ listaLlaves, idCategoria, genero, tipoL, areas = [],
    cambiarAreaLlave, eliminarLLaveManual, cambiarNumPelea, collback }) {

    const visibles = listaLlaves.filter((l) => idCategoria == l.idcategoria && genero == l.genero);

    if (visibles.length === 0) {
        return (
            <div className='container-fluid'>
                <div className='alert alert-warning mb-0'>
                    <i className='fa-solid fa-circle-info me-2'></i>No hay peleas en esta categoría.
                </div>
            </div>
        );
    }
    function getFundoRonda(ronda) {
        if (ronda === 1) return 'gray-100'; // Fondo oscuro completo
        if (ronda === 2) return 'gray-200';  // Un poco más claro
        if (ronda === 3) return 'bg-tertiary';  // Más claro
        return 'bg-opacity-25';
    }
    return (
        <div className='container-fluid'>
            <style>{ESTILOS}</style>
            {visibles.map((llave) => {
                const rondas = agruparRondas(llave.PELEAS);
                const n = rondas.length;
                // hasta 2 rondas caben lado a lado desde lg; con 3 o más, desde xl
                const claseGrilla = n <= 2
                    ? `llaves-lg row-cols-1 row-cols-lg-${Math.max(n, 1)}`
                    : `llaves-xl row-cols-1 row-cols-xl-${Math.min(n, 6)}`;
                return (
                    <section className='card bg-dark text-light border-0 shadow-sm mb-3' key={llave.idllave}>
                        <header className='card-header border-secondary'>
                            <div className='row g-2 align-items-center'>
                                <div className='col-12 col-md'>
                                    <div className='d-flex flex-wrap align-items-center gap-2'>
                                        <h2 className='h5 mb-0'>{llave.nombregrado}</h2>
                                        <span className='badge bg-secondary'>{llave.genero === 'M' ? 'MASCULINO' : 'FEMENINO'}</span>
                                        <span className='small text-light text-opacity-50'>
                                            <i className='fa-regular fa-calendar me-1'></i>{UtilsDate.getDateFormato(llave.fecha)}
                                        </span>
                                    </div>
                                    <div className='text-light text-opacity-75'>
                                        {llave.nombrecategoria} · {llave.edadini} - {llave.edadfin} años
                                        <span className='mx-2 text-secondary'>|</span>
                                        {llave.nombresubcategoria} · {llave.pesoini} - {llave.pesofin} kg
                                    </div>
                                </div>

                                <div className='col-6 col-md-auto'>
                                    <label className='form-label small text-light text-opacity-50 mb-0'>Área</label>
                                    {tipoL === 'E' &&
                                        <select className='form-select form-select-sm' title='Cambiar área de la llave'
                                            value={llave.area == null ? 'Ninguno' : llave.area}
                                            onChange={(e) => cambiarAreaLlave(llave, e.target.value)}>
                                            <option value='Ninguno'>Ninguno</option>
                                            {areas.map((a) => <option value={a.id} key={a.id}>{a.nombre}</option>)}
                                        </select>}
                                    {tipoL === 'O' &&
                                        <div className='fs-4 fw-bold lh-1'>{llave.area == null ? '-' : llave.area}</div>}
                                </div>

                                <div className='col-6 col-md-auto d-flex gap-1 justify-content-end'>
                                    <a className='btn btn-sm btn-outline-light' href='#llavesClasificadas' title='Ir arriba' aria-label='Ir arriba'>
                                        <i className='fa-solid fa-caret-up'></i>
                                    </a>
                                    {llave.idcategoria == -1 &&
                                        <button className='btn btn-sm btn-danger' title='Eliminar esta llave'
                                            onClick={() => eliminarLLaveManual(llave)}>
                                            <i className='fa-solid fa-trash me-1'></i>Eliminar
                                        </button>}
                                </div>
                            </div>
                        </header>

                        <div className='card-body'>
                            {n === 0 ?
                                <div className='text-center text-light text-opacity-50 py-3'>Esta llave aún no tiene peleas.</div>
                                :
                                <div className={`row g-4 ${claseGrilla}`}>
                                    {rondas.map((ronda) => (
                                        <div className={`col ronda d-flex flex-column ${getFundoRonda(ronda.tipo)}`} key={ronda.tipo}>
                                            <h3 className='h6 text-uppercase text-light text-opacity-75 mb-2'>
                                                {nombreRonda(ronda)}
                                            </h3>
                                            {/* justify-content-around centra cada pelea entre las dos de la ronda anterior */}
                                            <div className='d-flex flex-column justify-content-around gap-3 flex-grow-1'>
                                                {ronda.peleas.map((pelea) => (
                                                    <TarjetaPelea key={pelea.idpelea} pelea={pelea} tipoL={tipoL}
                                                        collback={collback} cambiarNumPelea={cambiarNumPelea} />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}

export default VistaLlave