import {Response , Request} from 'express';
import {validationResult} from 'express-validator';
import {castomError} from '../../errors/castomErrorsFromValidate';
import { UserInputModel } from '../types/users-type';
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

    res.status(201).send(result)


}

export async function getUsersController(req: Request, res: Response) {

}

export async function deleteUserByIdController(req: Request, res: Response) {

}