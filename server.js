const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

const salas = {};
const bebidasBase = [
	{ nombre: "Cerveza", alcohol: 4.5 },
	{ nombre: "Tequila", alcohol: 38 },
	{ nombre: "Mezcal", alcohol: 45 },
	{ nombre: "Aguardiente", alcohol: 29 },
	{ nombre: "Coco con piquete", alcohol: 12 },
	{ nombre: "Jaguar rojo", alcohol: 40 },
	{ nombre: "Chelada con chamoy", alcohol: 9 },
	{ nombre: "Mojito de pozol", alcohol: 10 },
	{ nombre: "Shots encadenados", alcohol: 50 },
];

io.on("connection", (socket) => {
	console.log("Usuario conectado:", socket.id);

	socket.on("registrar_usuario", ({ nombre, icono }, cb) => {
		socket.data.usuario = {
			id: socket.id,
			nombre,
			icono,
			resistencia: 100,
			alcoholEnSangre: 0,
			estado: "Sobrio",
			medallas: 0,
			eliminado: false,
			sala: null,
		};
		cb(socket.data.usuario);
	});

	socket.on("crear_sala", ({ tipo, bebidasSeleccionadas }, cb) => {
		const codigo = Math.random().toString(36).substring(2, 7);
		const usuario = socket.data.usuario;
		usuario.sala = codigo;

		const sala = {
			codigo,
			tipo,
			jugadores: [usuario],
			host: socket.id,
			estado: "esperando",
			bebidas: bebidasBase.filter((b) => bebidasSeleccionadas.includes(b.nombre)),
			ronda: 1,
			maxRondas: 6,
			inactivo: setTimeout(() => destruirSala(codigo), 10 * 60 * 1000),
		};

		salas[codigo] = sala;
		socket.join(codigo);
		cb({ codigo, sala });
		io.to(codigo).emit("sala_actualizada", sala);
	});

	socket.on("unirse_sala", ({ codigo }, cb) => {
		const sala = salas[codigo];
		if (!sala || sala.estado !== "esperando") return cb({ error: "No se puede unir a la sala." });

		const usuario = socket.data.usuario;
		usuario.sala = codigo;
		usuario.resistencia = 100;
		usuario.alcoholEnSangre = 0;
		usuario.estado = "Sobrio";
		usuario.eliminado = false;

		sala.jugadores.push(usuario);
		socket.join(codigo);
		cb({ sala });
		io.to(codigo).emit("sala_actualizada", sala);
	});

	socket.on("iniciar_peda", (codigo) => {
		const sala = salas[codigo];
		if (!sala || socket.id !== sala.host || sala.jugadores.length < 3) return;
		sala.estado = "jugando";
		clearTimeout(sala.inactivo);
		iniciarRonda(sala);
	});

	socket.on("elegir_bebida", ({ codigo, bebida }) => {
		const sala = salas[codigo];
		const jugador = sala?.jugadores.find((j) => j.id === socket.id);
		if (jugador && !jugador.eliminado) {
			jugador.eleccion = bebida;
		}
	});

	socket.on("disconnect", () => {
		const usuario = socket.data.usuario;
		const sala = usuario?.sala ? salas[usuario.sala] : null;
		if (!sala) return;

		sala.jugadores = sala.jugadores.filter((j) => j.id !== socket.id);
		io.to(sala.codigo).emit("sala_actualizada", sala);

		if (sala.jugadores.length === 0) destruirSala(sala.codigo);
	});
});

function iniciarRonda(sala) {
	io.to(sala.codigo).emit("nueva_ronda", { ronda: sala.ronda, bebidas: sala.bebidas });
	setTimeout(() => {
		sala.jugadores.forEach((j) => {
			if (j.eliminado) return;
			const bebidaNombre = j.eleccion || elegirAleatoria(sala.bebidas);
			const bebida = sala.bebidas.find((b) => b.nombre === bebidaNombre);
			j.alcoholEnSangre += bebida.alcohol;
			j.estado = calcularEstado(j);
			if (j.alcoholEnSangre >= j.resistencia) j.eliminado = true;
			j.eleccion = null;
		});

		const vivos = sala.jugadores.filter((j) => !j.eliminado);
		if (sala.ronda >= sala.maxRondas || vivos.length <= 1) {
			finalizarPeda(sala, vivos);
		} else {
			sala.ronda++;
			io.to(sala.codigo).emit("sala_actualizada", sala);
			iniciarRonda(sala);
		}
	}, 10000);
}

function finalizarPeda(sala, vivos) {
	sala.estado = "finalizada";
	if (vivos.length === 1) {
		vivos[0].medallas++;
		io.to(sala.codigo).emit("ganador", vivos[0]);
	} else {
		io.to(sala.codigo).emit("todos_eliminados");
	}
	setTimeout(() => destruirSala(sala.codigo), 10000);
}

function destruirSala(codigo) {
	const sala = salas[codigo];
	if (!sala) return;
	io.to(codigo).emit("sala_destruida");
	sala.jugadores.forEach((j) => io.sockets.sockets.get(j.id)?.leave(codigo));
	delete salas[codigo];
}

function elegirAleatoria(arr) {
	return arr[Math.floor(Math.random() * arr.length)].nombre;
}

function calcularEstado(jugador) {
	const p = jugador.alcoholEnSangre / jugador.resistencia;
	if (p < 0.2) return "Contento";
	if (p < 0.5) return "Eufórico";
	if (p < 0.9) return "Borracho";
	return "Inconsciente";
}

server.listen(PORT, () => {
	console.log(`Servidor corriendo en puerto ${PORT}`);
});
