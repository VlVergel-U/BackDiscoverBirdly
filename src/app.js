import express from "express";
import cors from "cors";
import connectionbd from "./config/connectionbd.js";
import indexRouter from "./routes/index.routes.js";
import { createDepartment } from "./controllers/department.controller.js";

async function main() {
    try {
        const server = express();
        await connectionbd();
        await createDepartment();
        server.use(express.json());
        server.use(cors());
        server.use(indexRouter);
        const PORT = 3000;
        server.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log("Unable to connect to the database", error);
    }
}

main();
