type DBType = {
    videos: {}[],
    // blogs: any[],
}

export const db: DBType = {
    videos: [],
    // blogs: [],
}

export const methodsDB: {permissionsProperty: string[], format: string[], deleteAll(): void,  getVideo(): {}[], createVideo(body: {}): {}} = {
    permissionsProperty: ['title', 'author',  'canBeDownloaded',  'minAgeRestriction',  'availableResolutions', 'createdAt', 'publicationDate'],
    format: ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"],
    deleteAll() {
        db.videos = [];
    },
    getVideo() {
        return db.videos
    },
    createVideo(body) {
        let id = Date.now();
        let date = new Date();
        let day = date.getDate();
        date.setDate(day - 1);
        let createdAt = date.toISOString();
        let publicationDate = new Date().toISOString();
        
        let newVideo = {id, ...body, createdAt, publicationDate};
        db.videos.push(newVideo);
        return newVideo;
        
    }

    
    
}





