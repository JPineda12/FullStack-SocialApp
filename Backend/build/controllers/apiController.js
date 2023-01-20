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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiController = void 0;
var database_1 = __importDefault(require("../database"));
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var creds_1 = __importDefault(require("../creds"));
var s3 = new aws_sdk_1.default.S3(creds_1.default.s3);
var uuid_1 = require("uuid");
var ApiController = /** @class */ (function () {
    function ApiController() {
    }
    ApiController.prototype.translatePost = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var translate, postText, params;
            return __generator(this, function (_a) {
                translate = new aws_sdk_1.default.Translate(creds_1.default.translate);
                postText = req.body.text;
                params = {
                    SourceLanguageCode: "auto",
                    TargetLanguageCode: "es",
                    Text: postText || "Hello there",
                };
                translate.translateText(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
                        res.send({ error: err });
                    }
                    else {
                        res.send({ message: data });
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    ApiController.prototype.sendRequest = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, idAmigo1, idAmigo2, sql0, result0, sql, result, err_1, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, idAmigo1 = _a.idAmigo1, idAmigo2 = _a.idAmigo2;
                        sql0 = "CALL sendFriendRequest(?, ?)";
                        return [4 /*yield*/, database_1.default.query(sql0, [idAmigo1, idAmigo2])];
                    case 1:
                        result0 = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 8, , 9]);
                        if (!(result0.changedRows > 0)) return [3 /*break*/, 3];
                        res.status(200).json({
                            status: true,
                            result: "Solicitud Enviada Correctamente (updated)",
                        });
                        return [3 /*break*/, 7];
                    case 3:
                        sql = "CALL insertNewFriendRequest(?,?)";
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, database_1.default.query(sql, [idAmigo1, idAmigo2])];
                    case 5:
                        result = _b.sent();
                        res.status(200).json({
                            status: true,
                            result: "Solicitud Enviada Correctamente (inserted)",
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _b.sent();
                        res.status(200).json({ status: false, result: "Ocurrio un error" });
                        console.log("ERROR: " + err_1);
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_2 = _b.sent();
                        res.status(200).json({ status: false, result: "Ocurrio un error" });
                        console.log("ERROR: " + err_2);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ApiController.prototype.sendRequest_Again = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, idAmigo1, idAmigo2, sql, result, sql2, result2, err_3, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, idAmigo1 = _a.idAmigo1, idAmigo2 = _a.idAmigo2;
                        sql = "CALL sendFriendRequest(?, ?);";
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, database_1.default.query(sql, [idAmigo1, idAmigo2])];
                    case 2:
                        result = _b.sent();
                        sql2 = "CALL sendFriendRequesT(?, ?);";
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, database_1.default.query(sql2, [idAmigo2, idAmigo1])];
                    case 4:
                        result2 = _b.sent();
                        res.status(200).json({
                            status: true,
                            result: "Solicitud Aceptada Correctamente",
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        err_3 = _b.sent();
                        res.status(200).json({
                            status: false,
                            result: "Ocurrio un error al insertar en Solicitud_Amistad ACEPTADA",
                        });
                        console.log("ERROR: " + err_3);
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_4 = _b.sent();
                        res.status(200).json({
                            status: false,
                            result: "Ocurrio un error al hacer UPDATE en Solicitud_Amistad",
                        });
                        console.log("ERROR: " + err_4);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ApiController.prototype.confirmRequest = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, idAmigo1, idAmigo2, sql, result, sql2, result2, sql3, result3, err_5, err_6, err_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, idAmigo1 = _a.idAmigo1, idAmigo2 = _a.idAmigo2;
                        sql = "CALL confirmFriendRequest(?,?);";
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 12, , 13]);
                        return [4 /*yield*/, database_1.default.query(sql, [idAmigo1, idAmigo2])];
                    case 2:
                        result = _b.sent();
                        sql2 = "CALL confirmFriendRequest(?,?);";
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 10, , 11]);
                        return [4 /*yield*/, database_1.default.query(sql2, [idAmigo2, idAmigo1])];
                    case 4:
                        result2 = _b.sent();
                        if (!(result2.changedRows > 0)) return [3 /*break*/, 5];
                        res.status(200).json({
                            status: true,
                            result: "Solicitud Aceptada Correctamente",
                        });
                        return [3 /*break*/, 9];
                    case 5:
                        sql3 = "CALL confirmNewFriendRequest(?,?)";
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, database_1.default.query(sql3, [idAmigo2, idAmigo1])];
                    case 7:
                        result3 = _b.sent();
                        res.status(200).json({
                            status: true,
                            result: "Solicitud Aceptada Correctamente",
                        });
                        return [3 /*break*/, 9];
                    case 8:
                        err_5 = _b.sent();
                        res.status(200).json({
                            status: false,
                            result: "Ocurrio un error al insertar en Solicitud_Amistad ACEPTADA",
                        });
                        console.log("ERROR: " + err_5);
                        return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        err_6 = _b.sent();
                        res.status(200).json({
                            status: false,
                            result: "Ocurrio un error al insertar en Solicitud_Amistad ACEPTADA",
                        });
                        console.log("ERROR: " + err_6);
                        return [3 /*break*/, 11];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        err_7 = _b.sent();
                        res.status(200).json({
                            status: false,
                            result: "Ocurrio un error al hacer UPDATE en Solicitud_Amistad",
                        });
                        console.log("ERROR: " + err_7);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    ApiController.prototype.rejectRequest = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, idAmigo1, idAmigo2, sql, result, sql2, result2, err_8, err_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, idAmigo1 = _a.idAmigo1, idAmigo2 = _a.idAmigo2;
                        sql = "CALL rejectFriendRequest(?,?)";
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, database_1.default.query(sql, [idAmigo1, idAmigo2])];
                    case 2:
                        result = _b.sent();
                        sql2 = "CALL rejectNewFriendRequest(?,?)";
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, database_1.default.query(sql2, [idAmigo2, idAmigo1])];
                    case 4:
                        result2 = _b.sent();
                        res.status(200).json({
                            status: true,
                            result: "Solicitud Rechazada Correctamente",
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        err_8 = _b.sent();
                        res.status(200).json({
                            status: false,
                            result: "Ocurrio un error al insertar en Solicitud_Amistad RECHAZADA",
                        });
                        console.log("ERROR: " + err_8);
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_9 = _b.sent();
                        res.status(200).json({
                            status: false,
                            result: "Ocurrio un error al hacer UPDATE en Solicitud_Amistad",
                        });
                        console.log("ERROR: " + err_9);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ApiController.prototype.getAllTags = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT idEtiqueta, Etiqueta from Etiqueta";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query(sql, [])];
                    case 2:
                        result = _a.sent();
                        if (result.length > 0) {
                            res.json(result);
                        }
                        else {
                            res.json([]);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_10 = _a.sent();
                        res.json([]);
                        console.log("ERROR: " + err_10);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ApiController.prototype.getAllFriends = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var iduser, sql, result, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iduser = req.params.iduser;
                        sql = "CALL getAllFriends(?)";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query(sql, [iduser])];
                    case 2:
                        result = _a.sent();
                        if (result.length > 0) {
                            res.json(result);
                        }
                        else {
                            res.json([]);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_11 = _a.sent();
                        res.json([]);
                        console.log("ERROR: " + err_11);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ApiController.prototype.getAllExceptFriends = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var iduser, sql, result, err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iduser = req.params.iduser;
                        sql = "CALL getNoFriends(?);";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query(sql, [iduser])];
                    case 2:
                        result = _a.sent();
                        if (result.length > 0) {
                            res.json(result);
                        }
                        else {
                            res.json([]);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_12 = _a.sent();
                        res.json([]);
                        console.log("ERROR: " + err_12);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ApiController.prototype.getAllFriendRequests = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var iduser, sql, result, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iduser = req.params.iduser;
                        sql = "CALL getFriendsRequests(?);";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query(sql, [iduser])];
                    case 2:
                        result = _a.sent();
                        if (result.length > 0) {
                            res.json(result);
                        }
                        else {
                            res.json([]);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_13 = _a.sent();
                        res.json([]);
                        console.log("ERROR: " + err_13);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ApiController.prototype.getUserByName = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var username, sql, result, err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        username = req.params.username;
                        sql = "SELECT idUsuario, username, img_url From Usuario\n    WHERE username = ?";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query(sql, [username])];
                    case 2:
                        result = _a.sent();
                        if (result.length > 0) {
                            res.json(result);
                        }
                        else {
                            res.json([]);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_14 = _a.sent();
                        res.json([]);
                        console.log("ERROR: " + err_14);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ApiController.prototype.getTestUsers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var username, sql, result, err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        username = req.params.username;
                        sql = "SELECT idUsuario, username, img_url From Usuario";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query(sql, [username])];
                    case 2:
                        result = _a.sent();
                        if (result.length > 0) {
                            res.json(result);
                        }
                        else {
                            res.json([]);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_15 = _a.sent();
                        res.json([]);
                        console.log("ERROR: " + err_15);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ApiController.prototype.getAllPosts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result, publicaciones, i, sqlTag, resultTag, err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT idPublicacion, url_imagen, texto, U.username as owner\n    FROM Publicacion P , Usuario U\n    WHERE P.Publicacion_idUsuario = U.idUsuario\n    ORDER BY idPublicacion DESC";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, database_1.default.query(sql, [])];
                    case 2:
                        result = _a.sent();
                        if (!(result.length > 0)) return [3 /*break*/, 7];
                        publicaciones = [];
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < result.length)) return [3 /*break*/, 6];
                        sqlTag = "SELECT E.etiqueta FROM Publicacion P, Etiqueta E, Post_Tags PT\n          WHERE P.idPublicacion = PT.Publicacion_idPublicacion\n          AND PT.Etiqueta_idEtiqueta = E.idEtiqueta\n          AND PT.Publicacion_idPublicacion = ?";
                        return [4 /*yield*/, database_1.default.query(sqlTag, [result[i].idPublicacion])];
                    case 4:
                        resultTag = _a.sent();
                        publicaciones.push({
                            publicacion: result[i],
                            etiquetas: resultTag,
                        });
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6:
                        res.json(publicaciones);
                        return [3 /*break*/, 8];
                    case 7:
                        res.json([]);
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        err_16 = _a.sent();
                        res.json([]);
                        console.log("ERROR: " + err_16);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ApiController.prototype.newPost = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, imagen, texto, idUser, nombrei, buff, params;
            return __generator(this, function (_b) {
                _a = req.body, imagen = _a.imagen, texto = _a.texto, idUser = _a.idUser;
                nombrei = "posts-pictures/" + req.body.nickname + "-pp" + "-" + (0, uuid_1.v4)() + ".jpg";
                buff = Buffer.from(imagen, "base64");
                params = {
                    Bucket: creds_1.default.s3.bucketName || '',
                    Key: nombrei,
                    Body: buff,
                    ContentType: "image",
                    ACL: "public-read",
                };
                s3.upload(params, function sync(err, data) {
                    return __awaiter(this, void 0, void 0, function () {
                        var sql, result, err_17;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!err) return [3 /*break*/, 1];
                                    res.status(500).send(err);
                                    return [3 /*break*/, 5];
                                case 1:
                                    sql = "INSERT INTO Publicacion(url_imagen, texto, Publicacion_idUsuario)\n        VALUES(?, ?, ?)";
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, 4, , 5]);
                                    return [4 /*yield*/, database_1.default.query(sql, [data.Location, texto, idUser])];
                                case 3:
                                    result = _a.sent();
                                    res.status(200).json({
                                        status: true,
                                        result: "Publicado Correctamente",
                                        idPost: result.insertId,
                                    });
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_17 = _a.sent();
                                    res.status(200).json({ status: false, result: "Ocurrio un error" });
                                    console.log("ERROR: " + err_17);
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    ApiController.prototype.newTag = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tag, sql, result, err_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tag = req.body.tag;
                        sql = "INSERT INTO Etiqueta(etiqueta)\n    VALUES(?)";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query(sql, [tag])];
                    case 2:
                        result = _a.sent();
                        res.status(200).json({
                            status: true,
                            result: "Etiqueta ingresada Correctamente",
                            idTag: result.insertId,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_18 = _a.sent();
                        res.status(200).json({ status: false, result: "Ocurrio un error" });
                        console.log("ERROR: " + err_18);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ApiController.prototype.publicacionesNTags = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, idTag, idPublicacion, sql, result, err_19;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, idTag = _a.idTag, idPublicacion = _a.idPublicacion;
                        sql = "INSERT INTO Post_Tags(Publicacion_idPublicacion, Etiqueta_idEtiqueta)\n    VALUES(?, ?)";
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query(sql, [idPublicacion, idTag])];
                    case 2:
                        result = _b.sent();
                        res
                            .status(200)
                            .json({ status: true, result: "Relacion Tag-Publicacion ingresada" });
                        return [3 /*break*/, 4];
                    case 3:
                        err_19 = _b.sent();
                        res.status(200).json({ status: false, result: "Ocurrio un error" });
                        console.log("ERROR: " + err_19);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ApiController.prototype.detectEtiquetas = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var imagen, rek, params;
            return __generator(this, function (_a) {
                imagen = req.body.imagen;
                rek = new aws_sdk_1.default.Rekognition(creds_1.default.rekognition);
                params = {
                    /* S3Object: {
                      Bucket: "mybucket",
                      Name: "mysourceimage"
                    }*/
                    Image: {
                        Bytes: Buffer.from(imagen, 'base64')
                    },
                    MaxLabels: 123
                };
                try {
                    rek.detectLabels(params, function (err, data) {
                        if (err) {
                            res.json({ mensaje: "Error" });
                        }
                        else {
                            res.json({ status: true, result: data.Labels });
                        }
                    });
                }
                catch (err) {
                    res.status(200).json({ status: false, result: "Ocurrio un error" });
                    console.log("ERROR: " + err);
                }
                return [2 /*return*/];
            });
        });
    };
    return ApiController;
}());
exports.apiController = new ApiController();
