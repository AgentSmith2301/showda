import {agent} from "supertest";
import {app} from '../src/app';
import {SETTINGS} from '../src/settings';
import {db, methodsDB} from '../src/db/db'


const req = agent(app);

let idNewCreatedObject: number;

describe(`request for '/videos'` , () => {
    
    beforeAll(() => {
        methodsDB.deleteAll()
    })

    it('returns an empty array given this URL 👉 "GET /videos"', async() => {
        const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200);
        const tumbler: boolean = Array.isArray(res.body);
        expect(tumbler).toBe(true);
        expect(res.body.length).toBe(0)
    })

    it('create video in this url 👉 "POST /videos"', async() => {
        const res = await req.post(SETTINGS.PATH.VIDEOS).send(
            {
                title: "song for mister president", 
                author: "Marilyn Monroe", 
                availableResolutions: ["P144", "P480"],
            }
        )
        expect(res.statusCode).toBe(201);
    })

    it('The video format does not match any of the formats in the list, will return an error 👉 "POST /videos"', async() => {
        const res = await req.post(SETTINGS.PATH.VIDEOS).send(
            {
                title: "song for mister president", 
                author: "Marilyn Monroe", 
                availableResolutions: ["P114", "P480"],
            }
        )
        expect(res.statusCode).toBe(400);
    })

    it('availableResolutions field is empty 👉 "POST /videos"', async() => {
        const res = await req.post(SETTINGS.PATH.VIDEOS).send(
            {
                title: "song for mister president", 
                author: "Marilyn Monroe", 
                availableResolutions: [],
            }
        )
        expect(res.statusCode).toBe(400);
    })

    it('title missing 👉 "POST /videos"', async() => {
        const res = await req.post(SETTINGS.PATH.VIDEOS).send(
            {
                author: "Marilyn Monroe", 
                availableResolutions: ["P114", "P480"],
            }
        )
        expect(res.statusCode).toBe(400);
    })

    it('author missing 👉 "POST /videos"', async() => {
        const res = await req.post(SETTINGS.PATH.VIDEOS).send(
            {
                title: "song for mister president", 
                availableResolutions: ["P114", "P480"],
            }
        )
        expect(res.statusCode).toBe(400);
    })

    it('title property is empty 👉 "POST /videos"', async() => {
        const res = await req.post(SETTINGS.PATH.VIDEOS).send(
            {
                title: "  ", 
                author: "Marilyn Monroe", 
                availableResolutions: ["P114", "P480"],
            }
        )
        expect(res.statusCode).toBe(400);
    })

    it('author property is empty 👉 "POST /videos"', async() => {
        const res = await req.post(SETTINGS.PATH.VIDEOS).send(
            {
                title: "song for mister president", 
                author: "  ", 
                availableResolutions: ["P114", "P480"],
            }
        )
        expect(res.statusCode).toBe(400);
    })

    it('author field maximum 20 characters 👉 "POST /videos"', async() => {
        const res = await req.post(SETTINGS.PATH.VIDEOS).send(
            {
                title: "song for mister president", 
                author: "Marilyn Monroe Marilyn Monroe Marilyn Monroe Marilyn Monroe Marilyn Monroe Marilyn Monroe Marilyn Monroe Marilyn Monroe", 
                availableResolutions: ["P114", "P480"],
            }
        )
        expect(res.statusCode).toBe(400);
    })

    it('title field maximum 40 characters 👉 "POST /videos"', async() => {
        const res = await req.post(SETTINGS.PATH.VIDEOS).send(
            {
                title: "song for mister president song for mister president song for mister president song for mister president song for mister president ", 
                author: "Marilyn Monroe", 
                availableResolutions: ["P114", "P480"],
            }
        )
        expect(res.statusCode).toBe(400);
    })
    
    it('will return an array of objects from the database 👉 "GET /videos"', async() => {
        const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200);
        const tumbler: boolean = Array.isArray(res.body);
        expect(tumbler).toBe(true);
    })

    it('create video 2 👉 "POST /videos"', async() => {
        const res = await req.post(SETTINGS.PATH.VIDEOS).send(
            {
                title: "Nikita", 
                author: "Elton John", 
                availableResolutions: ["P144", "P480"],
            }
        )
        expect(res.statusCode).toBe(201);
    })

    it('create video 3 👉 "POST /videos"', async() => {
        const res = await req.post(SETTINGS.PATH.VIDEOS).send(
            {
                title: "Clint Eastwood", 
                author: "gorillaz", 
                availableResolutions: ["P144", "P480"],
            }
        )
        // взять id для тестов 
        idNewCreatedObject = db.videos[1].id;
        expect(res.statusCode).toBe(201);
    })

    it('number of videos created 👉 "GET /videos"', async() => {
        const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200);
        expect(res.body.length).toBe(4);
    })

    it('get video by id 👉 "GET /videos:id"', async() => {
        const res = await req.get(`${SETTINGS.PATH.VIDEOS}/${idNewCreatedObject}`).expect(200);
        console.log('path -->> ',`${SETTINGS.PATH.VIDEOS}/${idNewCreatedObject}`)
    })

    // it('remove object by id 👉 "DELETE /videos:id"', async() => {
    //     const res = await req.delete(`${SETTINGS.PATH.VIDEOS}/${idNewCreatedObject}`).expect(204);
    // })

    it('remove everything from the database 👉 "DELETE /testing/all-data"', async() => {
        await req.delete(SETTINGS.PATH.DELETEALL).expect(204);
        // expect(db.videos.length).toBe(3);
        await req.get(SETTINGS.PATH.VIDEOS).expect([]);
    })

    // it('remove non-existent id 👉 "DELETE /testing/all-data"' , async() => {
    //     await req.delete(SETTINGS.PATH.DELETEALL).expect(204);

    // })



    // добавить проверку на изменение объекта видео и удаление , а так же создать проверку на удаление всех данных из базы


})
