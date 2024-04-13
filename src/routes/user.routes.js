import {Router} from 'express';
import {getUsuarios,cambiarEstadoAlbitro,updateUsuarioImg,cambiarTipoDeAlbitro,
    cambiarEstadoUsuario,cargarAdjunto} from '../controllers/user.controllers.js'

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
    var resultado = await cargarAdjunto(req.files.FILE1);
    if(resultado.ok){
        res.status(200).json(resultado)
    }else{
        res.status(404).json(resultado)
    }
});
router.post('/updateUsuarioImg',async(req,res)=>{
    const result = await updateUsuarioImg(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

router.post('/cambiarTipoDeAlbitro',async(req,res)=>{
    const result = await cambiarTipoDeAlbitro(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
export default router;