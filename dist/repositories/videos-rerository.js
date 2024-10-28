"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosLocalRepository = void 0;
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
exports.videosLocalRepository = {
    createVideo(data) {
        let id = Date.now();
        let video = Object.assign({ id }, data);
        let massLength = videosLibrary.length;
        videosLibrary.push(video);
        if (massLength < videosLibrary.length) {
            return { dan: true, id: id };
        }
        else {
            return { dan: false, id: id };
        }
    },
    deleteAll() {
        return [];
    },
    getById(searchId) {
        let findElement = videosLibrary.find((element) => {
            if (element.id === searchId) {
                return element;
            }
            else {
                return undefined;
            }
        });
        if (findElement === undefined) {
            return "not find";
        }
        return findElement;
    },
    getAll() {
        return videosLibrary;
    },
};
