import {Router} from 'express';
import {getHorarios, agregarHorario} from '../controllers/horario.controllers.js'

const router = Router();

router.post('/getHorarios',async(req,res)=>{
    const result = await getHorarios(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

router.post('/agregarHorario',async(req,res)=>{
    const result = await agregarHorario(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
export default router;