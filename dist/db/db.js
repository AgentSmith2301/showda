"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodsDB = exports.db = void 0;
exports.db = {
    videos: [],
    // blogs: [],
};
exports.methodsDB = {
    permissionsProperty: ['title', 'author', 'canBeDownloaded', 'minAgeRestriction', 'availableResolutions', 'createdAt', 'publicationDate'],
    format: ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"],
    deleteAll() {
        exports.db.videos = [];
    },
    getVideo() {
        return exports.db.videos;
    },
    createVideo(body) {
        let id = Date.now();
        let date = new Date();
        let day = date.getDate();
        date.setDate(day - 1);
        let createdAt = date.toISOString();
        let publicationDate = new Date().toISOString();
        let newVideo = Object.assign(Object.assign({ id }, body), { createdAt, publicationDate });
        exports.db.videos.push(newVideo);
        return newVideo;
    }
};
