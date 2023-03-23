import {Router} from 'express';
import {agregarUsuario,iniciarSession,crearCampeonato,recuperarCuenta} from '../controllers/login.controllers.js'
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

router.post('/crearCampeonato',async(req,res)=>{
    const {nombre,descripcion} = req.body;
    const result = await crearCampeonato({nombre,descripcion})
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
router.post('/recuperarCuenta',async(req,res)=>{
    const {email,newPassword,ci} = req.body;
    const result = await recuperarCuenta({email,newPassword,ci})
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});
export default router;