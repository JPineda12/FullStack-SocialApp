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
exports.userController = void 0;
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
var creds_1 = __importDefault(require("../creds"));
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var database_1 = __importDefault(require("../database"));
var s3 = new aws_sdk_1.default.S3(creds_1.default.s3);
var rek = new aws_sdk_1.default.Rekognition(creds_1.default.rekognition);
var uuid_1 = require("uuid");
var cognito = new AmazonCognitoIdentity.CognitoUserPool(creds_1.default.cognito);
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.loginCognito = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var crypto, hash, authenticationData, authenticationDetails, userData, cognitoUser;
            return __generator(this, function (_a) {
                crypto = require("crypto");
                console.log(req.body);
                console.log("req.body.username; ", req.body.username);
                console.log("password: ", req.body.password);
                hash = crypto
                    .createHash("sha256")
                    .update(req.body.password)
                    .digest("hex");
                authenticationData = {
                    Username: req.body.username,
                    Password: hash + "D**",
                };
                authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
                userData = {
                    Username: req.body.username,
                    Pool: cognito,
                };
                cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                cognitoUser.setAuthenticationFlowType("USER_PASSWORD_AUTH");
                cognitoUser.authenticateUser(authenticationDetails, {
                    onSuccess: function (result) {
                        // User authentication was successful
                        res.json(result); //
                    },
                    onFailure: function (err) {
                        // User authentication was not successful
                        res.json(err);
                    },
                });
                return [2 /*return*/];
            });
        });
    };
    UserController.prototype.loginFace = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, username, imagen, sql, result, imageToBase64, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, username = _a.username, imagen = _a.imagen;
                        sql = "SELECT username, img_url FROM Usuario WHERE username=?";
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, database_1.default.query(sql, [username])];
                    case 2:
                        result = _b.sent();
                        if (result.length > 0) {
                            imageToBase64 = require("image-to-base64");
                            console.log(result[0].img_url);
                            imageToBase64(result[0].img_url) // Image URL
                                .then(function (response) {
                                var imagenBD = response;
                                //COMPARE FACES WITH REK
                                var params = {
                                    SourceImage: {
                                        Bytes: Buffer.from(imagenBD, "base64"),
                                    },
                                    TargetImage: {
                                        Bytes: Buffer.from(imagen, "base64"),
                                    },
                                    SimilarityThreshold: "80",
                                };
                                rek.compareFaces(params, function (err, data) {
                                    if (err) {
                                        res.json({ mensaje: err });
                                        console.log("------------- ERROR ------------ ");
                                    }
                                    else {
                                        res.json({ Comparacion: data.FaceMatches });
                                    }
                                });
                            })
                                .catch(function (error) {
                                console.log(error); // Logs an error if there was one
                                console.log("------------- ERROR ------------ ");
                            });
                        }
                        else {
                            res.json([]);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        res.json([]);
                        console.log("ERROR: " + err_1);
                        console.log("------------- ERROR ------------ ");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.signup = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var attributelist, dataname, attributename, dataemail, attributeemail, datanick, attributenick, nombrei, buff, params;
            return __generator(this, function (_a) {
                attributelist = [];
                dataname = {
                    Name: "name",
                    Value: req.body.name,
                };
                attributename = new AmazonCognitoIdentity.CognitoUserAttribute(dataname);
                attributelist.push(attributename);
                dataemail = {
                    Name: "email",
                    Value: req.body.email,
                };
                attributeemail = new AmazonCognitoIdentity.CognitoUserAttribute(dataemail);
                attributelist.push(attributeemail);
                datanick = {
                    Name: "nickname",
                    Value: req.body.nickname,
                };
                attributenick = new AmazonCognitoIdentity.CognitoUserAttribute(datanick);
                attributelist.push(attributenick);
                nombrei = "profile-pictures/" + req.body.nickname + "-pp" + "-" + uuid_1.v4() + ".jpg";
                buff = Buffer.from(req.body.imagen, "base64");
                params = {
                    Bucket: "p2-bucket-semi1",
                    Key: nombrei,
                    Body: buff,
                    ContentType: "image",
                    ACL: "public-read",
                };
                s3.upload(params, function sync(err, data) {
                    var _this = this;
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        console.log(data.Location);
                        var dataimagen = {
                            Name: "custom:imagen",
                            Value: data.Location + "",
                        };
                        var attributeimagen = new AmazonCognitoIdentity.CognitoUserAttribute(dataimagen);
                        attributelist.push(attributeimagen);
                        var botmode = {
                            Name: "custom:botmode",
                            Value: req.body.bot + "",
                        };
                        var attributebot = new AmazonCognitoIdentity.CognitoUserAttribute(botmode);
                        attributelist.push(attributebot);
                        var crypto = require("crypto");
                        var hash = crypto
                            .createHash("sha256")
                            .update(req.body.password)
                            .digest("hex");
                        console.log(attributelist);
                        var imagen_url_1 = data.Location;
                        cognito.signUp(req.body.nickname, hash + "D**", attributelist, null, function (err, data) { return __awaiter(_this, void 0, void 0, function () {
                            var sql, result, err_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (err) {
                                            console.log(err);
                                            res.json(err.message || err);
                                            return [2 /*return*/];
                                        }
                                        sql = "INSERT INTO Usuario(username,img_url)\n          VALUES(?, ?)";
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, database_1.default.query(sql, [
                                                req.body.nickname,
                                                imagen_url_1
                                            ])];
                                    case 2:
                                        result = _a.sent();
                                        res
                                            .status(200)
                                            .json({
                                            status: true,
                                            result: "Registrado Satisfactoriamente",
                                        });
                                        return [3 /*break*/, 4];
                                    case 3:
                                        err_2 = _a.sent();
                                        res
                                            .status(200)
                                            .json({ status: false, result: "Ocurrio un error" });
                                        console.log("ERROR: " + err_2);
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    return UserController;
}());
exports.userController = new UserController();
