import express from "express";
import {
	crearSala,
	obtenerSalas,
	obtenerSala,
	actualizarSala,
} from "../controllers/salaController.js";

const router = express.Router();

// Crear una nueva sala
router.post("/crear", crearSala);

// Obtener todas las salas
router.get("/listar", obtenerSalas);

// Obtener una sala específica por su nombre
router.get("/:nombre", obtenerSala);

// Actualizar sala
router.put("/:nombre", actualizarSala);

export default router;
