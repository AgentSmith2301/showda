interface Video {
    id: number;
    title?: string;
    author?: string;
    canBeDownloaded?: boolean;
    minAgeRestriction?: number;
    availableResolutions?: string[];
    createdAt: string;
    publicationDate: string;
}

type DBType = {
    videos: Video[];
};

interface MethodsDB {
    permissionsProperty: string[];
    format: string[];
    deleteAll(): void;
    getVideo(): Video[];
    createVideo(body: Partial<Video>): Video;
    getVideoById(id: number): Video | string;
    deleteById(id: number): boolean;
    updateDB(id: number, body: object): string;
}

export const db: DBType = {
    videos: [],
};

export const methodsDB: MethodsDB = {
    permissionsProperty: [
        'title', 'author', 'canBeDownloaded', 'minAgeRestriction',
        'availableResolutions', 'createdAt', 'publicationDate'
    ],
    format: ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"],
    deleteAll() {
        db.videos = [];
    },
    getVideo() {
        return db.videos;
    },
    getVideoById(id) {
        let result = db.videos.find((value) => value.id === id);
        if (result) {
            return result;
        } else {
            return 'NOT FOUND';
        }
    },
    createVideo(body) {
        let id = Date.now();
        let date = new Date();
        let day = date.getDate();
        date.setDate(day - 1);
        let createdAt = date.toISOString();
        let publicationDate = new Date().toISOString();
        let newVideo: Video = { id, ...body, createdAt, publicationDate };
        db.videos.push(newVideo);
        return newVideo;
    },
    deleteById(id) {
        let result = db.videos.findIndex((value) => value.id === id);
        if(result === -1) {
            return false
        } else {
            db.videos.splice(result,1);
            return true;
        }
    },
    updateDB(id, body) {
        let result: string;
        let findId: any[] = [];
        db.videos.find((value, index) => {
            if(value.id === id) {
                findId.push(value, index);
            }
        });

        if(findId[0] === undefined) {
            result = 'not found';
        } else {
            let change = {...findId[0], ...body}
            db.videos.splice(findId[1], 1, change)
            result = 'update';
        }
        return result;
    }

};



