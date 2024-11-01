"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideoController = void 0;
const db_1 = require("../db/db");
const video_types_1 = require("../input-output-types/video-types");
const inputValidation = (video) => {
    const errors = {
        errorsMassages: []
    };
    if (!Array.isArray(video.availableResolution) || video.availableResolution.find(p => !video_types_1.Resolutions[p])) {
        errors.errorsMessages.push({
            message: 'error!!!', field: 'availableResolution'
        });
    }
    return errors;
};
const createVideoController = (req, res) => {
    const errors = inputValidation(req.body);
    if (errors.errorsMessages.length) {
        res.status(400).json(errors);
        return;
    }
    const newVideo = Object.assign(Object.assign({}, req.body), { id: Date.now() + Math.random() });
    db_1.db.videos = [...db_1.db.videos, newVideo];
    res.status(201).json(newVideo);
};
exports.createVideoController = createVideoController;
