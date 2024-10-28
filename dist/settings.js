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
// получить видео по id
videosRouter.get('/:id', (req, res) => {
    const result = videos_rerository_1.videosLocalRepository.getById(+req.params.id);
    if (result == 'not find') {
        res.status(404);
    }
    res.status(200).type('text/plain').send(result);
});
// массив разрешенных свойств
const permissionsProperty = ['title', 'author', 'canBeDownloaded', 'minAgeRestriction', 'availableResolutions', 'createdAt', 'publicationDate'];
// массив видеоформатов
const videoFormats = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
//  изменить видео по id
videosRouter.put('/:id', (req, res) => {
    const result = videos_rerository_1.videosLocalRepository.getById(+req.params.id);
    if (result == 'not find') {
        res.status(404);
    }
    else {
        if (req.body.title) {
            result.title = req.body.title;
        }
        if (req.body.author) {
            result.author = req.body.author;
        }
    }
    res.status(200).type('text/plain').send(result);
});
// создать видео
videosRouter.post('/', (req, res) => {
    var _a;
    // автоматически создавать значения свойств createdAt и publicationDate (с разницей в один день)
    let date = new Date();
    let day = date.getDate();
    date.setDate(day - 1);
    req.body.createdAt = date.toISOString();
    req.body.publicationDate = new Date().toISOString();
    // если в запросе нет поля canBeDownloaded , создаем его и даем значение по умолчанию false
    if (!req.body.canBeDownloaded) {
        req.body.canBeDownloaded = false;
    }
    // если в запросе нет поля minAgeRestriction , создаем его и даем значение по умолчанию null (максим 18 , мин 1)
    if (!req.body.minAgeRestriction && req.body.minAgeRestriction !== 0) {
        req.body.minAgeRestriction = null;
    }
    else if (req.body.minAgeRestriction > 18 || req.body.minAgeRestriction <= 0) {
        res.status(400).send({ "errorsMessages": [
                {
                    "message": "bad request, minAgeRestriction field is greater or less than the allowed value",
                    "fieled": "minAgeRestriction minimum 1, maximum 18"
                }
            ]
        });
    }
    // возвращаем проверенные свойства , для отправки в репозиторий (все разрешенные свойства)
    let property = [];
    // отфильтрованный массив с форматами видео от клиента
    let resolutions = [];
    // проверка на разрешение форматов
    for (let i of req.body.availableResolutions) {
        let trusty = videoFormats.find((element) => element === i);
        if (trusty) {
            resolutions.push(trusty);
        }
    }
    // проверка на не пустые значения массива с форматами видео
    if (resolutions.length === 0) {
        res.status(400).type('text/plain').send({ "errorsMessages": [{ "message": "bad request, transferred video formats are not supported", "fieled": "wrong video format" }]
        });
    }
    // проверка на существование обязательных свойств
    if (!req.body.title || !((_a = req.body) === null || _a === void 0 ? void 0 : _a.author) || !req.body.availableResolutions) {
        res.status(400).type('text/plain').send({ "errorsMessages": [{ "message": "bad request, not faund title, author or format video", "fieled": "title, author or format video required fields" }]
        });
    }
    // проверка на не пустые значения обязательных свойств
    if (!req.body.title.trim() || !req.body.author.trim() || req.body.availableResolutions.length === 0) {
        res.status(400).type('text/plain').send({ "errorsMessages": [{ "message": "bad request, the title, author and format video fields cannot be empty", "fieled": "title, author or format video required fields" }]
        });
    }
    // проверка на длинну заголовков
    if (req.body.title.length > 40 || req.body.author.length > 20) {
        res.status(400).type('text/plain').send({ "errorsMessages": [
                {
                    "message": "bad request, title or author is longer than allowed value",
                    "fieled": "title length no more than 40 characters, text length no more than 20 characters"
                }
            ]
        });
    }
    // создать проверку на входные данные , создать только разрешенное
    for (let i in req.body) {
        let tumb = permissionsProperty.includes(i);
        // если свойство availableResolutions то передаем массив отфильтрованных даных
        if (i === 'availableResolutions') {
            property.push(['availableResolutions', resolutions]);
        }
        // если свойство есть в объекте и это не availableResolutions то передаем значение
        if (tumb && i !== 'availableResolutions')
            property.push([i, req.body[i]]);
    }
    // из массива в объект 
    let transformAndCheck = Object.fromEntries(property);
    // запрос в репозиторий , который вернет объект с значениями 
    let flag = videos_rerository_1.videosLocalRepository.createVideo(transformAndCheck);
    // если возвращается true в объекте flag.dan то отправляем ответ клиенту
    if (flag.dan) {
        res.status(201).set('Content-type', 'text/plain');
        let newObject = videos_rerository_1.videosLocalRepository.getById(flag.id);
        res.send(newObject);
    }
});
// TODO сделать удаление всех данных из базы
exports.app.delete('/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // при переходе должны быть удалены все данные
    const result = yield videos_rerository_1.videosLocalRepository.deleteAll();
    res.send(result);
    // await blogsLocalRepository.deleteAll();
    // res.sendStatus(CodeResponsesEnum.Not_content_204)
}));
