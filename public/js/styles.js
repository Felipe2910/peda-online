document.addEventListener("DOMContentLoaded", () => {
	const addClasses = (selector, classes) => {
		document.querySelectorAll(selector).forEach((el) => el.classList.add(...classes));
	};

	const removeClasses = (selector, classes) => {
		document.querySelectorAll(selector).forEach((el) => el.classList.remove(...classes));
	};

	// Estilos base
	addClasses("button", [
		"transition-colors",
		"duration-200",
		"font-medium",
		"disabled:opacity-50",
		"disabled:cursor-not-allowed",
	]);
	addClasses("input", ["focus:ring-2", "focus:ring-indigo-500", "focus:border-transparent"]);

	// Estilos componentes
	addClasses(".btn", [
		"bg-indigo-600",
		"hover:bg-indigo-700",
		"text-white",
		"py-2",
		"px-4",
		"rounded-lg",
		"cursor-pointer",
	]);
	addClasses(".btn-round", [
		"rounded-full",
		"w-12",
		"h-12",
		"flex",
		"items-center",
		"justify-center",
		"text-xl",
	]);
	addClasses(".selected", [
		"bg-white",
		"text-indigo-600",
		"border-2",
		"border-indigo-600",
		"rounded-full",
	]);

	removeClasses(".selected", [
		"bg-indigo-600",
		"text-white",
		"rounded-lg",
		"cursor-pointer",
		"hover:bg-indigo-700",
	]);

	addClasses(".input", [
		"w-full",
		"p-3",
		"bg-gray-700",
		"text-white",
		"rounded-lg",
		"placeholder-gray-400",
	]);
	addClasses(".card", [
		"p-6",
		"bg-gray-800",
		"rounded-xl",
		"shadow-xl",
		"backdrop-blur-sm",
		"border",
		"border-gray-700",
	]);

	// Otros estilos específicos
	addClasses(".card-sala", [
		"p-4",
		"bg-gradient-to-r",
		"from-slate-800",
		"to-slate-700",
		"rounded-lg",
		"shadow-lg",
		"grid",
		"grid-cols-2",
		"relative",
	]);
	addClasses(".card-sala-title", ["text-xl", "font-semibold", "text-white"]);
	addClasses(".card-sala-jugadores-activos", ["text-sm", "text-gray-400", "col-span-2"]);
	addClasses(".jugador-box", [
		"flex",
		"items-center",
		"p-2",
		"gap-2",
		"bg-gray-800",
		"rounded-lg",
		"shadow-lg",
	]);
	addClasses(".accion-btn", [
		"bg-gray-700",
		"hover:bg-gray-800",
		"py-2",
		"px-4",
		"rounded-full",
		"cursor-pointer",
	]);
	addClasses(".btn-outline", [
		"bg-gradient-to-r",
		"from-blue-500",
		"via-green-700",
		"to-emerald-800",
		"text-white",
		"border",
		"border-2",
		"border-blue-600",
		"py-2",
		"px-4",
		"rounded-full",
	]);
});
