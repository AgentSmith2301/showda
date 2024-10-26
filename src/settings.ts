import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {videosLocalRepository} from './repositories/videos-rerository';
import {blogsLocalRepository} from './repositories/blogs-repository';

export const app = express();
// отключение cache в express
app.disable('etag');

const videosRouter = express.Router();
const blogsRouter = express.Router();

app.use(bodyParser({}));  // в экспресс это делает express.json()
app.use('/videos', videosRouter);
app.use('/blogs', blogsRouter);

// главная страница
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello back-end HomeWorks in it-incubator!!!')
});

// (/blogs)
blogsRouter.get('/', (req: Request, res: Response) => {
    res.send('what are you looking at, this is a blog')
});

// (/videos)
videosRouter.get('/', (req: Request, res: Response) => {
    const result = videosLocalRepository.getAll();
    res.status(200).type('text/plain').send(result);
})

// получить видео по id
videosRouter.get('/:id', (req: Request, res: Response) => {
    const result = videosLocalRepository.getById(+req.params.id);
    if(result == 'not find') {
        res.status(404);
    }
    res.status(200).type('text/plain').send(result);
});

// массив разрешенных свойств
const permissionsProperty = ['title', 'author',  'canBeDownloaded',  'minAgeRestriction',  'availableResolutions'];
// массив видеоформатов
const videoFormats = [ 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' ];

//  изменить видео по id
videosRouter.put('/:id', (req: Request, res: Response) => {
    const result = videosLocalRepository.getById(+req.params.id);
    if(result == 'not find') {
        res.status(404);
    } else {
        if(req.body.title) {
            result.title = req.body.title;
        }
        if(req.body.author) {
            result.author = req.body.author;
        }        
    }
    res.status(200).type('text/plain').send(result);
});

// создать видео
videosRouter.post('/', (req: Request , res: Response) => {
    // возвращаем проверенные свойства , для отправки в репозиторий (все разрешенные свойства)
    let property: any[] = [];
    // отфильтрованный массив с форматами видео от клиента
    let resolutions: string[] = [];
    // проверка на разрешение форматов
    for(let i of req.body.availableResolutions) {
        let trusty = videoFormats.find((element) => element === i);
        if(trusty) {
            resolutions.push(trusty);
        }   
    }
    
    // проверка на не пустые значения массива с форматами видео
    if(resolutions.length === 0) {
        res.status(400).type('text/plain').send({"errorsMessages": 
            [{"message": "bad request, transferred video formats are not supported","fieled":"wrong video format"}]
        })        
    }
    
    // проверка на существование обязательных свойств
    if(!req.body.title || !req.body?.author || !req.body.availableResolutions) {
        res.status(400).type('text/plain').send({"errorsMessages": 
            [{"message": "bad request, not faund title, author or format video","fieled":"title, author or format video required fields"}]
        })
    }
    
    // проверка на не пустые значения обязательных свойств
    if(!req.body.title.trim() || !req.body.author.trim() || req.body.availableResolutions.length === 0) {
        res.status(400).type('text/plain').send({"errorsMessages": 
            [{"message": "bad request, the title, author and format video fields cannot be empty","fieled":"title, author or format video required fields"}]
        })        
    }
    
    // проверка на длинну заголовков
    if(req.body.title.length > 40 || req.body.author.length > 20) {
        res.status(400).type('text/plain').send({"errorsMessages": 
            [
                {
                    "message": "bad request, title or author is longer than allowed value",
                    "fieled": "title length no more than 40 characters, text length no more than 20 characters"
                }
            ]
        })
    }

    // создать проверку на входные данные , создать только разрешенное
    for(let i in req.body) {
        let tumb = permissionsProperty.includes(i);
        // если свойство availableResolutions то передаем массив отфильтрованных даных
        if(i === 'availableResolutions') {
            property.push(['availableResolutions' , resolutions])
        }
        
        // если свойство есть в объекте и это не availableResolutions то передаем значение
        if(tumb && i !== 'availableResolutions') property.push([i, req.body[i]])
    }

    // из массива в объект 
    let transformAndCheck = Object.fromEntries(property);
    // запрос в репозиторий , который вернет объект с значениями 
    let flag = videosLocalRepository.createVideo(transformAndCheck);
    // если возвращается true в объекте flag.dan то отправляем ответ клиенту
    if(flag.dan) {
        res.status(201).set('Content-type','text/plain');
        let newObject = videosLocalRepository.getById(flag.id)
        res.send(newObject);
    }
    
})

// TODO сделать удаление всех данных из базы
app.delete('/testing/all-data', async(req: Request, res: Response) => {
    // при переходе должны быть удалены все данные
    
    const result = await videosLocalRepository.deleteAll();

    res.send(result);


    // await blogsLocalRepository.deleteAll();
    // res.sendStatus(CodeResponsesEnum.Not_content_204)
});




