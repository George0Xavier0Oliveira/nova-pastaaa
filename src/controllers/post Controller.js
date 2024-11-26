import { getTodosPosts , criarPost, atualizarPost} from "../models/postModels.js";
import fs from "fs";
import gerarDescricaoComGemini from "../service/serviceGemini.js";

export async function listarPosts (req, res) {
    const posts = await getTodosPosts()
    res.status(200).json(posts);
}
export async function postarNovoPost(req,res) {
    const new_post = req.body;
    try {
        const post_recent = await criarPost(new_post);
        res.status(200).json(post_recent);
    }
    catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    };
};
export async function uploadImagem(req,res) {
    const new_post = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };
    try {
        const post_recent = await criarPost(new_post);
        const imagemAtualizada = `uploads/${post_recent.insertedId}.png`
        fs.renameSync(req.file.path, imagemAtualizada)
        res.status(200).json(post_recent);
    }
    catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    };
};

export async function atualizarNovoPost(req,res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imageBuffer)
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);  
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
};