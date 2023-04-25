import {Router} from 'express';
import {addEditCompetidor,getCompetidores,generateLLaves,getCompetidorSinPelea,
    getCompetidoresFestival,deleteCompetidorSP,obtenerDatosPuntuados,
    deleteCompetidor,getCompetidorClasificado,generateLLaveManual,getCompetidorClasificadoLista,
    obtenerLlaves,cambiarNumPelea,obtenerLlavesManuales} from '../controllers/competidor.controllers.js'
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
router.post('/deleteCompetidorSP',async(req,res)=>{
    const result = await deleteCompetidorSP(req.body);
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
router.post('/getCompetidorClasificadoLista',async(req,res)=>{
    const result = await getCompetidorClasificadoLista(req.body);
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
router.post('/getCompetidoresFestival',async(req,res)=>{
    const result = await getCompetidoresFestival(req.body);
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
router.post('/obtenerLlavesManuales',async(req,res)=>{
    console.log(req.body);
    const result = await obtenerLlavesManuales(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/cambiarNumPelea',async(req,res)=>{
    const result = await cambiarNumPelea(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

router.post('/obtenerDatosPuntuados',async(req,res)=>{
    console.log("resultados")
    const result = await obtenerDatosPuntuados(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
export default router;