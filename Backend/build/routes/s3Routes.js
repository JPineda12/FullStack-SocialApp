"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var s3Controller_1 = require("../controllers/s3Controller");
var IndexRoutes = /** @class */ (function () {
    function IndexRoutes() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    IndexRoutes.prototype.config = function () {
        this.router.post('/uploadFoto', s3Controller_1.s3Controller.uploadFoto);
    };
    return IndexRoutes;
}());
var indexRoutes = new IndexRoutes();
exports.default = indexRoutes.router;
