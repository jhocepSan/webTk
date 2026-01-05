
import {Router} from 'express';
import {addEstudiante,getEstudiantes,editEstadoEstu
    ,getAsisEstudi,setAsistencia
} from '../controllers/estudiante.controllers.js'
const router = Router();

router.post('/getEstudiantes',async(req,res)=>{
    const result = await getEstudiantes(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

router.post('/addEstudiante',async(req,res)=>{
    const result = await addEstudiante(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

router.post('/editEstadoEstu',async(req,res)=>{
    const result = await editEstadoEstu(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

router.post('/getAsisEstudi',async(req,res)=>{
    const result = await getAsisEstudi(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

router.post('/setAsistencia',async(req,res)=>{
    const result = await setAsistencia(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

export default router;