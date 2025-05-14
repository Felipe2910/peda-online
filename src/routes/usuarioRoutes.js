import express from "express";
import { agregarUsuario } from "../controllers/usuarioController.js";

const router = express.Router();

// Ruta para agregar usuario a la sala
router.post("/:sala/agregar-usuario", agregarUsuario);

export default router;
