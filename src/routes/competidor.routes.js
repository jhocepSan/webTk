import {Router} from 'express';
import {addEditCompetidor,getCompetidores,generateLLaves,getCompetidorSinPelea,
    deleteCompetidor,getCompetidorClasificado,generateLLaveManual,obtenerLlaves} from '../controllers/competidor.controllers.js'
const router = Router();

router.post('/addEditCompetidor',async(req,res)=>{
    const result = await addEditCompetidor(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/getCompetidores',async(req,res)=>{
    const result = await getCompetidores(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/deleteCompetidor',async(req,res)=>{
    const result = await deleteCompetidor(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/getCompetidorClasificado',async(req,res)=>{
    const result = await getCompetidorClasificado(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/getCompetidorSinPelea',async(req,res)=>{
    const result = await getCompetidorSinPelea(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/generateLLaves',async(req,res)=>{
    const result = await generateLLaves(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/generateLLaveManual',async(req,res)=>{
    const result = await generateLLaveManual(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

router.post('/obtenerLlaves',async(req,res)=>{
    const result = await obtenerLlaves(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
export default router;