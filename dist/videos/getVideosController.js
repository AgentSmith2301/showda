"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideosController = void 0;
const db_1 = require("../db/db");
const getVideosController = (req, res) => {
    const videos = db_1.db.videos;
    res.status(200).json(videos);
};
exports.getVideosController = getVideosController;
