import {Router} from 'express';
import {getGrados,getCategoria,addCategoria,deleteCategoria,addCinturon,deleteGrado,deleteCinturon,cambiarEstadoCategoria,
    addSubCategoria,getSubCategoria,addGrado,getCampeonato,deleteSubcategoria,getConfiCategoria,getConfiCategoriaUnido,
    getTiposCampeonato,addTiposCampeonato,deleteTiposCampeonato,getGradoCompleto,cambiarInscripcion,confiAreasKirugui,
    getConfiCategoriaFestival,getConfiAreas} from '../controllers/configuracion.controllers.js'
const router = Router();

router.post('/getGradoCompleto',async(req,res)=>{
    const {info} = req.body;
    const result = await getGradoCompleto({info});
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/getGrados',async(req,res)=>{
    const {info} = req.body;
    const result = await getGrados({info});
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/getCategoria',async(req,res)=>{
    const result = await getCategoria(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/addCategoria',async(req,res)=>{
    const {info} = req.body;
    const result = await addCategoria({info});
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/deleteCategoria',async(req,res)=>{
    const {info} = req.body;
    const result = await deleteCategoria({info});
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/getSubCategoria',async(req,res)=>{
    const {info} = req.body;
    const result = await getSubCategoria({info});
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/addSubCategoria',async(req,res)=>{
    const {info} = req.body;
    const result = await addSubCategoria({info});
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/addGrado',async(req,res)=>{
    const {info} = req.body;
    const result = await addGrado({info});
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/deleteGrado',async(req,res)=>{
    const {info} = req.body;
    const result = await deleteGrado({info});
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/addCinturon',async(req,res)=>{
    const {info} = req.body;
    const result = await addCinturon({info});
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/deleteCinturon',async(req,res)=>{
    const {info} = req.body;
    const result = await deleteCinturon({info});
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/deleteSubcategoria',async(req,res)=>{
    const result = await deleteSubcategoria(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.get('/getCampeonato',async(req,res)=>{
    const result = await getCampeonato();
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/getConfiCategoriaFestival',async(req,res)=>{
    const result = await getConfiCategoriaFestival(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/getConfiCategoria',async(req,res)=>{
    const result = await getConfiCategoria(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/getConfiCategoriaUnido',async(req,res)=>{
    const result = await getConfiCategoriaUnido(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/cambiarEstadoCategoria',async(req,res)=>{
    const result = await cambiarEstadoCategoria(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
router.post('/getTiposCampeonato',async(req,res)=>{
    const result = await getTiposCampeonato(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
router.post('/addTiposCampeonato',async(req,res)=>{
    const result = await addTiposCampeonato(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
router.post('/deleteTiposCampeonato',async(req,res)=>{
    const result = await deleteTiposCampeonato(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
router.post('/cambiarInscripcion',async(req,res)=>{
    const result = await cambiarInscripcion(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
router.post('/confiAreasKirugui',async(req,res)=>{
    const result = await confiAreasKirugui(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
router.post('/getConfiAreas',async(req,res)=>{
    const result = await getConfiAreas(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
export default router;