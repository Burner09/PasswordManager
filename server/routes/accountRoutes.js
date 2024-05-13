import { Router } from "express";

import { verifyToken } from '../middleware/authMiddleware.js';
import { userSignUp, userSignIn, changeUserAccountPassword, deleteUserAccount, refreshJWT, changeUserName, changeUserEmail } from '../controllers/accountControllers.js';

const router = Router();

router.post('/auth', verifyToken, refreshJWT)

router.post('/signup', userSignUp);
router.post('/signin', userSignIn);

router.post('/deleteaccount/:email', deleteUserAccount);
router.put('changeusername/:email', changeUserName)
router.put('changeuseremail/:email', changeUserEmail)
router.put('/changepassword/:email', changeUserAccountPassword);

export default router;