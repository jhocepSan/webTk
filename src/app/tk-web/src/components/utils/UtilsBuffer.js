import { Buffer } from 'buffer';
import ImgHeader from '../../assets/user.png'

function getFoto(info,tam=50) {
    var imagen = Buffer.from(info);
    imagen = imagen.toString('base64');
    var src = 'data:image/jpg;base64,' + imagen;
    return (
        <img src={src} width={tam} height={tam} className="rounded-circle" />
    );
}
function getFotoCard(info,tam=50) {
    if(info!=undefined){
        var imagen = Buffer.from(info);
        imagen = imagen.toString('base64');
        var src = 'data:image/jpg;base64,' + imagen;
        return (
            <img src={src} width={tam} height={tam} className="rounded-circle d-inline-block align-text-top card-img-left my-auto" />
        );
    }else{
        return (<img src={ImgHeader} alt="" width="38" height="38" className="d-inline-block align-text-top my-auto" />);
    }
}
function getFotoCardNoticias(info,tam=50) {
    if(info!=undefined){
        var imagen = Buffer.from(info);
        imagen = imagen.toString('base64');
        var src = 'data:image/jpg;base64,' + imagen;
        return (
            <img src={src} width={tam}  className="card-img-top" />
        );
    }else{
        return (<i className="fa-solid fa-users"></i>);
    }
}
function getText(info){
    if(info!=null){
        var texto = Buffer.from(info);
        return texto.toString();
    }else{
        return ''
    }
}
export default { getFoto,getText,getFotoCard,getFotoCardNoticias}