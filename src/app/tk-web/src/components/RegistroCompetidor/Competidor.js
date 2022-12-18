import React from 'react'

function Competidor({user}) {
    return (
        <div className="card bg-transparent flex-row m-0 p-0" style={{ border: 'none' }}>
            {UtilsBufer.getFotoCard(user.FOTO, 40)}
            <div className='ps-2 my-auto d-none d-sm-inline'>
                <div className="cargoHeader fw-bold">{user.NOMBREX}</div>
                <div className='cargoHeader '>{user.CARGO}</div>
            </div>
        </div>
    )
}

export default Competidor
