import React, { useState } from 'react'
import Header from '../Header'
import UtilsCargador from '../utils/UtilsCargador'

function PrincipalTesting() {
    const [cargador,setCargador] = useState(false);
    return (
        <div>
            <Header />
            <UtilsCargador show={cargador}/>
            mandos testing
        </div>
    )
}

export default PrincipalTesting
