import {Router, Request, Response} from 'express';
import {methodsDB} from '../db/db';
import {CastomErrors} from '../errors/castomErrorsObject';

const errors: CastomErrors = {
    errorsMessages: []
}

export const videoRolter: Router = Router();

videoRolter.get('/', (req: Request, res: Response) => {
    res.status(200).send(methodsDB.getVideo());
})

videoRolter.post('/', (req: Request, res: Response) => {
    if(!req.body.title || !req.body.author) {
        errors.errorsMessages = [];
        errors.errorsMessages.push({message: 'bad request, not faund title or author', field: 'fild author or title not faund'});
        res.status(400).type('text/plain').send(errors);
        // errors.errorsMessages = [];
    } else if(!req.body.title.trim() || !req.body.author.trim()) {
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
    }
    
    // работа с форматом видео
    let formatFlag: string[] | undefined = req.body.availableResolutions;

    if(formatFlag === undefined) {
        req.body.availableResolutions = ['P144'];
    } else if(formatFlag.length === 0) {
        errors.errorsMessages = [];
        errors.errorsMessages.push(
            {
                message: `bad request, field availableResolutions empty`, 
                field: 'field availableResolutions empty'
            });
        res.status(400).type('text/plain').send(errors);
    } 
    else if(formatFlag.length > 1) {
        const validateAvailableResolutions: string[] = []; 
        for(let i of methodsDB.format) {
            formatFlag.find((value) => {
                // если в базе есть то добавляем 
                if(value === i) {
                    // проверка на существование формата в массиве
                    if(validateAvailableResolutions.includes(value)) {
                        return
                    }
                    validateAvailableResolutions.push(value)
                } else if(!methodsDB.format.includes(value) ) {
                    errors.errorsMessages = [];
                    errors.errorsMessages.push(
                        {
                            message: `bad request, incorrect format`, 
                            field: 'invalid format field availableResolution'
                        }
                    );
                    res.status(400).type('text/plain').send(errors);
                    // errors.errorsMessages = [];
                }
            })
            
        }
        req.body.availableResolutions = validateAvailableResolutions;

        // если в запросе нет поля canBeDownloaded , создаем его и даем значение по умолчанию false
        if(!req.body.canBeDownloaded) {
            req.body.canBeDownloaded = false;
        }

        // если в запросе нет поля minAgeRestriction , создаем его и даем значение по умолчанию null (максим 18 , мин 1)
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

        // проверка на разрешение свойства
        for(let i in req.body) {
            let trusty = methodsDB.permissionsProperty.find((element) => element === i);
            if(!trusty) {
                delete req.body[i]
            }   
        }
        
        // отправляем объект в базу
        const result = methodsDB.createVideo(req.body)
        
        
        // вернуть ответ
        res.status(201).type('tex/plain').send(result)
    }

})




