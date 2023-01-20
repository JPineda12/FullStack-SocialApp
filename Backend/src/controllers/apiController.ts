import { Request, Response } from "express";
import pool from "../database";
import AWS from "aws-sdk";
import aws_keys from "../creds";
const s3 = new AWS.S3(aws_keys.s3);
import { v4 as uuidv4 } from "uuid";

class ApiController {
  public async translatePost(req: Request, res: Response) {
    const translate = new AWS.Translate(aws_keys.translate);
    const postText = req.body.text;
    let params = {
      SourceLanguageCode: "auto",
      TargetLanguageCode: "es",
      Text: postText || "Hello there",
    };
    translate.translateText(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        res.send({ error: err })
      } else {
        res.send({ message: data })
      }
    });
  }

  public async sendRequest(req: Request, res: Response) {
    const { idAmigo1, idAmigo2 } = req.body;
    let sql0 = `CALL sendFriendRequest(?, ?)`;
    const result0 = await pool.query(sql0, [idAmigo1, idAmigo2]);
    try {
      if (result0.changedRows > 0) {
        res.status(200).json({
          status: true,
          result: "Solicitud Enviada Correctamente (updated)",
        });
      } else {
        let sql = `CALL insertNewFriendRequest(?,?)`;
        try {
          const result = await pool.query(sql, [idAmigo1, idAmigo2]);
          res.status(200).json({
            status: true,
            result: "Solicitud Enviada Correctamente (inserted)",
          });
        } catch (err) {
          res.status(200).json({ status: false, result: "Ocurrio un error" });
          console.log("ERROR: " + err);
        }
      }
    } catch (err) {
      res.status(200).json({ status: false, result: "Ocurrio un error" });
      console.log("ERROR: " + err);
    }
  }
  public async sendRequest_Again(req: Request, res: Response) {
    const { idAmigo1, idAmigo2 } = req.body;
    let sql = `CALL sendFriendRequest(?, ?);`;
    try {
      const result = await pool.query(sql, [idAmigo1, idAmigo2]);
      let sql2 = `CALL sendFriendRequesT(?, ?);`;
      try {
        //Send idAmigo2 first and then idAmigo1 :)
        const result2 = await pool.query(sql2, [idAmigo2, idAmigo1]);
        res.status(200).json({
          status: true,
          result: "Solicitud Aceptada Correctamente",
        });
      } catch (err) {
        res.status(200).json({
          status: false,
          result: "Ocurrio un error al insertar en Solicitud_Amistad ACEPTADA",
        });
        console.log("ERROR: " + err);
      }
    } catch (err) {
      res.status(200).json({
        status: false,
        result: "Ocurrio un error al hacer UPDATE en Solicitud_Amistad",
      });
      console.log("ERROR: " + err);
    }
  }
  public async confirmRequest(req: Request, res: Response) {
    const { idAmigo1, idAmigo2 } = req.body;
    let sql = `CALL confirmFriendRequest(?,?);`;
    try {
      const result = await pool.query(sql, [idAmigo1, idAmigo2]);
      let sql2 = `CALL confirmFriendRequest(?,?);`;
      /*
       */
      try {
        //Send idAmigo2 first and then idAmigo1 :)
        const result2 = await pool.query(sql2, [idAmigo2, idAmigo1]);
        if (result2.changedRows > 0) {
          res.status(200).json({
            status: true,
            result: "Solicitud Aceptada Correctamente",
          });
        } else {
          let sql3 = `CALL confirmNewFriendRequest(?,?)`;
          try {
            const result3 = await pool.query(sql3, [idAmigo2, idAmigo1]);
            res.status(200).json({
              status: true,
              result: "Solicitud Aceptada Correctamente",
            });
          } catch (err) {
            res.status(200).json({
              status: false,
              result:
                "Ocurrio un error al insertar en Solicitud_Amistad ACEPTADA",
            });
            console.log("ERROR: " + err);
          }
        }
      } catch (err) {
        res.status(200).json({
          status: false,
          result: "Ocurrio un error al insertar en Solicitud_Amistad ACEPTADA",
        });
        console.log("ERROR: " + err);
      }
    } catch (err) {
      res.status(200).json({
        status: false,
        result: "Ocurrio un error al hacer UPDATE en Solicitud_Amistad",
      });
      console.log("ERROR: " + err);
    }
  }
  public async rejectRequest(req: Request, res: Response) {
    const { idAmigo1, idAmigo2 } = req.body;
    let sql = `CALL rejectFriendRequest(?,?)`;
    try {
      const result = await pool.query(sql, [idAmigo1, idAmigo2]);
      let sql2 = `CALL rejectNewFriendRequest(?,?)`;
      try {
        //Send idAmigo2 first and then idAmigo1 :)
        const result2 = await pool.query(sql2, [idAmigo2, idAmigo1]);
        res.status(200).json({
          status: true,
          result: "Solicitud Rechazada Correctamente",
        });
      } catch (err) {
        res.status(200).json({
          status: false,
          result: "Ocurrio un error al insertar en Solicitud_Amistad RECHAZADA",
        });
        console.log("ERROR: " + err);
      }
    } catch (err) {
      res.status(200).json({
        status: false,
        result: "Ocurrio un error al hacer UPDATE en Solicitud_Amistad",
      });
      console.log("ERROR: " + err);
    }
  }
  public async getAllTags(req: Request, res: Response) {
    let sql = `SELECT idEtiqueta, Etiqueta from Etiqueta`;
    try {
      const result = await pool.query(sql, []);
      if (result.length > 0) {
        res.json(result);
      } else {
        res.json([]);
      }
    } catch (err) {
      res.json([]);
      console.log("ERROR: " + err);
    }
  }

  public async getAllFriends(req: Request, res: Response) {
    const iduser = req.params.iduser;
    let sql = `CALL getAllFriends(?)`;
    try {
      const result = await pool.query(sql, [iduser]);
      if (result.length > 0) {
        res.json(result);
      } else {
        res.json([]);
      }
    } catch (err) {
      res.json([]);
      console.log("ERROR: " + err);
    }
  }
  public async getAllExceptFriends(req: Request, res: Response) {
    const iduser = req.params.iduser;
    let sql = `CALL getNoFriends(?);`;
    try {
      const result = await pool.query(sql, [iduser]);
      if (result.length > 0) {
        res.json(result);
      } else {
        res.json([]);
      }
    } catch (err) {
      res.json([]);
      console.log("ERROR: " + err);
    }
  }
  public async getAllFriendRequests(req: Request, res: Response) {
    const iduser = req.params.iduser;
    let sql = `CALL getFriendsRequests(?);`;
    try {
      const result = await pool.query(sql, [iduser]);
      if (result.length > 0) {
        res.json(result);
      } else {
        res.json([]);
      }
    } catch (err) {
      res.json([]);
      console.log("ERROR: " + err);
    }
  }
  public async getUserByName(req: Request, res: Response) {
    const username = req.params.username;
    let sql = `SELECT idUsuario, username, img_url From Usuario
    WHERE username = ?`;
    try {
      const result = await pool.query(sql, [username]);
      if (result.length > 0) {
        res.json(result);
      } else {
        res.json([]);
      }
    } catch (err) {
      res.json([]);
      console.log("ERROR: " + err);
    }
  }
  public async getTestUsers(req: Request, res: Response) {
    const username = req.params.username;
    let sql = `SELECT idUsuario, username, img_url From Usuario`;
    try {
      const result = await pool.query(sql, [username]);
      if (result.length > 0) {
        res.json(result);
      } else {
        res.json([]);
      }
    } catch (err) {
      res.json([]);
      console.log("ERROR: " + err);
    }
  }

  public async getAllPosts(req: Request, res: Response) {
    let sql = `SELECT idPublicacion, url_imagen, texto, U.username as owner
    FROM Publicacion P , Usuario U
    WHERE P.Publicacion_idUsuario = U.idUsuario
    ORDER BY idPublicacion DESC`;
    try {
      const result = await pool.query(sql, []);
      if (result.length > 0) {
        let publicaciones = [];
        for (let i = 0; i < result.length; i++) {
          let sqlTag = `SELECT E.etiqueta FROM Publicacion P, Etiqueta E, Post_Tags PT
          WHERE P.idPublicacion = PT.Publicacion_idPublicacion
          AND PT.Etiqueta_idEtiqueta = E.idEtiqueta
          AND PT.Publicacion_idPublicacion = ?`;
          const resultTag = await pool.query(sqlTag, [result[i].idPublicacion]);
          publicaciones.push({
            publicacion: result[i],
            etiquetas: resultTag,
          });
        }
        res.json(publicaciones);
      } else {
        res.json([]);
      }
    } catch (err) {
      res.json([]);
      console.log("ERROR: " + err);
    }
  }
  public async newPost(req: Request, res: Response) {
    const { imagen, texto, idUser } = req.body;
    //PLACE img to S3 profile pictures bucket
    let nombrei =
      "posts-pictures/" + req.body.nickname + "-pp" + "-" + uuidv4() + ".jpg";
    let buff = Buffer.from(imagen, "base64");
    const params = {
      Bucket: aws_keys.s3.bucketName || '',
      Key: nombrei,
      Body: buff,
      ContentType: "image",
      ACL: "public-read",
    };
    s3.upload(params, async function sync(err: any, data: any) {
      if (err) {
        res.status(500).send(err);
      } else {
        let sql = `INSERT INTO Publicacion(url_imagen, texto, Publicacion_idUsuario)
        VALUES(?, ?, ?)`;
        try {
          const result = await pool.query(sql, [data.Location, texto, idUser]);
          res.status(200).json({
            status: true,
            result: "Publicado Correctamente",
            idPost: result.insertId,
          });
        } catch (err) {
          res.status(200).json({ status: false, result: "Ocurrio un error" });
          console.log("ERROR: " + err);
        }
      }
    });
  }
  public async newTag(req: Request, res: Response) {
    const { tag } = req.body;
    let sql = `INSERT INTO Etiqueta(etiqueta)
    VALUES(?)`;
    try {
      const result = await pool.query(sql, [tag]);
      res.status(200).json({
        status: true,
        result: "Etiqueta ingresada Correctamente",
        idTag: result.insertId,
      });
    } catch (err) {
      res.status(200).json({ status: false, result: "Ocurrio un error" });
      console.log("ERROR: " + err);
    }
  }
  public async publicacionesNTags(req: Request, res: Response) {
    const { idTag, idPublicacion } = req.body;
    let sql = `INSERT INTO Post_Tags(Publicacion_idPublicacion, Etiqueta_idEtiqueta)
    VALUES(?, ?)`;
    try {
      const result = await pool.query(sql, [idPublicacion, idTag]);
      res
        .status(200)
        .json({ status: true, result: "Relacion Tag-Publicacion ingresada" });
    } catch (err) {
      res.status(200).json({ status: false, result: "Ocurrio un error" });
      console.log("ERROR: " + err);
    }
  }

  public async detectEtiquetas(req: Request, res: Response) {
    const { imagen } = req.body;
    const rek = new AWS.Rekognition(aws_keys.rekognition);
    var params = {
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
        if (err) { res.json({ mensaje: "Error" }) }
        else {
          res.json({ status: true, result: data.Labels});
        }
      });
    } catch (err) {
      res.status(200).json({ status: false, result: "Ocurrio un error" });
      console.log("ERROR: " + err);
    }
  }
}

export const apiController = new ApiController();
