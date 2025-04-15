import {toast} from 'react-toastify'
export const server= "http://192.168.1.10:4005"
export const serverio = ""
function msgError(mensaje){
    toast.error(mensaje, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
}
function msgCorrecto(mensaje){
    toast.success(mensaje, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
}
function msgInformacion(mensaje){
    toast.info(mensaje, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
}

export default {msgError,msgCorrecto,msgInformacion,server,serverio}