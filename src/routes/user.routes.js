import {Router} from 'express';
import {getUsuarios,cambiarEstadoAlbitro,cambiarEstadoUsuario} from '../controllers/user.controllers.js'

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
export default router;