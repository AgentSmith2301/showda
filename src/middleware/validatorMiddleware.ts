import {param, body, query} from 'express-validator'
// import {Router, Response, Request, NextFunction} from 'express';

const postReqvestbodyValPosts = [
    body('title').exists().withMessage('this field is required').notEmpty().withMessage('field cannot be null or undefined')
    .escape().blacklist('!@#$%^&*();').isString().withMessage('value not a string').trim()
    .isLength({min:3, max:30}).withMessage('min length 3 and max 30'),
    
    body('shortDescription').exists().withMessage('this field is required').notEmpty().withMessage('field cannot be null or undefined')
    .escape().blacklist('!@#$%^&*();').isString().withMessage('value not a string').trim()
    .isLength({min:3, max:100}).withMessage('min length 3 and max 100'),

    body('content').exists().withMessage('this field is required').notEmpty().withMessage('field cannot be null or undefined').escape().blacklist('!@#$%^&*();').isString().withMessage('value not a string').trim()
    .isLength({min:3, max:1000}).withMessage('min length 3 and max 1000'),

    body('blogId').exists().withMessage('this field is required').notEmpty().withMessage('field cannot be null or undefined').escape().blacklist('!@#$%^&*();').isString().withMessage('value not a string').trim()
    .isLength({min:6, max:30}).withMessage('min length 6 and max 30'),
];

const postAndPutReqvestbodyValBlogs = [
    body('name').exists().withMessage('this field is required').notEmpty().withMessage('field cannot be null or undefined')
    .escape().blacklist('!@#$%^&*();').isString().withMessage('value not a string').trim()
    .isLength({min:3, max:15}).withMessage('min length 3 and max 15'),

    body('description').exists().withMessage('this field is required').notEmpty().withMessage('field cannot be null or undefined')
    .escape().blacklist('!@#$%^&*();').isString().withMessage('value not a string').trim()
    .isLength({min:3, max:500}).withMessage('min length 3 and max 500'),

    body('websiteUrl')
    .exists().withMessage('this field is required')
    .trim()
    .isLength({min:5, max:100}).withMessage('min length 3 and max 100')
    // .isURL().withMessage('field not URL')
    // .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('invalid URL format')
    // .isLength({min:5, max:100}).withMessage('min length 3 and max 100'),

    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('invalid URL format'),
];

const keysBySortBlogs = [ 'id', 'name', 'description', 'websiteUrl', 'createdAt', 'isMembership']

const blogsQueryValidation = [
    query('searchNameTerm').optional().toLowerCase(),
    query('sortBy')
        .customSanitizer(value => {
            let result;
            for(let i of keysBySortBlogs) {
                if(i === value) {
                    result = i
                }
            }
            return result
        })
        .default('createdAt'),
    query('sortDirection')
        .customSanitizer(value => {
            if(value === 'asc') {
                return value
            } else {
                return value = null
            }
        })
        .default('desc'),
    query('pageNumber').optional().toInt(),
    query('pageSize').toInt(),
];

let keysBySortPosts = ["id", "title", "shortDescription", "content", "blogId", "blogName", "createdAt"];

const postsQueryValidation = [
    query('sortBy')
        .customSanitizer(value => {
            let result;
            for(let i of keysBySortPosts) {
                if(i === value) {
                    result = i
                }
            }
            return result
        })
        .default('createdAt'),
    query('sortDirection')
        .customSanitizer(value => {
            if(value === 'asc') {
                return value
            } else {
                return value = null
            }
        })
        .default('desc'),
    query('pageNumber').toInt().default(1),
    query('pageSize').toInt().default(10),
];

const postFromBlogWithId = [
    param('blogId').exists().withMessage('this field is required').notEmpty().withMessage('field cannot be null or undefined'),
    
    body('title').exists().withMessage('this field is required').trim().withMessage('content not faund').notEmpty().withMessage('field cannot be null or undefined')
    .escape().blacklist('!@#$%^&*();').isString().withMessage('value not a string')
    .isLength({max:30}).withMessage('max length 30'),

    body('shortDescription').exists().withMessage('this field is required').notEmpty().withMessage('field cannot be null or undefined')
    .escape().blacklist('!@#$%^&*();').isString().withMessage('value not a string').trim()
    .isLength({max:100}).withMessage('min length 3 and max 100'),

    body('content').exists().withMessage('this field is required').trim().withMessage('content not faund').notEmpty().withMessage('field cannot be null or undefined').escape()
    .blacklist('!@#$%^&*();').isString().withMessage('value not a string')
    .isLength({max:1000}).withMessage('min length 3 and max 1000'),

];

const getPostsWithIdBlogs = [
    query('pageNumber').toInt().default(1),
    query('pageSize').toInt().default(10),
    query('sortBy')
        .customSanitizer(value => {
            let result;
            for(let i of keysBySortPosts) {
                if(i === value) {
                    result = i
                }
            }
            return result
        })
        .default('createdAt'),
    query('sortDirection')
        .customSanitizer(value => {
            if(value === 'asc') {
                return value
            } else {
                return value = null
            }
        })
        .default('desc'),
    param('blogId').exists().withMessage('this field is required').notEmpty().withMessage('field cannot be null or undefined'),

];

const postUsers = [
    body('login')
        .notEmpty().withMessage('the field is required')
        .trim().isString().withMessage('the field is not string')
        .isLength({max: 10, min: 3}).withMessage('maximum 10 and minimum 3 simbols')
        .matches(/^[a-zA-Z0-9_-]*$/).withMessage('not valid login'),

    body('password')
        .notEmpty().withMessage('the field is required')
        .isString().withMessage('field must be a string')
        .isLength({max: 20, min: 6}).withMessage('maximum 20 and minimum 6 simbols'),
        

    body('email')
        .notEmpty().withMessage('the field is required')
        .isString().withMessage('field must be a string')
        .normalizeEmail().isEmail().withMessage('field is not email')
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('not valid email address'),
];

const deleteUsers = [
    param('id')
        .notEmpty().withMessage('not find id')
        .isLength({min: 24, max: 24}).withMessage('the id field must be 24 characters long')
];

const validateResolution = ['id', 'login', 'email', 'createdAt']

const getUsersSearch = [
    query('sortBy')
        .trim()
        .customSanitizer(value => {
            let result = null;
            validateResolution.find(findvalue => {
                if(value === findvalue) {
                    result = value
                }
            })
            return result
        })
        .default('createdAt'),

    query('sortDirection')
        .customSanitizer(value => {
            if(value === 'asc') {
                return 'asc'
            } else {
                return null
            }
        })
        .default('desc'),
    query('pageNumber')
        .toInt()
        .default(1),
    query('pageSize')
        .toInt()
        .default(10)
];

const auth = [
    body('loginOrEmail')
        .isString().withMessage('loginOrEmail not a string')
        .notEmpty().withMessage('the field is required'),
    body('password')
        .isString().withMessage('password not a string')
        .notEmpty().withMessage('the field is required')
];

const postComments = [
    body('content')
    .notEmpty().withMessage('the field is required')    
    .isString().withMessage('content not a string')
    .isLength({min: 20, max: 300}).withMessage('content maximum 300 characters at least 20')
];

let keysBySortComments = ["id", "content", "createdAt"];

const searchCommentsWithIdPosts = [
    query('pageNumber').toInt().default(1),
    query('pageSize').toInt().default(10),
    query('sortBy')
        .customSanitizer(value => {
            let result;
            for(let i of keysBySortComments) {
                if(i === value) {
                    result = i
                }
            }
            return result
        })
        .default('createdAt'),
    query('sortDirection')
        .customSanitizer(value => {
            if(value === 'asc') {
                return value
            } else {
                return value = null
            }
        })
        .default('desc'),
];

const updateCommentsValidator = [
    body('content')
        .notEmpty().withMessage('content can not to by empty')
        .isString().withMessage('content not a string')
        .isLength({min: 20, max: 300}).withMessage('content maximum 300 characters at least 20')
];

const registrationValidator = [
    body('login')
        .notEmpty().withMessage('login can not to by empty')
        .isString().withMessage('login not a string')
        .isLength({max: 10, min:3}).withMessage('Login should not be more than 10 or less than 3 characters')
        .matches(/^[a-zA-Z0-9_-]*$/).withMessage('not valid login'),

    body('password')
        .notEmpty().withMessage('password can not to by empty')
        .isString().withMessage('password not a string')
        .isLength({max: 20, min: 6}).withMessage('password should not be more than 20 or less than 6 characters'),
        
    body('email')
        .notEmpty().withMessage('email can not to by empty')
        .isString().withMessage('email not a string')
        // .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('not valid email address') //TODO вернуть проверку
];

const confirmationCOde = [
    body('code')
        .isString().withMessage('code is not a string')
];

const emailResending = [
    body('email')
        .notEmpty().withMessage('email can not to by empty')
        .isString().withMessage('email not a string')
        // .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('not valid email address')  //TODO вернуть проверку
];


export const objectValidateMetods = {
    postReqvestbodyValPosts,
    postAndPutReqvestbodyValBlogs,
    blogsQueryValidation,
    postsQueryValidation,
    postFromBlogWithId,
    getPostsWithIdBlogs,
    postUsers,
    deleteUsers,
    getUsersSearch,
    auth,
    postComments,
    searchCommentsWithIdPosts,
    updateCommentsValidator,
    registrationValidator,
    confirmationCOde,
    emailResending
}

