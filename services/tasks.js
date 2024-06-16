import { taskModel, userModel } from "../models/tasks.js";
import config from "../config/index.js";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

const { secretKey } = config;
const saltRounds = 10;
const SALT = await bcrypt.genSalt(saltRounds);

export const createTask = async (task) =>{
    const id = crypto.randomBytes(16).toString("base64Url");
    const createdAt = Date.now();
    const newTask = { ... task, id, createdAt, priority:0, status: "pending" };
    return taskModel.create(newTask);
};

export const getTasks = async () =>{
    return taskModel.find({}).sort({ priority: -1 });
};

export const getTask = async ( task_id ) =>{
    return taskModel.find({ id: task_id }).sort({ priority: -1 });
};

const getUsersByName = async ( u ) =>{
    return userModel.find({ username: u }).sort({ priority: -1 });
};

export const modifyTask = async ( str_params ) => {
    const filter = { id: str_params.id };    
    const update = { status: str_params.status, priority: str_params.priority, description: str_params.description };
    return taskModel.findOneAndUpdate( filter, update, {new: true} );
}

const validateUser =  async (u, p) =>{
    const user = await getUsersByName( u );
    if (user.length > 0){
        return new Promise((resolve, reject) => {
            bcrypt.compare(p, user[0].password, (err, result) => {
                if (err) reject(err);
                resolve(result ? 0 : 1);
            });
        });
    }
    else {
        return 1;
    }
    };        

export const createUser = async (user) =>{
    const u = await getUsersByName(user.username);    
    if (u.length == 0){
        const id = crypto.randomBytes(16).toString("base64Url");
        const username =user.username;
        const password = await bcrypt.hash(user.password, SALT);
        const newUser = { ... user, id, username, password };
        return userModel.create(newUser);
    }
    else {
        return 1;
    }
}

export const login = async (u, p) =>{
    const validUser =  await validateUser(u, p);
    if (validUser === 0) {
        const token = jsonwebtoken.sign({ u }, secretKey, { expiresIn: "5m" });
        return token;
    } else {        
        return 1;
        }
}