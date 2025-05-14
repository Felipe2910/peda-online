import { ref, set, update, remove } from "firebase/database";
import { database } from "../firebase/firebaseConfig.js";

class Sala {
	constructor(nombre, creador) {
		this.nombre = nombre;
		this.creador = creador;
		this.usuarios = {}; // Almacena los usuarios
		this.bebidas = {}; // Almacena las bebidas
		this.rondaActual = 0;
		this.maxRondas = 6;
	}

	// Guardar sala en Firebase
	async guardarEnFirebase() {
		await set(ref(database, `salas/${this.nombre}`), {
			nombre: this.nombre,
			creador: this.creador,
			usuarios: this.usuarios,
			bebidas: this.bebidas,
			rondaActual: this.rondaActual,
			maxRondas: this.maxRondas,
		});
	}

	// Agregar un usuario a la sala
	async agregarUsuario(nombreUsuario, usuario) {
		this.usuarios[nombreUsuario] = usuario;
		await update(ref(database, `salas/${this.nombre}/usuarios`), {
			[nombreUsuario]: usuario,
		});
	}

	// Agregar una bebida a la sala
	async agregarBebida(nombreBebida, bebida) {
		this.bebidas[nombreBebida] = bebida;
		await update(ref(database, `salas/${this.nombre}/bebidas`), {
			[nombreBebida]: bebida,
		});
	}

	// Eliminar la sala de Firebase
	async eliminarSala() {
		await remove(ref(database, `salas/${this.nombre}`));
	}

	// Iniciar una nueva ronda
	async iniciarRonda() {
		if (this.rondaActual < this.maxRondas) {
			this.rondaActual += 1;
			await update(ref(database, `salas/${this.nombre}`), {
				rondaActual: this.rondaActual,
			});
		}
	}
}

export default Sala;
