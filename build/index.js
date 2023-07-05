"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const api = (0, express_1.default)();
api.use(express_1.default.json());
api.use((0, cors_1.default)());
api.listen(3003, () => {
    console.log('listening on http://localhost:3003');
});
api.get('/ping', (req, res) => {
    res.send('Pong!');
});
//# sourceMappingURL=index.js.map