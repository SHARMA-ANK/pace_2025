import {Router} from 'express';
import { getDetails } from '../controller/sponsor.controller.js';
const router=Router();
router.route("/sendEmail").get(getDetails);
export {router}