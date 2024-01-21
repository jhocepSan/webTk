import {Router} from 'express';
import { getPuntosMando,limpiarLecturas } from '../controllers/mando.controllers.js';

const router = Router();

router.post('/enviarDatos',async(req,res)=>{
    var info = req.body;
    console.log(info.info.id,info.dato,info.sector)
    var result={"ok":"conectado"}
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

router.get('/conectar',async(req,res)=>{
    console.log("conectando los dartos")
    var result={"ok":"conectado"}
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/getPuntosMando',async(req,res)=>{
    console.log(req.body);
    const result =await getPuntosMando(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.get('/getPuntosMando/:sector',async(req,res)=>{
    const result =await getPuntosMando({sector:req.params.sector});
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.get('/limpiarLecturas/:sector',async(req,res)=>{
    const result =await limpiarLecturas({sector:req.params.sector});
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
export default router;