import express from 'express';
import { createResume, 
    updateResume,
    getResume,
    getResumeByShareId
} from '../Controller/resumeController.js';

const router = express.Router();

router.post('/create', createResume);
router.post('/update', updateResume);
router.get('/get', getResume);
router.get('/get/:shareId', getResumeByShareId);

export default router;

