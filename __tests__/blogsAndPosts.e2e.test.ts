import {agent} from "supertest";
import {app} from '../src/app';
import {SETTINGS} from '../src/settings';
// import {db, methodsDB} from '../src/db/db'


const req = agent(app);

describe('тесты на создание блога и ошибки при отсутствии данных ==> BLOGS 👇', () => { // tests for errors when creating blogs and for creating a blog
    beforeAll(async() => {
        await req.delete(SETTINGS.PATH.DELETEALL).expect(204)
    })
    
    it('статус 401, блог не создан, пользователь не авторизован 👉 BLOG', async() => { // status 401, blog not created, not authorized
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "Tamerlan",
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com"
        })
        expect(res.statusCode).toBe(401)
    })

    // TEST name
    it('статус 400, не создан, если нет name 👉 BLOG', async() => { // status 400, not create blog if not name 
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "",
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(400)
    })

    it('статус 400, блог не создан, name не должно быть меньше 3 символов  👉 BLOG', async() => { // status 400, not create blog, the name must not be less than 3 characters
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "12",
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(400)
    })

    it('статус 400, блог не создан, name не должно быть больше 15 символов  👉 BLOG', async() => { // status 400, not create blog, the name must not be more than 15 characters
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "16 simbols festa",
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(400)
    })

    it('статус 400, блог не создан, name не может быть null  👉 BLOG', async() => { // status 400, not create blog, the name cannot be null
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": null,
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(400)
    })

    it('статус 400, блог не создан , name не может быть undefined  👉 BLOG', async() => { // status 400, not create blog, the name cannot be undefined
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": undefined,
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(400)
    })

    it('статус 400, блог не создан, name не строка  👉 BLOG', async() => { // status 400, not create blog, name is not a string
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": 1,
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(400)
    })

    // TEST description
    it('статус 400, блог не создан , нет description 👉 BLOG', async() => { // status 400, not create blog if not description
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "Tamerlan",
            "description": "",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(400)
    })

    it('статус 400, блог не создан, description не должно быть меньше 3 символов  👉 BLOG', async() => { // status 400, not create blog, the description must not be less than 3 characters
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "Tamerlan",
            "description": "12",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(400)
    })

    it('статус 400, блог не создан, description длинее 500 символов  👉 BLOG', async() => { // status 400, not create blog, the description must not be more than 500 characters
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "Tamerlan",
            "description": `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
                Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, 
                ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, 
                aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu 
                pede mollis pretium. Integer tincidunt. Cras dapibus`,
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(400)
    })

    it('статус 400, блог не создан, description не может быть null  👉 BLOG', async() => { // status 400, not create blog, the description cannot be null
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "Tamerlan",
            "description": null,
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(400)
    })

    it('статус 400, блог не создан, description не может быть undefined  👉 BLOG', async() => { // status 400, not create blog, the description cannot be undefined
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": 'Tamerlan',
            "description": undefined,
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(400)
    })

    it('статус 400, блог не создавать, description не строка 👉 BLOG', async() => { // status 400, not create blog, description is not a string
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": 'Tamerlan',
            "description": 1,
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(400)
    })

    // TEST websiteUrl
    it('статус 400, блог не создавать, поле WebsiteUrl должно соответствовать шаблону 👉 BLOG', async() => { // status 400, not create blog, websiteUrl field must match the pattern
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": 'Tamerlan',
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": ""
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(400)
    })

    it('статус 400, блог не создан, поле websiteUrl отсутствует  👉 BLOG', async() => { // status 400, not create blog, no websiteUrl field
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": 'Tamerlan',
            "description": "creator of the devastating blow to the little finger"
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(400)
    })

    it('статус 201, создать блог  👉 BLOG', async() => { // status 201, create blog  
        const res = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "Tamerlan",
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty')
        expect(res.statusCode).toBe(201)
    })

})

// test for creating several blogs, returning all blogs, deleting one and returning the remaining ones 
describe('тесты на создание нескольких блогов, возврат всех блогов, удаление одного и возврат остальных ==> BLOGS 👇', () => {
    beforeAll(async() => {
        await req.delete(SETTINGS.PATH.DELETEALL).expect(204)
    })

    let response1: any ;
    let response2: any ;
    let response3: any ;

    it('создать 3 блога', async() => { // create 3 blogs
        response1 = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "Tamerlan-1",
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty').expect(201)

        response2 = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "Tamerlan-2",
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty').expect(201)

        response3 = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "Tamerlan-3",
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty').expect(201)
    })

    it('получить все блоги', async() => { // get all blogs
        const res = await req.get(SETTINGS.PATH.BLOGS).expect(200);
        expect([response1.body,response2.body,response3.body]).toStrictEqual(res.body)
    })

    it('получить блоги по id', async() => { // get blogs by id
        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${response1.body.id}`).expect(200);
        expect(response1.body).toStrictEqual({
            "id": res.body.id,
            "name": res.body.name,
            "description": res.body.description,
            "websiteUrl": res.body.websiteUrl
        })
    })

    it('не удалит блог, если пользователь не авторизован', async() => { // will not delete the blog if the user is not authorized 
        await req.delete(`${SETTINGS.PATH.BLOGS}/${response1.id}`).expect(401)
    })

    it('удалить блог, если пользователь вошел в систему', async() => { //delete blog if user is logged in 
        const result = await req.delete(`${SETTINGS.PATH.BLOGS}/${response1.body.id}`).auth('admin','qwerty')
        expect(result.statusCode).toBe(204) 
    })

    it('блог для удаления не найден', async() => { // blog to delete not found 
        await req.delete(`${SETTINGS.PATH.BLOGS}/${response1.id}`).auth('admin','qwerty').expect(404)
    })

    it('ошибка для несуществующего id блога', async() => { // error for non-existent blog id
        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${response1.body.id}`).expect(404);
    })

    it('получить блог по id', async() => { // get blog by id
        await req.get(`${SETTINGS.PATH.BLOGS}/${response2.body.id}`).expect(200)
        
    })

    it('получить все блоги', async() => { // get all blogs
        await req.get(`${SETTINGS.PATH.BLOGS}/${response2.body.id}`).expect(200)
        
    })
})


describe('тесты на создание, на авторизацию при обновление, на ошибку при обновлении и возврат созданного блога  ==> BLOGS 👇', () => {
    beforeAll(async() => {
        await req.delete(SETTINGS.PATH.DELETEALL).expect(204)
    })

    let response: any ;

    it('создание блога', async() => { // get all blogs
        response = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "Tamerlan",
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty').expect(201)
        
    })

    it('не изменит блог, пользователь не авторизован', async() => { // get all blogs
        await req.put(`${SETTINGS.PATH.BLOGS}/${response.body.id}`).send({
            "name": "Mariarty",
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com/tamerlan"
        }).expect(401)
        
    })

    it('не изменит блог , не верный id', async() => { // get all blogs
        await req.put(`${SETTINGS.PATH.BLOGS}/1732197042511`).send({
            "name": "Mariarty",
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com/tamerlan"
        }).auth('admin','qwerty').expect(404)
        
    })

    it('изменить блог', async() => { // get all blogs
        await req.put(`${SETTINGS.PATH.BLOGS}/${response.body.id}`).send({
            "name": "Mariarty",
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com/tamerlan"
        }).auth('admin','qwerty').expect(204)
        
    })

    it('получить все блоги', async() => { // get all blogs
        await req.get(SETTINGS.PATH.BLOGS).expect(200)
        
    })

})

// ТЕСТЫ НА POSTS
describe('тесты на валидацию постов ==> POSTS  👇', () => {
    beforeAll(async() => {
        await req.delete(SETTINGS.PATH.DELETEALL).expect(204)
    })

    let response: any ;

    it('создание блога', async() => { // get all blogs
        response = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "Tamerlan",
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty').expect(201)
        
    })

    it('пользователь не авторизован', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "the title",
            "shortDescription": "string",
            "content": "string",
            "blogId": response.body.id,
        }).expect(401)
    })

    it('не создавать блог отсутствует поле title', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "shortDescription": "string",
            "content": "string",
            "blogId": "string",
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог title пуст', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "",
            "shortDescription": "string",
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог title не строка', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": 1,
            "shortDescription": "string",
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог title пустая строка', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "  ",
            "shortDescription": "string",
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог title undefined', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": undefined,
            "shortDescription": "string",
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог title null', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": null,
            "shortDescription": "string",
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог title длинее 30 символов', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title length > 30 , hu laike a dogz aut",
            "shortDescription": "string",
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог title меньше 3 символов', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "ti",
            "shortDescription": "string",
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог shortDescription меньше 3 символов', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "st",
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог shortDescription больше 100 символов', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "stывллжыалфылфэжалзцлузафэзулащуцлаойцкйшйщазщлшацщлуоэцоацэацзщокзщцовщаоыщуаруажвмфтшуоафщцоулютылвтсцшур",
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог поле shortDescription отсутствует', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог shortDescription пусто', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "  ",
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог shortDescription не строка', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "st",
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог shortDescription не может быть null', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": null,
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог shortDescription не может быть undefined', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": undefined,
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог content не может быть undefined', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "string",
            "content": undefined,
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог content не может быть null', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "string",
            "content": null,
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог content не может быть меньше 3 символов', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "string",
            "content": 'nu',
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог поле content отсутствует', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог content не может быть null', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "string",
            "content": null,
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог content не может быть undefined', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "string",
            "content": undefined,
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог поле content должено быть строкой', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "string",
            "content": 1,
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог , blogId не может быть undefined', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "string",
            "content": "string",
            "blogId": "string"
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог , blogId не может быть null', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "string",
            "content": "string",
            "blogId": null
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог , отсутствует поле blogId', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "string",
            "content": "string",
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог , поле blogId должно быть строкой', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "string",
            "content": "string",
            "blogId": 1
        }).auth('admin','qwerty').expect(400)
    })

    it('не создавать блог , blogId не может быть null', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "title ok",
            "shortDescription": "string",
            "content": "string",
            "blogId": null
        }).auth('admin','qwerty').expect(400)
    })

})

describe('тесты на создание , получение , обновление и удаление постов ==> POSTS  👇', () => {
    beforeAll(async() => {
        await req.delete(SETTINGS.PATH.DELETEALL).expect(204)
    })

    let response: any ;

    it('создание блога', async() => { // get all blogs
        response = await req.post(SETTINGS.PATH.BLOGS).send({
            "name": "Tamerlan",
            "description": "creator of the devastating blow to the little finger",
            "websiteUrl": "https://showda.com"
        }).auth('admin','qwerty').expect(201)
        
    })

    it('создать пост', async() => {
        await req.post(SETTINGS.PATH.POSTS).send({
            "title": "the title",
            "shortDescription": "string",
            "content": "string",
            "blogId": response.body.id,
        }).auth('admin','qwerty').expect(201)
    })

    let result: any ;

    it('получить все посты', async() => {
        result = await req.get(SETTINGS.PATH.POSTS).expect(200);
        expect(result.body).toEqual([{
            "title": "the title",
            "id": result.body[0].id,
            "blogName": response.body.name,
            "shortDescription": "string",
            "content": "string",
            "blogId": response.body.id
        }])
    })

    it('изменить пост', async() => {
        await req.put(`${SETTINGS.PATH.POSTS}/${result.body[0].id}`).send({
            "title": "new title from put requst",
            "shortDescription": "new string",
            "content": "new string",
            "blogId": response.body.id,
        }).auth('admin','qwerty').expect(204)
    })

    it('удалить пост', async() => {
        await req.delete(`${SETTINGS.PATH.POSTS}/${result.body[0].id}`).auth('admin','qwerty').expect(204)
    })

    
})