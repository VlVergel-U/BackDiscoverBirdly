import express from "express";
import cors from "cors";
import connectionbd from "./config/connectionbd.js";
import indexRouter from "./routes/index.router.js";

async function main() {
    try {
        const server = express();
        await connectionbd();
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
