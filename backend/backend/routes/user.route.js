import {Router} from "express";
import { signup,signin,getAllUsers,getUser,updateUser,deleteUser} from "../controllers/user.conroller.js";
const router = Router();
router.post('/signup',signup);
router.post('/signin',signin);
router.get('/',getAllUsers);
router.get('/:id',getUser);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);

export default router;