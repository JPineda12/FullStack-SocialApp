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
exports.chatController = void 0;
var database_1 = __importDefault(require("../database"));
var ChatController = /** @class */ (function () {
    function ChatController() {
    }
    ChatController.prototype.newMessage = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "INSERT INTO Mensaje(texto, Usuario_idUsuario, Sala_idChat)\n        VALUES(?, ?, ?)";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query(sql, [
                                data.texto,
                                data.idUsuario,
                                data.idChat,
                            ])];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, {
                                status: true,
                                result: "Message Inserted in roomChat",
                                idMensaje: result.insertId,
                            }];
                    case 3:
                        err_1 = _a.sent();
                        console.log("ERROR)");
                        return [2 /*return*/, {
                                status: false,
                                result: "Ocurrio un error al insertar en el room",
                                error: err_1,
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChatController.prototype.getAllMessagesFromRoom = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, idUsuario1, idUsuario2, sqlRoom, result, sql, resultMessages, err_2, sqlCreateRoom, result_1, err_3, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, idUsuario1 = _a.idUsuario1, idUsuario2 = _a.idUsuario2;
                        sqlRoom = "SELECT idSala FROM Sala_Chat\n    WHERE idUsuario1 = ".concat(idUsuario1, "\n    AND idUsuario2 = ").concat(idUsuario2, "\n    UNION\n    SELECT idSala FROM Sala_Chat\n    WHERE idUsuario1 = ").concat(idUsuario2, "\n    AND idUsuario2 = ").concat(idUsuario1);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 12, , 13]);
                        return [4 /*yield*/, database_1.default.query(sqlRoom, [])];
                    case 2:
                        result = _b.sent();
                        if (!(result.length > 0)) return [3 /*break*/, 7];
                        sql = "SELECT M.idMensaje, M.texto, M.Usuario_idUsuario, M.Sala_idChat as idChat\n        FROM Mensaje M\n        WHERE M.Sala_idChat = ".concat(result[0].idSala, "\n        ORDER BY M.idMensaje ASC");
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, database_1.default.query(sql, [])];
                    case 4:
                        resultMessages = _b.sent();
                        if (resultMessages.length > 0) {
                            res.json({ idChat: result[0].idSala, messages: resultMessages });
                        }
                        else {
                            res.json({ idChat: result[0].idSala, messages: resultMessages });
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        err_2 = _b.sent();
                        res.json([]);
                        console.log("ERROR: " + err_2);
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 11];
                    case 7:
                        sqlCreateRoom = "INSERT INTO Sala_Chat(idUsuario1, idUsuario2)\n        VALUES(?, ?);";
                        _b.label = 8;
                    case 8:
                        _b.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, database_1.default.query(sqlCreateRoom, [
                                idUsuario1,
                                idUsuario2,
                            ])];
                    case 9:
                        result_1 = _b.sent();
                        res.json({
                            status: true,
                            created: true,
                            result: "Chat Room Created",
                            idChat: result_1.insertId,
                        });
                        return [3 /*break*/, 11];
                    case 10:
                        err_3 = _b.sent();
                        res.json({
                            status: false,
                            created: false,
                            result: "Ocurrio un error al crear la sala.",
                            error: err_3,
                        });
                        return [3 /*break*/, 11];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        err_4 = _b.sent();
                        console.log("ERROR: " + err_4);
                        return [2 /*return*/, {
                                status: false,
                                exists: false,
                                idChat: [],
                            }];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    return ChatController;
}());
exports.chatController = new ChatController();
