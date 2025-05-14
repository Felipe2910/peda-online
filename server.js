import express from "express";
import dotenv from "dotenv";
import salaRoutes from "./src/routes/salaRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.use("/api/salas", salaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});
