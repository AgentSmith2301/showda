import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';

export const app = express();

const videosRouter = express.Router();
const blogsRouter = express.Router();

videosRouter.get('/', (req: Request, res: Response) => {
    res.send('there should be videos here');
});

app.use(bodyParser({}));  // в экспресс это делает express.json()
app.use('/videos', videosRouter);
app.use('/blogs', blogsRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello back-end HomeWorks in it-incubator!!!')
});

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    // await videosLocalRepository.deleteAll();
    // await blogsLocalRepository.deleteAll();
    // res.sendStatus(CodeResponsesEnum.Not_content_204)
});



