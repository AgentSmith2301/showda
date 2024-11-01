"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDB = exports.db = void 0;
exports.db = {
    videos: [],
};
const setDB = (dataset) => {
    if (!dataset) {
        exports.db.videos = [];
        return;
    }
};
exports.setDB = setDB;
// db.videos = dataset.videos || db.videos 
