let videosLibrary = [
    {
        id: 1729363112878,
        title: 'video1',
        author: 'Tokio',
    }, 
    {
        id: 1729363562878,
        title: 'video2',
        author: 'Kioto',
    },
];

export const videosLocalRepository = {
    // createVideo(title: string, author: string, resolution: []) {
        // время создания и время публикации
        // let createdAt = new Date().toISOString();
        // let publicationData = new Date().toISOString();
    //     let id = Date.now();
    //     let video = {id:id, title: title, author: author, availableResolutions: resolution};
    //     let massLength = videosLibrary.length; 
    //     videosLibrary.push(video);
    //     if(massLength < videosLibrary.length) {
    //         return {dan: true, id: id};
    //     } else {
    //         return {dan: false, id: id};
    //     }
    // },
    createVideo(data: any) {
        // время создания и время публикации
        // let createdAt = new Date().toISOString();
        // let publicationData = new Date().toISOString();
        let id = Date.now();
        let video = {id, ...data};
        let massLength = videosLibrary.length; 
        console.log(video)
        videosLibrary.push(video);
        if(massLength < videosLibrary.length) {
            return {dan: true, id: id};
        } else {
            return {dan: false, id: id};
        }

    },

    deleteAll() {
        
        return [];
    },
    getById(searchId: number) {
        
        let findElement = videosLibrary.find((element) => {
            if(element.id === searchId) {
                return element;
            } else {
                return undefined;
            }
        });
        if(findElement === undefined) {
            return "not find";
        }
        return findElement;
    },
    getAll() {
        return videosLibrary;
    },
};

