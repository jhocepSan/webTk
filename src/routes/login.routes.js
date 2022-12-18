import {Router} from 'express';
import {agregarUsuario,iniciarSession} from '../controllers/login.controllers.js'
const router = Router();

router.post('/iniciarSession',async (req, res) => {
    const {correo,password} = req.body;
    const result = await iniciarSession({correo,password})
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

router.post('/createUser',async(req,res)=>{
    const {info} = req.body;
    const result = await agregarUsuario({info})
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

export default router;