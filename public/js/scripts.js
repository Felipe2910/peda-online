class SalaManager {
	constructor() {
		this.state = {
			sala: {
				jugadores: 2,
				tipo: "Pública",
				nombre: "",
				actual: null,
			},
			tema: "default",
		};

		this.init();
	}

	init() {
		this.setupEventListeners();
		this.setupNavigation();
		this.cargarTema();
		this.renderSalas();
	}

	setupEventListeners() {
		document.addEventListener("DOMContentLoaded", () => {
			this.setupButtonGroup("#jugadores-opciones", "jugadores", parseInt);
			this.setupButtonGroup("#tipo-opciones", "tipo");

			document
				.getElementById("unirse-a-sala-form")
				.addEventListener("submit", (e) => this.handleUnirseSala(e));
			document
				.getElementById("crear-sala-form")
				.addEventListener("submit", (e) => this.handleCrearSala(e));

			document.querySelectorAll(".tema-btn").forEach((btn) => {
				btn.addEventListener("click", (e) => this.cambiarTema(e.target.dataset.tema));
			});
		});
	}

	setupNavigation() {
		window.addEventListener("popstate", (e) => {
			if (e.state?.seccion) this.cambiarSeccion(e.state.seccion);
		});

		// Cargar sección inicial desde el hash
		const seccionInicial = window.location.hash.substr(1) || "menu";
		this.cambiarSeccion(seccionInicial);
	}

	setupButtonGroup(container, property, formatter = (v) => v) {
		document.querySelectorAll(`${container} .btn`).forEach((btn) => {
			btn.addEventListener("click", () => {
				const valor = formatter(btn.textContent.trim());
				this.actualizarEstado(property, valor);
				btn.parentNode.querySelectorAll(".btn").forEach((b) => b.classList.remove("selected"));
				btn.classList.add("selected");
			});
		});
	}

	actualizarEstado(clave, valor) {
		this.state.sala[clave] = valor;
		this.actualizarUI(clave);
	}

	actualizarUI(clave) {
		switch (clave) {
			case "jugadores":
				document.querySelectorAll("#jugadores-opciones .btn").forEach((btn) => {
					btn.classList.toggle("selected", parseInt(btn.textContent) === this.state.sala.jugadores);
				});
				break;
			case "tipo":
				document.querySelectorAll("#tipo-opciones .btn").forEach((btn) => {
					btn.classList.toggle("selected", btn.textContent.trim() === this.state.sala.tipo);
				});
				break;
		}
	}

	async handleCrearSala(e) {
		e.preventDefault();
		const form = e.target;
		const nombreInput = form.querySelector("#nombre-sala");
		const loader = form.querySelector(".btn-loader");

		try {
			form.classList.add("loading");
			loader.classList.remove("hidden");

			const nombre = nombreInput.value.trim();
			if (!this.validarNombreSala(nombre)) {
				throw new Error("Nombre inválido (3-20 caracteres alfanuméricos)");
			}

			// Simular creación de sala
			const nuevaSala = {
				id: Math.random().toString(36).substr(2, 9).toUpperCase(),
				nombre,
				...this.state.sala,
			};

			this.mostrarFeedbackExito(`Sala "${nombre}" creada exitosamente!`);
			this.cambiarSeccion("sala");
			this.state.sala.actual = nuevaSala.id;
		} catch (error) {
			this.mostrarError(error.message, nombreInput);
		} finally {
			form.classList.remove("loading");
			loader.classList.add("hidden");
		}
	}

	mostrarFeedbackExito(mensaje) {
		const feedback = document.getElementById("crear-sala-resumen");
		feedback.classList.remove("hidden", "bg-red-800");
		feedback.classList.add("bg-green-800");
		feedback.textContent = mensaje;
		setTimeout(() => feedback.classList.add("hidden"), 3000);
	}

	cambiarTema(nuevoTema) {
		document.documentElement.dataset.tema = nuevoTema;
		this.state.tema = nuevoTema;
		localStorage.setItem("tema", nuevoTema);

		document.querySelectorAll(".tema-btn").forEach((btn) => {
			btn.classList.toggle("active", btn.dataset.tema === nuevoTema);
		});
	}

	cargarTema() {
		const temaGuardado = localStorage.getItem("tema") || "default";
		this.cambiarTema(temaGuardado);
	}
}

// Inicializar la aplicación
const pedaApp = new SalaManager();
