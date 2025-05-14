import { database } from "../firebase/firebaseConfig.js";
import { ref, set, get, child, update } from "firebase/database";
import Sala from "../models/Sala.js";

// Crear una nueva sala
const crearSala = async (req, res) => {
	const { nombre, creador } = req.body;
	const nuevaSala = new Sala(nombre, creador);

	try {
		await set(ref(database, `salas/${nombre}`), nuevaSala);
		res.status(201).send("Sala creada exitosamente");
	} catch (error) {
		res.status(500).send("Error al crear la sala");
	}
};

// Obtener todas las salas
const obtenerSalas = async (req, res) => {
	try {
		const dbRef = ref(database);
		const snapshot = await get(child(dbRef, "salas"));
		if (snapshot.exists()) {
			res.status(200).json(snapshot.val());
		} else {
			res.status(404).send("No hay salas disponibles");
		}
	} catch (error) {
		res.status(500).send("Error al obtener las salas");
	}
};

// Obtener una sola sala
const obtenerSala = async (req, res) => {
	const { nombre } = req.params;
	try {
		const dbRef = ref(database);
		const snapshot = await get(child(dbRef, `salas/${nombre}`));
		if (snapshot.exists()) {
			res.status(200).json(snapshot.val());
		} else {
			res.status(404).send("Sala no encontrada");
		}
	} catch (error) {
		res.status(500).send("Error al obtener la sala");
	}
};

// Actualizar sala (si se quiere agregar funcionalidad más adelante)
const actualizarSala = async (req, res) => {
	const { nombre } = req.params;
	const { usuarios, bebidas, rondaActual } = req.body;

	try {
		await update(ref(database, `salas/${nombre}`), {
			usuarios,
			bebidas,
			rondaActual,
		});
		res.status(200).send("Sala actualizada exitosamente");
	} catch (error) {
		res.status(500).send("Error al actualizar la sala");
	}
};

export { crearSala, obtenerSalas, obtenerSala, actualizarSala };
