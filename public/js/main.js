const velocidad = { UltraRapido: 1000, Rapido: 2000, Normal: 3000, Lento: 4000, MuyLento: 5000 };
let velocidadActual = velocidad.Normal;
const mensajes = {
	Sala: {
		creadaExitosamente: "La Sala ${Sala.nombre} creada exitosamente",
		creardaError: "Error al crear la sala",
		unirseExito: "Te has unido a la sala exitosamente",
		unirseError: "Error al unirse a la sala",
		salirseExito: "Te has salido de la sala exitosamente",
		salirseError: "Error al salir de la sala",
		salaLlena: "La sala está llena",
		salaNoEncontrada: "La Sala ${Sala.nombre} no existe o no está disponible",
		jugadorNoEncontrado: "El Jugador ${Jugador.nombre} no existe o no está disponible",
		jugadorJoin: "El Jugador ${Jugador.nombre} se unió a la sala",
		jugadorLeave: "El Jugador ${Jugador.nombre} salió de la sala",
	},
	Juego: {
		InicioExito: "Juego iniciado exitosamente",
		InicioError: "Error al iniciar el juego",
		FinExito: "Juego finalizado exitosamente",
		FinError: "Error al finalizar el juego",
	},
	Jugador: {
		creado: "Jugador con nombre ${Jugador.nombre} creado exitosamente",
		ganador: "El Jugador ${Jugador.nombre} ha ganado el juego",
		medalla: "El Jugador ${Jugador.nombre} ha ganado la medalla ${medalla.tipo}",
		puntos: "El Jugador ${Jugador.nombre} ha ganado ${puntos} puntos",
		estado: {
			sobrio: "El Jugador ${Jugador.nombre} está sobrio",
			contento: "El Jugador ${Jugador.nombre} esta contento",
			euforico: "El Jugador ${Jugador.nombre} esta euforico",
			ebrio: "El Jugador ${Jugador.nombre} esta ebrio",
			inconsciente: "El Jugador ${Jugador.nombre} esta inconsciente",
		},
		perderPuntos: "Puntos de ${this.nombre} reducidos a ${this.puntos}",
		perderResistencia: "El Jugador ${Jugador.nombre} ha perdido ${puntos} de resistencia",
		ganarPuntos: "Puntos de ${this.nombre} aumentados a ${this.puntos}",
		ganarResistencia: "El Jugador ${Jugador.nombre} ha ganado ${puntos} de resistencia",
	},
	agregarBebida: {
		exito: "Bebida ${bebida.nombre} agregada exitosamente",
		error: "Error al agregar la bebida",
	},
	crearMezcla: {
		exito: "Mezcla ${mezcla.nombre} creada exitosamente",
		error: "Error al crear la mezcla",
	},
};
function mostrarMensaje(mensaje) {
	const mensajeDiv = document.createElement("div");
	mensajeDiv.className = "mensaje";
	mensajeDiv.textContent = mensaje;
	document.body.appendChild(mensajeDiv);
	setTimeout(() => {
		mensajeDiv.remove();
	}, 5000);
}
class Jugador {
	constructor(nombre, puntos) {
		this.nombre = nombre;
		this.puntos = puntos;
		this.estado = ["Sobrio", "Contento", "Eufórico", "Ebrio", "Inconsciente"];
		this.estadoActual = this.estado[0];
		this.resistencia = 100;
		this.resistenciaMaxima = 1000;
		this.medallas = {
			ganador: 0,
			ultra_ganador: 0,
			super_ganador: 0,
		};
	}
	ganarMedalla(tipo) {
		if (this.medallas[tipo] !== undefined) {
			this.medallas[tipo]++;
		}
	}
	ganarPuntos(puntos) {
		this.puntos += puntos;
		mostrarMensaje(
			mensajes.Jugador.ganarPuntos
				.replace("${puntos}", puntos)
				.replace("${Jugador.nombre}", this.nombre)
		);
	}
	perderPuntos(puntos) {
		this.puntos -= puntos;
		if (this.puntos < 0) {
			this.puntos = 0;
		}
		mostrarMensaje(
			mensajes.Jugador.perderPuntos
				.replace("${puntos}", puntos)
				.replace("${Jugador.nombre}", this.nombre)
		);
	}
	cambiarEstado() {
		if (this.resistencia > 0) {
			this.resistencia -= 10;
			this.estadoActual = this.estado[Math.floor((100 - this.resistencia) / 20)];
		} else {
			this.estadoActual = "Inconsciente";
		}
		mostrarMensaje(
			mensajes.Jugador.estado[this.estadoActual]
				.replace("${Jugador.nombre}", this.nombre)
				.replace("${estado}", this.estadoActual)
		);
	}
	ganarResistencia(puntos) {
		for (; puntos > 0; puntos--) {
			setTimeout(() => {
				this.resistencia++;
			}, velocidadActual);
		}
		if (this.resistencia > this.resistenciaMaxima) {
			this.resistencia = this.resistenciaMaxima;
		}
		mostrarMensaje(
			mensajes.Jugador.ganarResistencia
				.replace("${puntos}", puntos)
				.replace("${Jugador.nombre}", this.nombre)
		);
	}
	perderResistencia(puntos) {
		for (; puntos > 0; puntos--) {
			setTimeout(() => {
				this.resistencia--;
			}, velocidadActual);
		}
		if (this.resistencia < 0) {
			this.resistencia = 0;
		}
		mostrarMensaje(
			mensajes.Jugador.perderResistencia
				.replace("${puntos}", puntos)
				.replace("${Jugador.nombre}", this.nombre)
		);
	}
}
class Bebida {
	constructor(nombre, grados, precio) {
		this.nombre = nombre;
		this.grados = grados;
		this.precio = precio;
	}
}
class Mezcla {
	constructor(nombre, bebida1, bebida2) {
		this.nombre = nombre;
		this.bebida1 = bebida1;
		this.bebida2 = bebida2;
		this.precio = bebida1.precio + bebida2.precio;
		this.grados =
			bebida1.grados > bebida2.grados
				? (bebida1.grados - bebida2.grados) * 2
				: bebida1.grados < bebida2.grados
				? (bebida2.grados - bebida1.grados) * 2
				: (bebida1.grados + bebida2.grados) / 2;
	}
}
class Sala {
	constructor(nombre, tipo, maxJugadores = 8) {
		if (typeof nombre !== "string") throw new Error("Nombre debe ser string");
		if (!Number.isInteger(maxJugadores) || maxJugadores <= 0) {
			throw new Error("maxJugadores debe ser entero positivo");
		}

		this.nombre = nombre;
		this.maxJugadores = maxJugadores;
		this.tipo = tipo;
		this._bebidas = [];
		this._mezclas = [];
		this._jugadores = []; // Array de objetos jugador
	}

	// Getters para evitar modificación externa accidental
	get bebidas() {
		return [...this._bebidas]; // Devuelve copia
	}

	get mezclas() {
		return [...this._mezclas];
	}

	get jugadores() {
		return [...this._jugadores];
	}

	addBebida(bebida) {
		if (this._bebidas.some((b) => b.nombre === bebida.nombre)) {
			throw new Error(`La bebida ${bebida.nombre} ya existe`);
		}
		this._bebidas.push(bebida);
	}

	addMezcla(mezcla) {
		// Validación similar a addBebida
		this._mezclas.push(mezcla);
	}

	addJugador(jugador) {
		if (this._jugadores.length >= this.maxJugadores) {
			throw new Error("Sala llena");
		}
		if (this._jugadores.some((j) => j.id === jugador.id)) {
			throw new Error(`Jugador ${jugador.nombre} ya está en la sala`);
		}
		this._jugadores.push(jugador);
	}

	removerJugador(jugadorId) {
		const initialLength = this._jugadores.length;
		this._jugadores = this._jugadores.filter((j) => j.id !== jugadorId);
		if (this._jugadores.length === initialLength) {
			throw new Error("Jugador no encontrado");
		}
	}

	// Método útil adicional
	getInfoSala() {
		return {
			nombre: this.nombre,
			tipo: this.tipo,
			jugadoresActuales: this._jugadores.length,
			maxJugadores: this.maxJugadores,
			bebidasDisponibles: this._bebidas.length,
			mezclasDisponibles: this._mezclas.length,
		};
	}
}
