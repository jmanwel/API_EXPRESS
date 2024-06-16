import express from "express";
import { getTasks, getTask, createTask, createUser, login, modifyTask } from "../services/tasks.js"
import { excludeEntityprops } from "../utils/excludeEntityProps.js";
import config from "../config/index.js";
import jsonwebtoken from "jsonwebtoken";

const { secretKey } = config;
const router = express.Router();

function validateData ( req, res, next ){
	if ( !req.body.description ){
		return res.status(400).json( { message: "Missing task data" } );
	} else {
		next();
	}
}

function validateModify ( req, res, next ){
	if ( !req.body.description || !req.body.status || !req.body.priority || !req.body.id ){
		return res.status(400).json( { message: "Missing task data" } );
	} else {
		next();
	}
}

function verifyToken(req, res, next) {
	const header = req.header("Authorization") || "";
	const token = header.split(" ")[1];
	if (!token) {
	  return res.status(401).json({ message: "Token not provied" });
	}
	try {
	  const payload = jsonwebtoken.verify(token, secretKey);
	  next();
	} catch (error) {
		  return res.status(403).json({ message: "Token not valid" });
	}
  }

router.get("/healthy", ( req, res )=>{
	res.status(200).json({ message: "Hello world!" })
});

router.get("/", verifyToken, async ( req, res, next )=>{
	try{
		const tasks = await getTasks();
		res.status(200).json( tasks.map( (t) => excludeEntityprops(t._doc) ) );
	}
	catch (error){
		next(error);
	}
});

router.get("/docs/:id", verifyToken, async ( req, res, next )=> {
	const { id } = req.params;
	try{
		const task = await getTask( id );
		console.log(`GET TASK BY ID ${ id }`);
		res.status(200).json( task.map( (t) => excludeEntityprops(t._doc) ) );
	}
	catch (error){
		next(error);
	}
});

router.post("/", verifyToken, validateData, async ( req, res, next )=>{ 
	try{
		const created_task = await createTask(req.body);
		res.status(201).json( excludeEntityprops(created_task._doc) );
	}
	catch (error){
		next(error)
	}
});
	
router.put("/docs/modify_doc", verifyToken, validateModify, async ( req, res )=>{ 
	try {
		const modified_task = await modifyTask( req.body );
		res.status(201).json( excludeEntityprops( modified_task._doc ) );
	}
	catch (error){
		next(error)
	}	
});

router.delete("/docs/:id", verifyToken, ( req, res )=> {
	const { id } = req.params;
	res.json({ message: `DELETE TASK WITH ID ${ id }` });
});

router.post("/register", async ( req, res, next )=>{ 
	try{				
		const created_user = await createUser(req.body);
		if ( created_user != 1){
			res.status(201).json({ message: `User: ${ created_user._doc.username } created OK!` } );
		}else {
			res.status(423).json({ message: `User already exist` } );
		}
	}
	catch (error){
		next(error)
	}
});

router.get("/users/:username", verifyToken, async ( req, res, next )=>{
	try{
		const { username } = req.params;
		const user = await getUsersByName(username);
		res.status(200).json( user.map( (u) => excludeEntityprops(u._doc) ) );
	}
	catch (error){
		next(error);
	}
});

router.post('/login', async (req, res, next)=>{
	const { username, password } = req.body;
	const token = await login( username, password );
	if ( token !== 1){
		res.status(200).json({ message: "Login OK", token: token });
	}
	else{
		res.status(401).json({ message: `user or password invalid` });
	}
  });

export default router;
