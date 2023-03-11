function getDateFormato(dato){
    var fecha = new Date(dato);
    return `${fecha.getDate()}/${fecha.toLocaleString('default', { month: 'long' })}/${fecha.getFullYear()}`
}

export default {getDateFormato}