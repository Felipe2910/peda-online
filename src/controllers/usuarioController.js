import Usuario from "../models/Usuario.js";
import { ref, update } from "firebase/database";
import { database } from "../firebase/firebaseConfig.js";

export const agregarUsuario = async (req, res) => {
	const { nombre, icono, resistencia } = req.body;
	const usuario = new Usuario(nombre, icono, resistencia);

	// Agregar usuario a Firebase en la sala
	await update(ref(database, `salas/${req.params.sala}/usuarios`), {
		[nombre]: usuario,
	});

	res.status(200).send("Usuario agregado");
};
