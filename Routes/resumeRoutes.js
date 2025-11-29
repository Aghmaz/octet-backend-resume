import express from 'express';
import { createResume, 
    updateResume, 
    // deleteResumeController, getResumeController, getAllResumesController 
} from '../Controller/resumeController.js';

const router = express.Router();

router.post('/create', createResume);
router.post('/update', updateResume);
// router.post('/delete', deleteResume);
// router.get('/get/:id', getResume);
// router.get('/get-all', getAllResumes);

export default router;

