import {Router, Request, Response, NextFunction} from 'express';
import {methodsDB} from '../db/db';
import {CastomErrors} from '../errors/castomErrorsObject';

const errors: CastomErrors = {
    errorsMessages: []
}

export const videoRolter: Router = Router();

videoRolter.get('/', (req: Request, res: Response) => {
    res.status(200).send(methodsDB.getVideo());
})

videoRolter.get('/:id', (req: Request, res: Response) => {
    const result = methodsDB.getVideoById(+req.params.id);
    if(result === 'NOT FOUND') res.send(404)
    res.status(200).type('text/plain').send(result);
})

videoRolter.post('/', titleAndAfthorValidate, videoFormatValidator, flagForDownload, minMaxAge, allowedProperties, (req: Request, res: Response) => {
    const result = methodsDB.createVideo(req.body)
    res.status(201).type('tex/plain').send(result)
})

videoRolter.delete('/:id', (req: Request, res: Response) => {
    const result = methodsDB.deleteById(+req.params.id);
    if(result) {
        res.send(204)
    } else {
        res.send(404)
    }
    
})

videoRolter.put('/:id', titleAndAfthorValidate, videoFormatValidator, flagForDownload, minMaxAge, (req: Request, res: Response) => {
    const result = methodsDB.updateDB(+req.params.id, req.body);
    if(result === 'not found') {
        res.send(404)
    } else if(result === 'update') {
        res.send(204)
    }
    
})


function titleAndAfthorValidate(req: Request, res: Response, next: NextFunction) {
    // if(!req.body.title || !req.body.author|| req.body.title === null || req.body.author === null) { // если нет свойства title или author
    //     errors.errorsMessages = [];
    //     errors.errorsMessages.push({message: 'bad request, not faund title or author', field: 'title'});
    //     res.status(400).type('text/plain').send(errors);
    // } 

    if(!req.body.title) {
        errors.errorsMessages = [];
        errors.errorsMessages.push({message: 'bad request, not faund title or author', field: 'title'});
        res.status(400).type('text/plain').send(errors);
        // errors.errorsMessages = [];
    }

    if(!req.body.author) {
        errors.errorsMessages = [];
        errors.errorsMessages.push({message: 'bad request, not faund title or author', field: 'author'});
        res.status(400).type('text/plain').send(errors);
        // errors.errorsMessages = [];
    }

    if(req.body.title === null) {
        errors.errorsMessages = [];
        errors.errorsMessages.push({message: 'bad request, not faund title or author', field: 'title'});
        res.status(400).type('text/plain').send(errors);
        // errors.errorsMessages = [];
    }

    if(req.body.author === null) {
        errors.errorsMessages = [];
        errors.errorsMessages.push({message: 'bad request, not faund title or author', field: 'author'});
        res.status(400).type('text/plain').send(errors);
        // errors.errorsMessages = [];
    }




    
    else if(!req.body.title.trim() || !req.body.author.trim()) { // если свойства title или author пусто
        errors.errorsMessages = [];
        errors.errorsMessages.push({message: 'bad request, title and author fields cannot be empty', field: 'fild author or title empty'});
        res.status(400).type('text/plain').send(errors) ;
        // errors.errorsMessages = [];
    } else if(req.body.title.length > 40 || req.body.author.length > 20) {
        errors.errorsMessages = [];
        errors.errorsMessages.push(
            {
                message: `the title field cannot be longer than 40 characters, the author field cannot be longer than 20 characters`, 
                field: 'maximum length of author or title field exceeded'
            });
        res.status(400).type('text/plain').send(errors);
        // errors.errorsMessages = [];
    } else {
        next();
    }

}

function videoFormatValidator(req: Request, res: Response, next: NextFunction) {
    let formatFlag: string[] | undefined = req.body.availableResolutions;

    if(formatFlag === undefined) {
        req.body.availableResolutions = ['P144'];
    } else if(formatFlag.length === 0) {
        errors.errorsMessages = [];
        errors.errorsMessages.push(
            {
                message: `bad request, field availableResolutions empty`, 
                field: 'availableResolutions'
            });
        res.status(400).type('text/plain').send(errors);
    } 
    else if(formatFlag.length > 0) {
        const validateAvailableResolutions: string[] = []; 
        for(let i of formatFlag) {
            methodsDB.format.find((value) => {
                if(value === i) {
                    // проверка на существование формата в массиве
                    if(validateAvailableResolutions.includes(value)) {
                        return
                    }
                    validateAvailableResolutions.push(value)
                } else if(!methodsDB.format.includes(i)) {
                    errors.errorsMessages = [];
                    errors.errorsMessages.push(
                        {
                            message: `bad request, incorrect format`, 
                            field: 'invalid format field availableResolution'
                        }
                    );
                    res.status(400).type('text/plain').send(errors);
                }
            })
        } 
        req.body.availableResolutions = validateAvailableResolutions;
        
        // for(let i of methodsDB.format) { // поиск по базе
        //     formatFlag.find((value) => { // перебираем полученные разрешения из запроса
        //         // если в базе есть то добавляем 
        //         if(value === i) {
        //             // проверка на существование формата в массиве
        //             // if(validateAvailableResolutions.includes(value)) {
        //             //     return
        //             // }
        //             // validateAvailableResolutions.push(value)
        //         // } else if(!methodsDB.format.includes(value) ) { // если в базе нет значения который мы получили от фронта
        //             // errors.errorsMessages = [];
        //             // errors.errorsMessages.push(
        //             //     {
        //             //         message: `bad request, incorrect format`, 
        //             //         field: 'invalid format field availableResolution'
        //             //     }
        //             // );
        //             // res.status(400).type('text/plain').send(errors);
        //             // errors.errorsMessages = [];
        //         // }
        //     })
        // 
        // }
        // req.body.availableResolutions = validateAvailableResolutions;
    }
    next();
}

function flagForDownload(req: Request, res: Response, next: NextFunction) {
    if(!req.body.canBeDownloaded) {
        req.body.canBeDownloaded = false;
    }

    next()
}

function minMaxAge(req: Request, res: Response, next: NextFunction) {
    if(!req.body.minAgeRestriction && req.body.minAgeRestriction !== 0) {
        req.body.minAgeRestriction = null;
    } else if(req.body.minAgeRestriction > 18 || req.body.minAgeRestriction <= 0) {           
        errors.errorsMessages = [];
                errors.errorsMessages.push(
                    {
                        message: `bad request, minAgeRestriction field is greater or less than the allowed value`, 
                        field: 'minAgeRestriction minimum 1, maximum 18'
                    }
                )

        res.status(400).type('tex/plain').send(errors)
    }

    next()
}

function allowedProperties(req: Request, res: Response, next: NextFunction) {
    for(let i in req.body) {
        let trusty = methodsDB.permissionsProperty.find((element) => element === i);
        if(!trusty) {
            delete req.body[i]
        }   
    }

    next()
}

