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
    createVideo(title: string, author: string, resolution: []) {
        // время создания и время публикации
        // let createdAt = new Date().toISOString();
        // let publicationData = new Date().toISOString();
        let id = Date.now();
        let video = {id:id, title: title, author: author, availableResolutions: resolution};
        let massLength = videosLibrary.length; 
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
        console.log('video [] -->', videosLibrary)
        console.log('search element -->', searchId)

        
        let findElement = videosLibrary.find((element) => {
            console.log('element.id -->',element.id)
            if(element.id === searchId) {
                return element;
            }
            
        });
        console.log('объект после фильтрации', findElement);
        return findElement;
    },
    getAll() {
        return videosLibrary;
    },
};


