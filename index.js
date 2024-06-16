import express from "express";
import taskRouter from "./routes/tasks.js";
import mongoose from "mongoose";
import config from "./config/index.js";
import { notFoundHandler, errorHandler } from "./utils/middlewares/errorMiddlewares.js";
const app = express();
const { port, dataBaseUrl, dataBaseName: dbName } = config;

//MIDDLEWARES
app.use(express.json());
//ROUTES
app.use("/tasks", taskRouter);
//CATCH404
app.use(notFoundHandler);
//ERRORHANDLER
app.use(errorHandler);

//CONNECT MONGO
app.listen( port, ()=>{
	mongoose.connect(dataBaseUrl, { dbName });
	console.log(`Server running on port: ${ port }`);
} );
