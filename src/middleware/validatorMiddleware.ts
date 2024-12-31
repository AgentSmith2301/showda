import {check, body, validationResult, query} from 'express-validator'
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


export const objectValidateMetods = {
    postReqvestbodyValPosts,
    postAndPutReqvestbodyValBlogs,
    blogsQueryValidation,
    postsQueryValidation
}

