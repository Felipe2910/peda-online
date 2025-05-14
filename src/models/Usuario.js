class Usuario {
	constructor(nombre, icono, resistencia) {
		this.nombre = nombre;
		this.icono = icono;
		this.resistencia = resistencia;
		this.alcoholEnSangre = 0;
		this.estado = "Sobrio";
		this.medallas = 0;
	}

	beber(bebida) {
		this.alcoholEnSangre += bebida.grados;
		this.evaluarEstado();
	}

	evaluarEstado() {
		const porcentaje = this.alcoholEnSangre / this.resistencia;
		if (porcentaje < 0.2) this.estado = "Contento";
		else if (porcentaje < 0.5) this.estado = "Eufórico";
		else if (porcentaje < 0.9) this.estado = "Borracho";
		else this.estado = "Inconsciente";
	}
}

export default Usuario;
