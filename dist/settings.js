"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const videos_rerository_1 = require("./repositories/videos-rerository");
exports.app = (0, express_1.default)();
// отключение cache в express
exports.app.disable('etag');
const videosRouter = express_1.default.Router();
const blogsRouter = express_1.default.Router();
exports.app.use((0, body_parser_1.default)({})); // в экспресс это делает express.json()
exports.app.use('/videos', videosRouter);
exports.app.use('/blogs', blogsRouter);
// главная страница
exports.app.get('/', (req, res) => {
    res.status(200).send('Hello back-end HomeWorks in it-incubator!!!');
});
// (/blogs)
blogsRouter.get('/', (req, res) => {
    res.send('what are you looking at, this is a blog');
});
// (/videos)
videosRouter.get('/', (req, res) => {
    const result = videos_rerository_1.videosLocalRepository.getAll();
    res.status(200).type('text/plain').send(result);
});
// видео по id
videosRouter.get('/:id', (req, res) => {
    console.log('req.params.id --> ', +req.params.id);
    const result = videos_rerository_1.videosLocalRepository.getById(+req.params.id);
    console.log('result -->', result);
    res.status(200).type('text/plain').send(result);
});
videosRouter.post('/', (req, res) => {
    let { title, author, availableResolutions } = req.body;
    let flag = videos_rerository_1.videosLocalRepository.createVideo(title, author, availableResolutions);
    // console.log(flag)
    if (flag.dan) {
        res.status(201).type('text/plain');
        let newObject = videos_rerository_1.videosLocalRepository.getById(flag.id);
        res.send(newObject);
        // console.log('hay')
    }
    else {
        res.status(400).send('Bad Request');
    }
});
exports.app.delete('/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // при переходе должны быть удалены все данные
    const result = yield videos_rerository_1.videosLocalRepository.deleteAll();
    res.send(result);
    // await blogsLocalRepository.deleteAll();
    // res.sendStatus(CodeResponsesEnum.Not_content_204)
}));
