USE U_Social;
SELECT * FROM Usuario;

INSERT INTO Estado_Amistad(estado)
VALUES('Amigos');

INSERT INTO Estado_Amistad(estado)
VALUES('Eliminado');

INSERT INTO Estado_Amistad(estado)
VALUES('Pendiente');

/*GET ALL TAGS */
SELECT idEtiqueta, Etiqueta from Etiqueta;
SELECT idUsuario, username, img_url From Usuario
WHERE username = 'admin';

/*GET ALL POSTS*/
SELECT idPublicacion, url_imagen, texto, U.username 
FROM Publicacion P , Usuario U
WHERE P.Publicacion_idUsuario = U.idUsuario
ORDER BY idPublicacion ASC;

/*GET ETIQUETAS */
SELECT e.etiqueta FROM Publicacion P, Etiqueta E, Post_Tags PT
WHERE P.idPublicacion = PT.Publicacion_idPublicacion
AND PT.Etiqueta_idEtiqueta = E.idEtiqueta
AND PT.Publicacion_idPublicacion = 1;

/*POST NEW POST */
INSERT INTO Publicacion(url_imagen, texto, Publicacion_idUsuario)
VALUES("asd", "text", "user");


/*POST M TO M tag to Post*/
INSERT INTO Post_Tags(Publicacion_idPublicacion, Etiqueta_idEtiqueta)
VALUES(3, 3);
COMMIT;

/*ADD FRIENDS */
-- REQUEST SEND
INSERT INTO Solicitud_Amistad(idAmigo1, idAmigo2, idEstado)
VALUES(1,2,3);

-- ACCEPT REQUEST
UPDATE Solicitud_Amistad 
SET idEstado = 1
WHERE idAmigo1 = 1
AND idAmigo2 = 2;
INSERT INTO Solicitud_Amistad(idAmigo1, idAmigo2, idEstado)
VALUES(2,1,1);

--  DELETE FRIEND
UPDATE Solicitud_Amistad 
SET idEstado = 2
WHERE idAmigo1 = 1
AND idAmigo2 = 2;
INSERT INTO Solicitud_Amistad(idAmigo1, idAmigo2, idEstado)
VALUES(2,1,2);

-- GET ALL FRIENDS OF USER
SELECT u.idUsuario, u.username, u.img_url 
FROM Usuario u, Solicitud_Amistad s
WHERE s.idAmigo1 = 1 -- ?
AND s.idEstado = 1 -- ACEPTADA
AND s.idAmigo2 = u.idUsuario;

-- GET ALL USERS (EXCEPT FRIENDS)
SELECT u.idUsuario, u.username, u.img_url, e.estado
FROM Usuario u, Solicitud_Amistad s, estado_amistad e
WHERE s.idAmigo1 = 2
AND s.idEstado <> 1 -- ACEPTADA
AND s.idAmigo2 = u.idUsuario
AND e.idEstadoAmistad = s.idEstado
UNION
SELECT u.idUsuario, u.username, u.img_url, 'NO-FRIENDS'
FROM Usuario u
WHERE u.idUsuario <> 2
AND u.idUsuario NOT IN (SELECT s2.idAmigo1
						FROM Solicitud_Amistad s2
                        WHERE s2.idAmigo2 = 2
                        );

select * from Usuario;

-- GET ALL FRIEND REQUESTS
SELECT u.idUsuario, u.username, u.img_url 
FROM Usuario u, Solicitud_Amistad s
WHERE s.idAmigo2 = 6 -- ? user id
AND s.idEstado = 3 -- PENDING
AND s.idAmigo1 = u.idUsuario;

SELECT * FROM Solicitud_Amistad;
TRUNCATE Solicitud_Amistad;
DELETE FROM Solicitud_Amistad
WHERE idAmigo1= 6
AND idAmigo2 = 2
AND idEstado = 3;
SELECT * from Publicacion;
SELECT * from Etiqueta;
SELECT * from post_tags;

SELECT * FROM Usuario;

-- GET ALL MESSAGE OF USERS IN CHAT
SELECT M.idMensaje, M.texto, M.Usuario_idUsuario, M.Sala_idChat
FROM Mensaje M
WHERE M.Sala_idChat = 3
ORDER BY M.idMensaje ASC;

-- INSERT A CHAT ROOM
INSERT INTO Sala_Chat(idUsuario1, idUsuario2)
VALUES(3, 4);

-- CHECK IF CHAT ROOM EXISTS
SELECT idSala FROM Sala_Chat
WHERE idUsuario1 = 3
AND idUsuario2 = 2
UNION
SELECT idSala FROM Sala_Chat
WHERE idUsuario1 = 2
AND idUsuario = 3;

-- INSERT A NEW MESSAGE IN THE CHAT ROOM
INSERT INTO Mensaje(texto, Usuario_idUsuario, idChat)
VALUES('Hola', 3, 1);

SELECT * FROM Sala_Chat;
DELETE FROM Sala_Chat
WHERE idSala > 1;
USE semi1_proyecto2;

SELECT * FROM Usuario;





