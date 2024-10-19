"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
exports.app = (0, express_1.default)();
const videosRouter = express_1.default.Router();
const blogsRouter = express_1.default.Router();
videosRouter.get('/', (req, res) => {
    res.send('there should be videos here');
});
exports.app.use((0, body_parser_1.default)({})); // в экспресс это делает express.json()
exports.app.use('/videos', videosRouter);
exports.app.use('/blogs', blogsRouter);
exports.app.get('/', (req, res) => {
    res.send('Hello back-end HomeWorks in it-incubator!!!');
});
exports.app.delete('/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // await videosLocalRepository.deleteAll();
    // await blogsLocalRepository.deleteAll();
    // res.sendStatus(CodeResponsesEnum.Not_content_204)
}));
