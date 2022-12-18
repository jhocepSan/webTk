import {Router} from 'express';
import {getUsuarios} from '../controllers/user.controllers.js'

const router = Router();
router.get('/getUsuarios',async(req,res)=>{
    const result = await getUsuarios();
    if(result.ok){
        res.status(200).json(result);
    }else{
        res.status(404).json(result);
    }
});

export default router;