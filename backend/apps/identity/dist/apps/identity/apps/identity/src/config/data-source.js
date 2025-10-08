"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const data_source_options_1 = __importDefault(require("./data-source-options"));
exports.dataSource = new typeorm_1.DataSource(data_source_options_1.default);
//# sourceMappingURL=data-source.js.map