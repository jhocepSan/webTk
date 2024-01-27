import {Router} from 'express';
import {getUsuarios,cambiarEstadoAlbitro,cambiarEstadoUsuario,cargarAdjunto} from '../controllers/user.controllers.js'

const router = Router();
router.get('/getUsuarios',async(req,res)=>{
    const result = await getUsuarios();
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

router.post('/cambiarEstadoAlbitro',async(req,res)=>{
    const result = await cambiarEstadoAlbitro(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

router.post('/cambiarEstadoUsuario',async(req,res)=>{
    const result = await cambiarEstadoUsuario(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

router.post('/cargarAdjunto',async(req,res)=>{
    console.log(req.files)
    var resultado = await cargarAdjunto(req.files);
    if(resultado.ok){
        res.status(200).json(resultado)
    }else{
        res.status(404).json(resultado)
    }
});
export default router;