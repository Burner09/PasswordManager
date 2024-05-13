import { Router } from "express";

import { getAllPasswords, createNewPassword, updatePassword, deletePassword } from '../controllers/passwordControllers.js';

const router = Router();

router.get('/:email', getAllPasswords);
router.post('/:email', createNewPassword);
router.put('/:email/:passwordId', updatePassword);
router.delete('/:email/:passwordId', deletePassword);

export default router;