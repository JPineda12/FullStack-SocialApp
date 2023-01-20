USE U_Social;


INSERT INTO Estado_Amistad(estado)
VALUES('Amigos');

INSERT INTO Estado_Amistad(estado)
VALUES('Eliminado');

INSERT INTO Estado_Amistad(estado)
VALUES('Pendiente');

DELIMITER //
CREATE PROCEDURE updateUser(IN p_nombre VARCHAR(400), IN p_botmode INTEGER, IN p_username VARCHAR(400))
BEGIN
		UPDATE Usuario SET nombre = p_nombre, botmode = p_botmode
						WHERE username=p_username;
END //

DELIMITER //
CREATE PROCEDURE sendFriendRequest(IN p_idAmigo1 INT, IN p_idAmigo2 INT)
BEGIN
		UPDATE Solicitud_Amistad 
			SET idEstado = 3
			WHERE idAmigo1 = p_idAmigo1
			AND idAmigo2 = p_idAmigo2;
END //

DELIMITER //
CREATE PROCEDURE insertNewFriendRequest(IN p_idAmigo1 INT, IN p_idAmigo2 INT)
BEGIN
		INSERT INTO Solicitud_Amistad(idAmigo1, idAmigo2, idEstado)
        VALUES(p_idAmigo1,p_idAmigo2, 3);
END //


DELIMITER //
CREATE PROCEDURE confirmFriendRequest(IN p_idAmigo1 INT, IN p_idAmigo2 INT)
BEGIN
		UPDATE Solicitud_Amistad 
    SET idEstado = 1
    WHERE idAmigo1 = p_idAmigo1
    AND idAmigo2 = p_idAmigo2;
END //

DELIMITER //
CREATE PROCEDURE confirmNewFriendRequest(IN p_idAmigo1 INT, IN p_idAmigo2 INT)
BEGIN
		INSERT INTO Solicitud_Amistad(idAmigo1, idAmigo2, idEstado)
        VALUES(p_idAmigo1,p_idAmigo2, 1);
END //

DELIMITER //
CREATE PROCEDURE rejectFriendRequest(IN p_idAmigo1 INT, IN p_idAmigo2 INT)
BEGIN
		UPDATE Solicitud_Amistad 
    SET idEstado = 2
    WHERE idAmigo1 = p_idAmigo1
    AND idAmigo2 = p_idAmigo2;
END //

DELIMITER //
CREATE PROCEDURE rejectNewFriendRequest(IN p_idAmigo1 INT, IN p_idAmigo2 INT)
BEGIN
		INSERT INTO Solicitud_Amistad(idAmigo1, idAmigo2, idEstado)
        VALUES(p_idAmigo1,p_idAmigo2, 2);
END //

DELIMITER //
CREATE PROCEDURE getAllFriends(IN p_idUsuario INT)
BEGIN
		SELECT u.idUsuario, u.username, u.img_url 
    FROM Usuario u, Solicitud_Amistad s
    WHERE s.idAmigo1 = p_idUsuario
    AND s.idEstado = 1
    AND s.idAmigo2 = u.idUsuario;
END //

DELIMITER //
CREATE PROCEDURE getNoFriends(IN p_idUsuario INT)
BEGIN
		SELECT u.idUsuario, u.username, u.img_url, e.estado
    FROM Usuario u, Solicitud_Amistad s, Estado_Amistad e
    WHERE s.idAmigo1 = p_idUsuario
    AND s.idEstado <> 1
    AND s.idAmigo2 = u.idUsuario
    AND e.idEstadoAmistad = s.idEstado
    UNION
    SELECT u.idUsuario, u.username, u.img_url, 'NO-FRIENDS'
    FROM Usuario u
    WHERE u.idUsuario <> p_idUsuario
    AND u.idUsuario NOT IN (SELECT s2.idAmigo1
                            FROM Solicitud_Amistad s2
                            WHERE s2.idAmigo2 =p_idUsuario);
END //


DELIMITER //
CREATE PROCEDURE getFriendsRequests(IN p_idUsuario INT)
BEGIN
		SELECT u.idUsuario, u.username, u.img_url 
    FROM Usuario u, Solicitud_Amistad s
    WHERE s.idAmigo2 = p_idUsuario
    AND s.idEstado = 3
    AND s.idAmigo1 = u.idUsuario;
END //

/*
DELIMITER //
CREATE PROCEDURE getAllPosts()
BEGIN
		SELECT u.idUsuario, u.username, u.img_url 
    FROM Usuario u, Solicitud_Amistad s
    WHERE s.idAmigo2 = p_idUsuario
    AND s.idEstado = 3
    AND s.idAmigo1 = u.idUsuario;
END //
*/





