import { MongoClient } from "mongodb";

export default async function conectarAoBanco(stringConexao){
    let mongoClient;

    try{
        mongoClient = new MongoClient(stringConexao);
        console.log('cConectando ao cluster do banco de dados');
        await mongoClient.connect();
        console.log('Conectado ao Mongo DB Atlas ');

        return mongoClient
    }
    catch (erro) {
        console.error('falha ao conectar com o banco: ',erro);
        process.exit();
    }
}