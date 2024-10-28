import express from "express";
import cors from "cors";
import connectionbd from "./config/bd.config.js";
import indexRouter from "./routes/index.routes.js";
import { createDepartment } from "./controllers/department.controller.js";
import ValidateRoutes from "./middlewares/index.middelware.js";
import { obtainBirds } from "./controllers/bird.controller.js";
import { url_ngrok } from "./config/ngrok.config.js";
import ngrok from "@ngrok/ngrok";

async function main() {
    try {
        const server = express();
        await connectionbd();
        await obtainBirds();
        await createDepartment();
        server.use(express.json());
        server.use(cors());
        server.use(indexRouter);
        server.use(ValidateRoutes);
        const PORT = 3000;
        server.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    //     ngrok.connect({ addr: PORT, authtoken: url_Ngrok.token})
	// .then(listener => console.log(`Ingress established at: ${listener.url()}`));
    } catch (error) {
        console.log("Unable to connect to the database", error);
    }
}

main();
