import {Response , Request} from 'express';
import {validationResult} from 'express-validator';
import {castomError} from '../../errors/castomErrorsFromValidate';
import { SearchTermUsers, UserInputModel } from '../types/users-type';
import { usersServiceMethods } from '../service/users-service';

export async function postUsersController(req: Request, res: Response) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ 
            message: error.msg.message || error.msg,
            field: error.path
        }))
        filterErrors.map((value) => {
            castomError.errorsMessages.push(value);
        })
        
        res.status(400).send(castomError);
        castomError.errorsMessages = []; // очистка ошибок
        return
    } 
    
    const createUser: UserInputModel = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email
    }
    
    const result = await usersServiceMethods.createdUser(createUser)
    if(result) {
        res.status(201).send(result)
        return 
    }  else {
        res.status(400).json({errorsMessages: [{message: 'incorect login or email', field: 'login or email'}]});
        return
    }

}

export async function getUsersController(req: Request, res: Response) {
    
    let sortDirection: 1| -1 = -1 ;
    if(req.query.sortDirection === 'asc') {
        sortDirection = 1;
    } else {
        sortDirection = -1;
    }

    let searchLoginTerm: string | null = null;
    let searchEmailTerm: string | null = null;
    if(req.query.searchLoginTerm !== undefined) searchLoginTerm = req.query.searchLoginTerm.toString();
    if(req.query.searchEmailTerm !== undefined) searchEmailTerm = req.query.searchEmailTerm.toString();

    let reqFilter: SearchTermUsers = {
        sortBy: req.query.sortBy as string,
        sortDirection,
        pageNumber: Number(req.query.pageNumber),
        pageSize: +req.query.pageSize!,
        searchLoginTerm,
        searchEmailTerm
    };

    const result = await usersServiceMethods.getUsersByTerm(reqFilter);
    res.status(200).send(result);
}

export async function deleteUserByIdController(req: Request, res: Response) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ 
            message: error.msg.message || error.msg,
            field: error.path
        }))
        filterErrors.map((value) => {
            castomError.errorsMessages.push(value);
        })
        
        res.status(404).send(castomError);
        castomError.errorsMessages = []; // очистка ошибок
        return
    } 
    
    const result: boolean = await usersServiceMethods.deleteUserById(req.params.id);
    if(result === true) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}
