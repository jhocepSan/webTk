import {Router} from 'express';
import { setInfoMando,getPuntosMando,sendDatosPoomse,getPuntosPoomse,
    limpiarLecturasPoomse,setPuntuacionPoomse,limpiarLecturas,savePuntuacionPoomse } from '../controllers/mando.controllers.js';

const router = Router();

router.post('/enviarDatos',async(req,res)=>{
    console.log(req.body);
    const result =await setInfoMando(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/sendDatosPoomse',async(req,res)=>{
    console.log(req.body);
    const result =await sendDatosPoomse(req.body);
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

router.post('/getPuntosPoomse',async(req,res)=>{
    console.log(req.body);
    const result =await getPuntosPoomse(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/limpiarLecturasPoomse',async(req,res)=>{
    console.log(req.body);
    const result =await limpiarLecturasPoomse(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/setPuntuacionPoomse',async(req,res)=>{
    console.log(req.body);
    const result =await setPuntuacionPoomse(req.body);
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
router.post('/savePuntuacionPoomse',async(req,res)=>{
    const result =await savePuntuacionPoomse(req.body);
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
})
export default router;