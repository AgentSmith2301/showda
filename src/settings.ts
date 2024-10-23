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
});
// получить видео по id
videosRouter.get('/:id', (req: Request, res: Response) => {
    const result = videosLocalRepository.getById(+req.params.id);
    console.log('result -->', result);
    if(result == 'not find') {
        res.status(404).end('not find');
    }
    res.status(200).type('text/plain').send(result);
});

// создать видео
videosRouter.post('/', (req: Request , res: Response) => {
    if(!req.body.title || !req.body.author) {
        
    }
    let {title, author, availableResolutions} = req.body;
    let flag = videosLocalRepository.createVideo(title, author, availableResolutions);
    if(flag.dan) {
        res.status(201).type('text/plain');
        let newObject = videosLocalRepository.getById(flag.id)
        res.send(newObject);

    } else {
        res.status(400).send('Bad Request')
    }
})

app.delete('/testing/all-data', async(req: Request, res: Response) => {
    // при переходе должны быть удалены все данные
    
    const result = await videosLocalRepository.deleteAll();

    res.send(result);


    // await blogsLocalRepository.deleteAll();
    // res.sendStatus(CodeResponsesEnum.Not_content_204)
});




