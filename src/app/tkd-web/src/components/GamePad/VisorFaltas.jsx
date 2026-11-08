import React from 'react'

function chipFalta(usado, activo, tipo, claseBando) {
  const colorFondo = (usado && activo) ? claseBando : 'rgba(255,255,255,0.15)'
  const brillo = (usado && activo) ? (tipo === 'A' ? '0 0 8px 1px rgba(255,70,70,0.9)' : '0 0 8px 1px rgba(60,90,255,0.9)') : 'none'
  return (
    <span
      className='d-inline-block rounded-circle align-middle'
      style={{
        width: 'clamp(14px, 1.4vw, 26px)',
        height: 'clamp(14px, 1.4vw, 26px)',
        backgroundColor: colorFondo,
        border: '2px solid rgba(255,255,255,0.85)',
        boxShadow: brillo,
      }}
    />
  )
}

function VisorFaltas(props) {
    const { valor, tipo, resultPre, botones, maxFaltas } = props
    const faltas = resultPre != null && resultPre !== undefined ? resultPre
      : (valor && valor.faltaA != null ? valor.faltaA : valor && valor.faltaR != null ? valor.faltaR : 0)
    const total = Math.max(0, parseInt(maxFaltas) || 0)
    const claseBando = tipo === 'A' ? 'rgb(220, 30, 30)' : 'rgb(25, 40, 120)'
    const activo = (faltas > 0) && (total > 0)
    // Si no hay maxFaltas configurado, solo se muestra el texto numerico
    const cantidadAMostrar = Math.max(0, total)

    return (
        <div className='py-2 text-center'>
            <div className='d-flex flex-wrap justify-content-center align-items-center gap-2 w-100'>
                <h4 className='tituloMenu text-light mb-0' style={{ fontSize: 'clamp(18px, 2.4vw, 38px)', lineHeight: 1 }}>
                  FALTAS ({faltas})
                </h4>
                {cantidadAMostrar > 0 && (
                    <div className='d-flex justify-content-center flex-wrap align-items-center gap-2' style={{ gap: 'clamp(3px, 0.6vw, 9px)' }}>
                        {Array.from({ length: cantidadAMostrar }, (_, i) => (
                            chipFalta(i < faltas, activo, tipo, claseBando)
                        ))}
                    </div>
                )}
                {botones && (
                    <div className='d-flex justify-content-center align-items-center gap-1 flex-wrap'>
                        {botones}
                    </div>
                )}
            </div>
        </div>
    )
}

export default VisorFaltas
