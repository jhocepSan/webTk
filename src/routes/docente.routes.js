import {Router} from 'express';
import {getDocentes,agregarDocente,editarEstadoDoc} from '../controllers/docente.controllers.js'

const router = Router();

router.post('/getDocentes',async(req,res)=>{
    const result = await getDocentes(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})

router.post('/agregarDocente',async(req,res)=>{
    const result = await agregarDocente(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})

router.post('/editarEstadoDoc',async(req,res)=>{
    const result = await editarEstadoDoc(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})

export default router;