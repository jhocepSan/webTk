import React from 'react'
import QRCode from 'react-qr-code';

function QrCode(props) {
    const { texto } = props;
    return (
        <div>
            <QRCode value={texto} size={256} level="H" />
            {/* value: el texto/URL a codificar */}
            {/* size: tamaño en píxeles */}
            {/* level: nivel de corrección de errores (L, M, Q, H) */}
        </div>
    )
}

export default QrCode