import express from "express"
const router = express.Router();
import {handleChat} from "../controllers/chat.controller.js"

router.post("/", handleChat);

export default router
