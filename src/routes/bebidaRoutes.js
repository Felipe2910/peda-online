import express from "express";
import { agregarBebida } from "../controllers/bebidaController.js";

const router = express.Router();

// Ruta para agregar bebida a la sala
router.post("/:sala/agregar-bebida", agregarBebida);

export default router;
