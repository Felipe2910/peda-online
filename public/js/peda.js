// Constantes y configuración
const VELOCIDAD = {
	ULTRA_RAPIDO: 1000,
	RAPIDO: 2000,
	NORMAL: 3000,
	LENTO: 4000,
	MUY_LENTO: 5000,
};

const MENSAJES = {
	SALA: {
		CREADA_EXITOSA: "La Sala ${sala.nombre} creada exitosamente",
		CREADA_ERROR: "Error al crear la sala",
		UNIRSE_EXITO: "Te has unido a la sala exitosamente",
		UNIRSE_ERROR: "Error al unirse a la sala",
		SALIRSE_EXITO: "Te has salido de la sala exitosamente",
		SALIRSE_ERROR: "Error al salir de la sala",
		SALA_LLENA: "La sala está llena",
		SALA_NO_ENCONTRADA: "La Sala ${sala.nombre} no existe o no está disponible",
		JUGADOR_NO_ENCONTRADO: "El Jugador ${jugador.nombre} no existe o no está disponible",
		JUGADOR_JOIN: "El Jugador ${jugador.nombre} se unió a la sala",
		JUGADOR_LEAVE: "El Jugador ${jugador.nombre} salió de la sala",
	},
	JUEGO: {
		INICIO_EXITO: "Juego iniciado exitosamente",
		INICIO_ERROR: "Error al iniciar el juego",
		FIN_EXITO: "Juego finalizado exitosamente",
		FIN_ERROR: "Error al finalizar el juego",
	},
	JUGADOR: {
		CREADO: "Jugador con nombre ${jugador.nombre} creado exitosamente",
		GANADOR: "El Jugador ${jugador.nombre} ha ganado el juego",
		MEDALLA: "El Jugador ${jugador.nombre} ha ganado la medalla ${medalla.tipo}",
		PUNTOS: "El Jugador ${jugador.nombre} ha ganado ${puntos} puntos",
		ESTADO: {
			SOBRIO: "El Jugador ${jugador.nombre} está sobrio",
			CONTENTO: "El Jugador ${jugador.nombre} esta contento",
			EUFORICO: "El Jugador ${jugador.nombre} esta euforico",
			EBRIO: "El Jugador ${jugador.nombre} esta ebrio",
			INCONSCIENTE: "El Jugador ${jugador.nombre} esta inconsciente",
		},
		PERDER_PUNTOS: "Puntos de ${jugador.nombre} reducidos a ${jugador.puntos}",
		PERDER_RESISTENCIA: "El Jugador ${jugador.nombre} ha perdido ${puntos} de resistencia",
		GANAR_PUNTOS: "Puntos de ${jugador.nombre} aumentados a ${jugador.puntos}",
		GANAR_RESISTENCIA: "El Jugador ${jugador.nombre} ha ganado ${puntos} de resistencia",
	},
	BEBIDA: {
		AGREGAR_EXITO: "Bebida ${bebida.nombre} agregada exitosamente",
		AGREGAR_ERROR: "Error al agregar la bebida",
	},
	MEZCLA: {
		CREAR_EXITO: "Mezcla ${mezcla.nombre} creada exitosamente",
		CREAR_ERROR: "Error al crear la mezcla",
	},
};

// Utilidades
class Utils {
	static formatMessage(template, data) {
		return template.replace(/\${([^}]+)}/g, (_, key) => {
			return key.split(".").reduce((obj, k) => obj?.[k], data) || "";
		});
	}

	static mostrarMensaje(mensaje, duracion = 5000) {
		const mensajeDiv = document.createElement("div");
		mensajeDiv.className = "mensaje";
		mensajeDiv.textContent = mensaje;
		document.body.appendChild(mensajeDiv);
		setTimeout(() => mensajeDiv.remove(), duracion);
	}
}

// Clase Jugador mejorada
class Jugador {
	constructor(nombre, puntos = 0) {
		this.id = crypto.randomUUID();
		this.nombre = nombre;
		this.puntos = puntos;
		this.estados = ["Sobrio", "Contento", "Eufórico", "Ebrio", "Inconsciente"];
		this.estadoActual = this.estados[0];
		this.resistencia = 100;
		this.resistenciaMaxima = 100;
		this.medallas = {
			ganador: 0,
			ultra_ganador: 0,
			super_ganador: 0,
		};
		this.historial = [];

		Utils.mostrarMensaje(Utils.formatMessage(MENSAJES.JUGADOR.CREADO, { jugador: this }));
	}

	get nivel() {
		if (this.puntos < 100) return "Novato";
		if (this.puntos < 500) return "Intermedio";
		if (this.puntos < 2000) return "Avanzado";
		return "Experto";
	}

	ganarMedalla(tipo) {
		if (this.medallas[tipo] !== undefined) {
			this.medallas[tipo]++;
			Utils.mostrarMensaje(
				Utils.formatMessage(MENSAJES.JUGADOR.MEDALLA, {
					jugador: this,
					medalla: { tipo },
				})
			);
		}
		return this;
	}

	ganarPuntos(puntos) {
		this.puntos += puntos;
		this.historial.push({ tipo: "ganarPuntos", puntos, fecha: new Date() });
		Utils.mostrarMensaje(
			Utils.formatMessage(MENSAJES.JUGADOR.GANAR_PUNTOS, {
				jugador: this,
				puntos,
			})
		);
		return this;
	}

	perderPuntos(puntos) {
		this.puntos = Math.max(0, this.puntos - puntos);
		this.historial.push({ tipo: "perderPuntos", puntos, fecha: new Date() });
		Utils.mostrarMensaje(Utils.formatMessage(MENSAJES.JUGADOR.PERDER_PUNTOS, { jugador: this }));
		return this;
	}

	cambiarEstado() {
		if (this.resistencia > 0) {
			const estadoIndex = Math.min(
				this.estados.length - 1,
				Math.floor((100 - this.resistencia) / 20)
			);
			this.estadoActual = this.estados[estadoIndex];
		} else {
			this.estadoActual = this.estados[4]; // Inconsciente
		}

		Utils.mostrarMensaje(
			Utils.formatMessage(MENSAJES.JUGADOR.ESTADO[this.estadoActual.toUpperCase()], {
				jugador: this,
			})
		);
		return this;
	}

	ganarResistencia(puntos) {
		this.resistencia = Math.min(this.resistenciaMaxima, this.resistencia + puntos);
		this.historial.push({ tipo: "ganarResistencia", puntos, fecha: new Date() });
		Utils.mostrarMensaje(
			Utils.formatMessage(MENSAJES.JUGADOR.GANAR_RESISTENCIA, {
				jugador: this,
				puntos,
			})
		);
		return this;
	}

	perderResistencia(puntos) {
		this.resistencia = Math.max(0, this.resistencia - puntos);
		this.historial.push({ tipo: "perderResistencia", puntos, fecha: new Date() });
		this.cambiarEstado();
		Utils.mostrarMensaje(
			Utils.formatMessage(MENSAJES.JUGADOR.PERDER_RESISTENCIA, {
				jugador: this,
				puntos,
			})
		);
		return this;
	}

	toJSON() {
		return {
			id: this.id,
			nombre: this.nombre,
			puntos: this.puntos,
			estadoActual: this.estadoActual,
			resistencia: this.resistencia,
			resistenciaMaxima: this.resistenciaMaxima,
			medallas: { ...this.medallas },
			nivel: this.nivel,
			historial: [...this.historial],
		};
	}

	static fromJSON(data) {
		const jugador = new Jugador(data.nombre, data.puntos);
		Object.assign(jugador, data);
		return jugador;
	}
}

// Clase Bebida mejorada
class Bebida {
	constructor(nombre, grados, precio, efectos = {}) {
		this.nombre = nombre;
		this.grados = grados;
		this.precio = precio;
		this.efectos = {
			resistencia: -grados * 10,
			puntos: grados * 5,
			...efectos,
		};
	}

	aplicarEfectos(jugador) {
		if (this.efectos.resistencia) {
			if (this.efectos.resistencia > 0) {
				jugador.ganarResistencia(this.efectos.resistencia);
			} else {
				jugador.perderResistencia(Math.abs(this.efectos.resistencia));
			}
		}

		if (this.efectos.puntos) {
			if (this.efectos.puntos > 0) {
				jugador.ganarPuntos(this.efectos.puntos);
			} else {
				jugador.perderPuntos(Math.abs(this.efectos.puntos));
			}
		}

		return jugador;
	}

	toJSON() {
		return {
			nombre: this.nombre,
			grados: this.grados,
			precio: this.precio,
			efectos: { ...this.efectos },
		};
	}

	static fromJSON(data) {
		return new Bebida(data.nombre, data.grados, data.precio, data.efectos);
	}
}

// Clase Mezcla mejorada
class Mezcla {
	constructor(nombre, bebida1, bebida2) {
		this.nombre = nombre;
		this.bebida1 = bebida1;
		this.bebida2 = bebida2;
		this.precio = bebida1.precio + bebida2.precio;
		this.grados = this.calcularGrados(bebida1, bebida2);
		this.efectos = this.combinarEfectos(bebida1, bebida2);
	}

	calcularGrados(b1, b2) {
		if (b1.grados > b2.grados) {
			return (b1.grados - b2.grados) * 2;
		} else if (b1.grados < b2.grados) {
			return (b2.grados - b1.grados) * 2;
		}
		return (b1.grados + b2.grados) / 2;
	}

	combinarEfectos(b1, b2) {
		return {
			resistencia: (b1.efectos.resistencia + b2.efectos.resistencia) * 1.5,
			puntos: (b1.efectos.puntos + b2.efectos.puntos) * 1.5,
		};
	}

	aplicarEfectos(jugador) {
		if (this.efectos.resistencia) {
			if (this.efectos.resistencia > 0) {
				jugador.ganarResistencia(this.efectos.resistencia);
			} else {
				jugador.perderResistencia(Math.abs(this.efectos.resistencia));
			}
		}

		if (this.efectos.puntos) {
			if (this.efectos.puntos > 0) {
				jugador.ganarPuntos(this.efectos.puntos);
			} else {
				jugador.perderPuntos(Math.abs(this.efectos.puntos));
			}
		}

		return jugador;
	}

	toJSON() {
		return {
			nombre: this.nombre,
			bebida1: this.bebida1.toJSON(),
			bebida2: this.bebida2.toJSON(),
			precio: this.precio,
			grados: this.grados,
			efectos: { ...this.efectos },
		};
	}

	static fromJSON(data) {
		return new Mezcla(data.nombre, Bebida.fromJSON(data.bebida1), Bebida.fromJSON(data.bebida2));
	}
}

// Clase Sala mejorada
class Sala {
	constructor(nombre, tipo, maxJugadores = 8) {
		if (typeof nombre !== "string") {
			throw new Error(Utils.formatMessage(MENSAJES.SALA.CREADA_ERROR));
		}

		if (!Number.isInteger(maxJugadores) || maxJugadores <= 0) {
			throw new Error("maxJugadores debe ser entero positivo");
		}

		this.nombre = nombre;
		this.tipo = tipo;
		this.maxJugadores = maxJugadores;
		this._bebidas = [];
		this._mezclas = [];
		this._jugadores = [];
		this.eventListeners = {
			jugadorAdded: [],
			jugadorRemoved: [],
			bebidaAdded: [],
			mezclaAdded: [],
			estadoChanged: [],
		};

		Utils.mostrarMensaje(Utils.formatMessage(MENSAJES.SALA.CREADA_EXITOSA, { sala: this }));
	}

	// Getters protegidos
	get bebidas() {
		return [...this._bebidas];
	}

	get mezclas() {
		return [...this._mezclas];
	}

	get jugadores() {
		return [...this._jugadores];
	}

	get jugadoresCount() {
		return this._jugadores.length;
	}

	get info() {
		return {
			nombre: this.nombre,
			tipo: this.tipo,
			jugadoresActuales: this.jugadoresCount,
			maxJugadores: this.maxJugadores,
			bebidasDisponibles: this._bebidas.length,
			mezclasDisponibles: this._mezclas.length,
		};
	}

	// Sistema de eventos
	on(eventName, callback) {
		if (this.eventListeners[eventName]) {
			this.eventListeners[eventName].push(callback);
		}
		return this;
	}

	emit(eventName, data) {
		if (this.eventListeners[eventName]) {
			this.eventListeners[eventName].forEach((cb) => cb(data));
		}
		return this;
	}

	// Métodos para jugadores
	addJugador(jugador) {
		if (!(jugador instanceof Jugador)) {
			throw new Error("Debe proporcionar una instancia de Jugador");
		}

		if (this._jugadores.length >= this.maxJugadores) {
			Utils.mostrarMensaje(MENSAJES.SALA.SALA_LLENA);
			return false;
		}

		if (this._jugadores.some((j) => j.id === jugador.id)) {
			Utils.mostrarMensaje(Utils.formatMessage(MENSAJES.SALA.UNIRSE_ERROR, { jugador }));
			return false;
		}

		this._jugadores.push(jugador);
		Utils.mostrarMensaje(Utils.formatMessage(MENSAJES.SALA.JUGADOR_JOIN, { jugador }));
		this.emit("jugadorAdded", jugador);
		return true;
	}

	removerJugador(jugadorId) {
		const initialLength = this._jugadores.length;
		this._jugadores = this._jugadores.filter((j) => {
			if (j.id === jugadorId) {
				this.emit("jugadorRemoved", j);
				Utils.mostrarMensaje(Utils.formatMessage(MENSAJES.SALA.JUGADOR_LEAVE, { jugador: j }));
				return false;
			}
			return true;
		});

		if (this._jugadores.length === initialLength) {
			Utils.mostrarMensaje(MENSAJES.SALA.JUGADOR_NO_ENCONTRADO);
			return false;
		}
		return true;
	}

	getJugador(jugadorId) {
		return this._jugadores.find((j) => j.id === jugadorId);
	}

	// Métodos para bebidas
	addBebida(bebida) {
		if (!(bebida instanceof Bebida)) {
			throw new Error("Debe proporcionar una instancia de Bebida");
		}

		if (this._bebidas.some((b) => b.nombre === bebida.nombre)) {
			Utils.mostrarMensaje(Utils.formatMessage(MENSAJES.BEBIDA.AGREGAR_ERROR, { bebida }));
			return false;
		}

		this._bebidas.push(bebida);
		Utils.mostrarMensaje(Utils.formatMessage(MENSAJES.BEBIDA.AGREGAR_EXITO, { bebida }));
		this.emit("bebidaAdded", bebida);
		return true;
	}

	getBebida(nombre) {
		return this._bebidas.find((b) => b.nombre === nombre);
	}

	// Métodos para mezclas
	addMezcla(mezcla) {
		if (!(mezcla instanceof Mezcla)) {
			throw new Error("Debe proporcionar una instancia de Mezcla");
		}

		if (this._mezclas.some((m) => m.nombre === mezcla.nombre)) {
			Utils.mostrarMensaje(Utils.formatMessage(MENSAJES.MEZCLA.CREAR_ERROR, { mezcla }));
			return false;
		}

		this._mezclas.push(mezcla);
		Utils.mostrarMensaje(Utils.formatMessage(MENSAJES.MEZCLA.CREAR_EXITO, { mezcla }));
		this.emit("mezclaAdded", mezcla);
		return true;
	}

	getMezcla(nombre) {
		return this._mezclas.find((m) => m.nombre === nombre);
	}

	// Métodos de interacción
	consumirBebida(jugadorId, bebidaNombre) {
		const jugador = this.getJugador(jugadorId);
		const bebida = this.getBebida(bebidaNombre);

		if (!jugador || !bebida) {
			Utils.mostrarMensaje("Elemento no encontrado");
			return false;
		}

		bebida.aplicarEfectos(jugador);
		return true;
	}

	consumirMezcla(jugadorId, mezclaNombre) {
		const jugador = this.getJugador(jugadorId);
		const mezcla = this.getMezcla(mezclaNombre);

		if (!jugador || !mezcla) {
			Utils.mostrarMensaje("Elemento no encontrado");
			return false;
		}

		mezcla.aplicarEfectos(jugador);
		return true;
	}

	// Persistencia
	toJSON() {
		return {
			nombre: this.nombre,
			tipo: this.tipo,
			maxJugadores: this.maxJugadores,
			bebidas: this._bebidas.map((b) => b.toJSON()),
			mezclas: this._mezclas.map((m) => m.toJSON()),
			jugadores: this._jugadores.map((j) => j.toJSON()),
		};
	}

	static fromJSON(data) {
		const sala = new Sala(data.nombre, data.tipo, data.maxJugadores);
		data.bebidas.forEach((b) => sala.addBebida(Bebida.fromJSON(b)));
		data.mezclas.forEach((m) => sala.addMezcla(Mezcla.fromJSON(m)));
		data.jugadores.forEach((j) => sala.addJugador(Jugador.fromJSON(j)));
		return sala;
	}
}

// Ejemplo de uso completo
function demo() {
	// Crear sala
	const salaFiesta = new Sala("Fiesta VIP", "Social", 10);

	// Crear jugadores
	const ana = new Jugador("Ana", 100);
	const luis = new Jugador("Luis", 50);

	// Suscribirse a eventos
	salaFiesta
		.on("jugadorAdded", (jugador) => {
			console.log(`Evento: ${jugador.nombre} se unió a la sala`);
		})
		.on("bebidaAdded", (bebida) => {
			console.log(`Evento: Nueva bebida disponible - ${bebida.nombre}`);
		});

	// Añadir jugadores
	salaFiesta.addJugador(ana).addJugador(luis);

	// Crear y añadir bebidas
	const cerveza = new Bebida("Cerveza", 5, 2);
	const vino = new Bebida("Vino", 12, 5, { puntos: 10 });
	const agua = new Bebida("Agua Mineral", 0, 1, { resistencia: 20 });

	salaFiesta.addBebida(cerveza).addBebida(vino).addBebida(agua);

	// Crear y añadir mezcla
	const cubaLibre = new Mezcla("Cuba Libre", new Bebida("Ron", 40, 8), new Bebida("Cola", 0, 2));
	salaFiesta.addMezcla(cubaLibre);

	// Interacciones
	salaFiesta.consumirBebida(ana.id, "Vino");
	salaFiesta.consumirMezcla(luis.id, "Cuba Libre");

	// Mostrar info
	console.log("Información de la sala:", salaFiesta.info);
	console.log("Jugador Ana:", ana.toJSON());

	// Persistencia demo
	const savedData = salaFiesta.toJSON();
	const loadedSala = Sala.fromJSON(savedData);
	console.log("Sala cargada:", loadedSala.info);
}

// Ejecutar demo
demo();
