import {Router} from 'express';
import {addEditCompetidor,getCompetidores,generateLLaves,getCompetidorSinPelea,
    getCompetidoresFestival,deleteCompetidorSP,obtenerDatosPuntuados,
    deleteCompetidor,getCompetidorClasificado,generateLLaveManual,getCompetidorClasificadoLista,
    obtenerLlaves,cambiarNumPelea,obtenerLlavesManuales,buscarCompetidor,
    obtenerLlaveRompimineto,getInformacionRompimiento,generarLlavePoomse,
    generarLlaveRompimiento,addEditEquipo,deleteEquipo,getEquipoDemostration,
    guardarRompimientoPuntos,generarLlaveRompimientoFestival,setPosition,cambiarAreaLlave,eliminarLlaveManual,
    obtenerDatosPuntuadosR,eliminarPuntuacion,eliminarLlavesGeneradas} from '../controllers/competidor.controllers.js'
const router = Router();

router.post('/addEditCompetidor',async(req,res)=>{
    const result = await addEditCompetidor(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/getEquipoDemostration',async(req,res)=>{
    const result = await getEquipoDemostration(req.body);
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
router.post('/deleteEquipo',async(req,res)=>{
    const result = await deleteEquipo(req.body);
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
    var result 
    var info= req.body;
    if(info.tipo=='C'){
        result = await obtenerLlaves(req.body);
    }else if(info.tipo=='R' || info.tipo=='P'){
        result = await obtenerLlaveRompimineto(req.body);
    }else{
        result = {"ok":[]}
    }
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
router.post('/cambiarAreaLlave',async(req,res)=>{
    const result = await cambiarAreaLlave(req.body);
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

router.post('/obtenerDatosPuntuadosR',async(req,res)=>{
    console.log("resultados")
    const result = await obtenerDatosPuntuadosR(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/buscarCompetidor',async(req,res)=>{
    const result = await buscarCompetidor(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/generarLlaveRompimiento',async(req,res)=>{
    const result = await generarLlaveRompimiento(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
}); 
router.post('/generarLlaveRompimientoFestival',async(req,res)=>{
    const result = await generarLlaveRompimientoFestival(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/getInformacionRompimiento',async(req,res)=>{
    const result = await getInformacionRompimiento(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/generarLlavePoomse',async(req,res)=>{
    const result = await generarLlavePoomse(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
router.post('/addEditEquipo',async(req,res)=>{
    const result = await addEditEquipo(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
router.post('/guardarRompimientoPuntos',async(req,res)=>{
    const result = await guardarRompimientoPuntos(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
router.post('/setPosition',async(req,res)=>{
    const result = await setPosition(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
router.post('/eliminarPuntuacion',async(req,res)=>{
    const result = await eliminarPuntuacion(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
router.post('/eliminarLlavesGeneradas',async(req,res)=>{
    const result = await eliminarLlavesGeneradas(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
router.post('/eliminarLlaveManual',async(req,res)=>{
    const result = await eliminarLlaveManual(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
export default router;