import { Router } from 'express';
import {
    getListaClub, addClub, deleteClub,updateClubImg,
    editarClub, setPuntuadoClub, getListaClubPuntuado
} from '../controllers/club.controllers.js';

const router = Router();

router.get('/getListaClub', async (req, res) => {
    const result = await getListaClub();
    if (result.ok) {
        res.status(200).json(result);
    } else {
        res.status(404).json(result);
    }
});
router.get('/getListaClubPuntuado', async (req, res) => {
    const result = await getListaClubPuntuado();
    if (result.ok) {
        res.status(200).json(result);
    } else {
        res.status(404).json(result);
    }
})
router.post('/addClub', async (req, res) => {
    const { info } = req.body;
    const result = await addClub({ info });
    if (result.ok) {
        res.status(200).json(result);
    } else {
        res.status(404).json(result);
    }
});
router.post('/deleteClub', async (req, res) => {
    const { info } = req.body;
    const result = await deleteClub({ info });
    if (result.ok) {
        res.status(200).json(result);
    } else {
        res.status(404).json(result);
    }
});

router.post('/editarClub', async (req, res) => {
    const { info } = req.body;
    const result = await editarClub({ info });
    if (result.ok) {
        res.status(200).json(result);
    } else {
        res.status(404).json(result);
    }
});

router.post('/setPuntuadoClub', async (req, res) => {
    const result = await setPuntuadoClub(req.body);
    if (result.ok) {
        res.status(200).json(result);
    } else {
        res.status(404).json(result);
    }
});

router.post('/updateClubImg',async(req,res)=>{
    const result = await updateClubImg(req.body);
    if (result.ok) {
        res.status(200).json(result);
    } else {
        res.status(404).json(result);
    }
})
export default router;