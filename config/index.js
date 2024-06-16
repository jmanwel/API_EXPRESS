import dotenv from "dotenv";
dotenv.config();

const { NODE_ENV, PORT, MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOSTNAME, MONGO_DATABASE, SECRET_KEY } = process.env

const config = {
    dev: NODE_ENV !== "production",
    port: PORT || 3000,
    dataBaseUrl: `mongodb+srv://${ MONGO_USERNAME }:${ MONGO_PASSWORD }@${ MONGO_HOSTNAME }/?retryWrites=true&w=majority`,
    dataBaseName: MONGO_DATABASE,
    secretKey: SECRET_KEY
}

export default config;