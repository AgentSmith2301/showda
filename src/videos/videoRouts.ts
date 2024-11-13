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
    if(result === 'NOT FOUND') {
        errors.errorsMessages.push(
            {
                message: `bad request, id not found`, 
                field: 'id'
            }
        )
    }
    if(errors.errorsMessages.length > 0) {
        res.status(404).send(errors);
        errors.errorsMessages = [];
    } else {
        res.status(200).type('text/plain').send(result);
    }
    
})

videoRolter.post('/', titleAndAfthorValidate, videoFormatValidator, flagForDownload, minMaxAge, allowedProperties, (req: Request, res: Response) => {
    
    const result = methodsDB.createVideo(req.body)
    
    if(errors.errorsMessages.length === 0) {
        res.status(201).type('tex/plain').send(result)
    } else {
        res.status(400).send(errors)
        errors.errorsMessages = [];
    }

})

videoRolter.delete('/:id', (req: Request, res: Response) => {
    
    const result = methodsDB.deleteById(+req.params.id);
    if(result) {
        res.send(204)
    } else {
        errors.errorsMessages.push(
            {
                message: `bad request, id not found`, 
                field: 'id'
            }
        );
        res.status(404).send(errors)
        errors.errorsMessages = [];
    }
    
})

videoRolter.put('/:id', titleAndAfthorValidate, videoFormatValidator, flagForDownloadForPut, minMaxAge, (req: Request, res: Response) => {
    
    const result = methodsDB.updateDB(+req.params.id, req.body);
    // если с базы вернется ответ not found по запросу на id или были другие ошибки в других валидаторах то выдаст ошибку
    if(result === 'not found') {
        errors.errorsMessages.push(
            {
                message: `bad request, id not found`, 
                field: 'id'
            }
        );
        res.status(400).send(errors);
        errors.errorsMessages = [];
        
    } 
    if(errors.errorsMessages.length > 0) {
        res.status(400).send(errors)
        errors.errorsMessages = [];
    } else if(result === 'update' && errors.errorsMessages.length === 0) { // если ошибок нет и с базы вернется update , то возвращаем данные 
        res.send(204)
    }

    // создаем пустой объект массивов для дальнейшего использования
    errors.errorsMessages = [];
})


function titleAndAfthorValidate(req: Request, res: Response, next: NextFunction) {
    // errors.errorsMessages = [];

    if(req.body.title == null) {
        // errors.errorsMessages = [];
        errors.errorsMessages.push({message: 'title value cannot be null', field: 'title'});
        // res.status(400).type('text/plain').send(errors);
    }

    if(req.body.author == null) {
        // errors.errorsMessages = [];
        errors.errorsMessages.push({message: 'author value cannot be null', field: 'author'});
        // res.status(400).type('text/plain').send(errors);
    }

    if(req.body.title != null && !req.body.title) {
        // errors.errorsMessages = [];
        errors.errorsMessages.push({message: 'bad request, not faund title or author', field: 'title'});
        // res.status(400).type('text/plain').send(errors);
    }

    if(req.body.author != null && !req.body.author) {
        // errors.errorsMessages = [];
        errors.errorsMessages.push({message: 'bad request, not faund title or author', field: 'author'});
        // res.status(400).type('text/plain').send(errors);
    }
    
    if(req.body.title != null && !req.body.title.trim()) {
        // errors.errorsMessages = [];
        errors.errorsMessages.push({message: 'bad request, title and author fields cannot be empty', field: 'title'});
        // res.status(400).type('text/plain').send(errors) ;
    }

    if(req.body.author != null && !req.body.author.trim()) {
        // errors.errorsMessages = [];
        errors.errorsMessages.push({message: 'bad request, title and author fields cannot be empty', field: 'author'});
        // res.status(400).type('text/plain').send(errors) ;
    }
    
    if(req.body.title != null && req.body.title.length > 40) {
        // errors.errorsMessages = [];
        errors.errorsMessages.push(
            {
                message: `the title field cannot be longer than 40 characters, the author field cannot be longer than 20 characters`, 
                field: 'title'
            });
        // res.status(400).type('text/plain').send(errors);
    }

    if(req.body.author != null && req.body.author.length > 20) {
        // errors.errorsMessages = [];
        errors.errorsMessages.push(
            {
                message: `the title field cannot be longer than 40 characters, the author field cannot be longer than 20 characters`, 
                field: 'author'
            });
        // res.status(400).type('text/plain').send(errors);
    }
    
    // console.log(errors.errorsMessages.length, '<--- errors.errorsMessages.length')
    
    // if(errors.errorsMessages.length === 0){
    //     next();
    // } else {
    //     res.status(400).type('text/plain').send(errors);
    // }

    next();


}

function videoFormatValidator(req: Request, res: Response, next: NextFunction) {
    let formatFlag: string[] | undefined = req.body.availableResolutions;

    if(formatFlag === undefined) {
        req.body.availableResolutions = ['P144'];
    } else if(formatFlag.length === 0) {
        // errors.errorsMessages = [];
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
                    // errors.errorsMessages = [];
                    errors.errorsMessages.push(
                        {
                            message: `bad request, incorrect format`, 
                            field: 'availableResolutions'
                        }
                    );
                    res.status(400).type('text/plain').send(errors);
                }
            })
        } 
        req.body.availableResolutions = validateAvailableResolutions;
    }

    // if(errors.errorsMessages.length > 0) {
    //     // здесь можно вывести все ошибки (но прежде отключи очистку)
    //     return
    // } else {
    //     next();
    // }

    next();

    
}

function flagForDownload(req: Request, res: Response, next: NextFunction) {
    if(!req.body.canBeDownloaded) {
        req.body.canBeDownloaded = false;
    }

    // if(errors.errorsMessages.length > 0) {
    //     res.status(400).type('text/plain').send(errors);
    // } else {
    //     next();
    // }

    next();

}

function flagForDownloadForPut(req: Request, res: Response, next: NextFunction) {
    if(typeof req.body.canBeDownloaded !== 'boolean') {
        
        errors.errorsMessages.push(
            {
                message: `bad request, field canBeDownloaded not boolean`, 
                field: 'canBeDownloaded'
            }
        );
    }

    // if(errors.errorsMessages.length > 0) {
    //     res.status(400).type('text/plain').send(errors);
    // } else {
    //     next();
    // }

    next();

}

function minMaxAge(req: Request, res: Response, next: NextFunction) {
    if(!req.body.minAgeRestriction && req.body.minAgeRestriction !== 0) {
        req.body.minAgeRestriction = null;
    } else if(req.body.minAgeRestriction > 18 || req.body.minAgeRestriction <= 0) {           
        // errors.errorsMessages = [];
                errors.errorsMessages.push(
                    {
                        message: `bad request, minAgeRestriction field is greater or less than the allowed value`, 
                        field: 'minAgeRestriction'
                    }
                )

        // res.status(400).type('tex/plain').send(errors)
    }

    // if(errors.errorsMessages.length > 0) {
    //     // здесь можно вывести все ошибки (но прежде отключи очистку)
    //     return
    // } else {
    //     next();
    // }

    next();

}

function allowedProperties(req: Request, res: Response, next: NextFunction) {
    for(let i in req.body) {
        let trusty = methodsDB.permissionsProperty.find((element) => element === i);
        if(!trusty) {
            delete req.body[i]
        }   
    }

    // if(errors.errorsMessages.length > 0) {
    //     // здесь можно вывести все ошибки (но прежде отключи очистку)
    //     return
    // } else {
    //     next();
    // }

    next();

}

