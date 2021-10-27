import { Request, Response } from "express";
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
import aws_keys from "../creds";
import AWS from "aws-sdk";
import pool from "../database";
const s3 = new AWS.S3(aws_keys.s3);
const rek = new AWS.Rekognition(aws_keys.rekognition);
import { v4 as uuidv4 } from "uuid";
const cognito = new AmazonCognitoIdentity.CognitoUserPool(aws_keys.cognito);
class UserController {
  public async loginCognito(req: Request, res: Response) {
    var crypto = require("crypto");
    console.log(req.body);
    console.log("req.body.username; ", req.body.username);
    console.log("password: ", req.body.password);
    var hash = crypto
      .createHash("sha256")
      .update(req.body.password)
      .digest("hex");
    var authenticationData = {
      Username: req.body.username,
      Password: hash + "D**",
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    var userData = {
      Username: req.body.username,
      Pool: cognito,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.setAuthenticationFlowType("USER_PASSWORD_AUTH");

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result: any) {
        // User authentication was successful
        res.json(result); //
      },
      onFailure: function (err: any) {
        // User authentication was not successful
        res.json(err);
      },
    });
  }
  public async editProfileCognito(req: Request, res: Response) {
    var crypto = require("crypto");
    const { username, newpassword, password, name, email, botmode, imgbase64 } =
      req.body;
    var hashOriginal = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    var authenticationData = {
      Username: username,
      Password: hashOriginal + "D**",
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    var userData = {
      Username: username,
      Pool: cognito,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.setAuthenticationFlowType("USER_PASSWORD_AUTH");

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result: any) {
        // User authentication was successful
        var attributelist: any = [];

        var dataname = {
          Name: "name",
          Value: name,
        };
        var attributename = new AmazonCognitoIdentity.CognitoUserAttribute(
          dataname
        );
        attributelist.push(attributename);

        var databot = {
          Name: "custom:botmode",
          Value: botmode,
        };
        var attributebot = new AmazonCognitoIdentity.CognitoUserAttribute(
          databot
        );
        attributelist.push(attributebot);

        var dataemail = {
          Name: "email",
          Value: email,
        };
        var attributeemail = new AmazonCognitoIdentity.CognitoUserAttribute(
          dataemail
        );
        attributelist.push(attributeemail);
        if (imgbase64 === "") {
          console.log("NO IMAGE");
          if (newpassword === "") {
            console.log("NO NEW PASSWORD");
            //JUST UPDATE
            cognitoUser.updateAttributes(
              attributelist,
              function (err: any, resultUpdt: any) {
                if (err) {
                  res.json(err);
                }
                console.log("call result update attributes: " + resultUpdt);
                res.json(resultUpdt);
              }
            );
          } else {
            //UPDATE AND CHANGE PASSWORD
            console.log("NEW PASSWORD");
            var crypto = require("crypto");
            var hashNew = crypto
              .createHash("sha256")
              .update(newpassword)
              .digest("hex");
            cognitoUser.changePassword(
              hashOriginal + "D**",
              hashNew + "D**",
              function (err: any, resultChange: any) {
                if (err) {
                  console.log("err: ", err);
                  res.json(err);
                }
                console.log("call result change password: " + resultChange);
                cognitoUser.updateAttributes(
                  attributelist,
                  function (err: any, resultUpdt: any) {
                    if (err) {
                      res.json(err);
                    }
                    console.log("call result: " + resultUpdt);
                    res.json(resultUpdt);
                  }
                );
              }
            );
          }
        } else {
          //POST TO S3 AND UPDATE
          //PLACE img to S3 profile pictures bucket
          console.log("NEW IMAGE, PLACE S3");
          let nombrei =
            "profile-pictures/" +
            req.body.nickname +
            "-pp" +
            "-" +
            uuidv4() +
            ".jpg";
          let buff = Buffer.from(imgbase64, "base64");
          const params = {
            Bucket: "p2-bucket-semi1",
            Key: nombrei,
            Body: buff,
            ContentType: "image",
            ACL: "public-read",
          };
          s3.upload(params, function sync(err: any, data: any) {
            if (err) {
              res.status(500).send(err);
            } else {
              var dataimagen = {
                Name: "custom:imagen",
                Value: data.Location,
              };
              var attributeimagen =
                new AmazonCognitoIdentity.CognitoUserAttribute(dataimagen);
              attributelist.push(attributeimagen);

              if (newpassword === "") {
                console.log("NO NEW PASSOWRD");
                //JUST UPDATE
                cognitoUser.updateAttributes(
                  attributelist,
                  async function (err: any, resultUpdt: any) {
                    if (err) {
                      res.json(err);
                    }
                    console.log("call result update attributes: " + resultUpdt);
                    let sql = `UPDATE Usuario SET img_url = ?
                     WHERE username=?`;
                    try {
                      const result = await pool.query(sql, [
                        data.Location,
                        username,
                      ]);
                      res.json(resultUpdt);
                    } catch (err) {
                      res
                        .status(200)
                        .json({ status: false, result: "Ocurrio un error" });
                      console.log("ERROR: " + err);
                    }
                  }
                );
              } else {
                //UPDATE AND CHANGE PASSWORD
                var crypto = require("crypto");
                var hashNew = crypto
                  .createHash("sha256")
                  .update(newpassword)
                  .digest("hex");
                cognitoUser.changePassword(
                  hashOriginal + "D**",
                  hashNew + "D**",
                  function (err: any, resultChange: any) {
                    if (err) {
                      res.json(err);
                    }
                    console.log("call result change password: " + resultChange);
                    cognitoUser.updateAttributes(
                      attributelist,
                     async function (err: any, resultUpdt: any) {
                        if (err) {
                          res.json(err);
                        }
                        console.log("call result: " + resultUpdt);
                        let sql = `UPDATE Usuario SET img_url = ?
                        WHERE username=?`;
                       try {
                         const result = await pool.query(sql, [
                           data.Location,
                           username,
                         ]);
                         res.json(resultUpdt);
                       } catch (err) {
                         res
                           .status(200)
                           .json({ status: false, result: "Ocurrio un error" });
                         console.log("ERROR: " + err);
                       }
                      }
                    );
                  }
                );
              }
            }
          });
        }
      },
      onFailure: function (err: any) {
        // User authentication was not successful
        res.json(err);
      },
    });
  }
  public async loginFace(req: Request, res: Response) {
    const { username, imagen } = req.body;

    let sql = `SELECT username, img_url FROM Usuario WHERE username=?`;
    try {
      const result = await pool.query(sql, [username]);
      if (result.length > 0) {
        //Buffer.from("Hello World").toString('base64')
        const imageToBase64 = require("image-to-base64");
        console.log(result[0].img_url);
        imageToBase64(result[0].img_url) // Image URL
          .then((response: any) => {
            let imagenBD = response;
            //COMPARE FACES WITH REK
            let params: any = {
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
              } else {
                res.json({ Comparacion: data.FaceMatches });
              }
            });
          })
          .catch((error: any) => {
            console.log(error); // Logs an error if there was one
            console.log("------------- ERROR ------------ ");
          });
      } else {
        res.json([]);
      }
    } catch (err) {
      res.json([]);
      console.log("ERROR: " + err);
      console.log("------------- ERROR ------------ ");
    }
  }

  public async signup(req: Request, res: Response) {
    var attributelist: any = [];

    var dataname = {
      Name: "name",
      Value: req.body.name,
    };
    var attributename = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataname
    );

    attributelist.push(attributename);

    var dataemail = {
      Name: "email",
      Value: req.body.email,
    };
    var attributeemail = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataemail
    );

    attributelist.push(attributeemail);

    var datanick = {
      Name: "nickname",
      Value: req.body.nickname,
    };
    var attributenick = new AmazonCognitoIdentity.CognitoUserAttribute(
      datanick
    );

    attributelist.push(attributenick);
    //PLACE img to S3 profile pictures bucket
    let nombrei =
      "profile-pictures/" + req.body.nickname + "-pp" + "-" + uuidv4() + ".jpg";
    let buff = Buffer.from(req.body.imagen, "base64");
    const params = {
      Bucket: "p2-bucket-semi1",
      Key: nombrei,
      Body: buff,
      ContentType: "image",
      ACL: "public-read",
    };
    s3.upload(params, function sync(err: any, data: any) {
      if (err) {
        res.status(500).send(err);
      } else {
        console.log(data.Location);
        var dataimagen = {
          Name: "custom:imagen",
          Value: data.Location + "",
        };
        var attributeimagen = new AmazonCognitoIdentity.CognitoUserAttribute(
          dataimagen
        );

        attributelist.push(attributeimagen);

        var botmode = {
          Name: "custom:botmode",
          Value: req.body.bot + "",
        };
        var attributebot = new AmazonCognitoIdentity.CognitoUserAttribute(
          botmode
        );

        attributelist.push(attributebot);

        var crypto = require("crypto");
        var hash = crypto
          .createHash("sha256")
          .update(req.body.password)
          .digest("hex");
        console.log(attributelist);
        let imagen_url = data.Location;
        cognito.signUp(
          req.body.nickname,
          hash + "D**",
          attributelist,
          null,
          async (err: any, data: any) => {
            if (err) {
              console.log(err);

              res.json(err.message || err);
              return;
            }
            //INgresar usuario a la base de datos.
            let sql = `INSERT INTO Usuario(username,img_url)
          VALUES(?, ?)`;

            try {
              const result = await pool.query(sql, [
                req.body.nickname,
                imagen_url,
              ]);
              res.status(200).json({
                status: true,
                result: "Registrado Satisfactoriamente",
              });
            } catch (err) {
              res
                .status(200)
                .json({ status: false, result: "Ocurrio un error" });
              console.log("ERROR: " + err);
            }
          }
        );
      }
    });
  }
}

export const userController = new UserController();
