"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const getVideosController_1 = require("./getVideosController");
// import {findVideoController} from './findVideoController';
// import {deleteVideoController} from './deleteVideoController';
exports.videosRouter = (0, express_1.Router)();
exports.videosRouter.get('/', getVideosController_1.getVideosController);
// videosRouter.post('/', createVideosController)
// videosRouter.get('/:id', findVideoController)
// videosRouter.delete('/:id', deleteVideoController)
