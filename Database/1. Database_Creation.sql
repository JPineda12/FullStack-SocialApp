CREATE DATABASE U_Social;
USE U_Social;
CREATE TABLE Usuario(
idUsuario INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
username VARCHAR(400) NOT NULL,
img_url VARCHAR(400) NOT NULL,
email VARCHAR(400) NOT NULL,
nombre VARCHAR(400) NOT NULL,
botmode INTEGER NOT NULL
);

CREATE TABLE Estado_Amistad(
idEstadoAmistad INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
estado VARCHAR(45)
);

CREATE TABLE Solicitud_Amistad(
idAmigo1 INT NOT NULL,
idAmigo2 INT NOT NULL,
idEstado INT NOT NULL,
FOREIGN KEY(idAmigo1) REFERENCES Usuario(idUsuario) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(idAmigo2)  REFERENCES Usuario(idUsuario) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(idEstado) REFERENCES Estado_Amistad(idEstadoAmistad) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Publicacion(
idPublicacion INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
url_imagen VARCHAR(300) NOT NULL,
texto VARCHAR(500),
Publicacion_idUsuario INT NOT NULL,
FOREIGN KEY(Publicacion_idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Etiqueta(
idEtiqueta INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
etiqueta VARCHAR(80) NOT NULL
);

CREATE TABLE Post_Tags(
Publicacion_idPublicacion INT NOT NULL,
Etiqueta_idEtiqueta INT NOT NULL,
FOREIGN KEY(Publicacion_idPublicacion) REFERENCES Publicacion(idPublicacion) ON DELETE CASCADE ON UPDATE CASCADE, 
FOREIGN KEY(Etiqueta_idEtiqueta) REFERENCES Etiqueta(idEtiqueta) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Sala_Chat(
idSala INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
idUsuario1 INT NOT NULL,
idUsuario2 INT NOT NULL,
FOREIGN KEY(idUsuario1) REFERENCES Usuario(idUsuario) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(idUsuario2) REFERENCES Usuario(idUsuario) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Mensaje(
idMensaje INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
texto VARCHAR(500) NOT NULL,
Usuario_idUsuario INT NOT NULL,
Sala_idChat INT NOT NULL,
FOREIGN KEY(Usuario_idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(Sala_idChat) REFERENCES Sala_Chat(idSala) ON DELETE CASCADE ON UPDATE CASCADE
);