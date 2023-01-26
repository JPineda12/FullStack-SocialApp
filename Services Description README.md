# Semi1-29-Proyecto2

**UNIVERSIDAD DE SAN CARLOS DE GUATEMALA**<br>
**FACULTAD DE INGENIERÍA**<br>
**ESCUELA DE INGENIERÍA EN CIENCIAS Y SISTEMAS**<br>
**SEMINARIO DE SISTEMAS 1**<br>
**SECCIÓN O**<br>

<br>
<br>
<p align="center"> 
  <img align="center" width="440px" src="doc-images/USAC/logo_usac.svg" />
</p>

**Grupo:** 29<br>
| Nombre                             | Carné     |
|------------------------------------|-----------|
| Juan Antonio Pineda Espino              | 201404405 |



# Arquitectura Implementada

<p align="center"> 
  <img align="center" width="440px" src="doc-images/arquitectura.png" />
</p>

La aplicacion se construyo con una arquitectura basada en la nube (AWS), haciendo uso de su servicio EC2 para crear maquinas virtuales en las cuales se alojaron distintas partes del proyecto como microservicios utilizando docker.

## FRONTEND
<p align="left"> 
  <img align="left" width="100px" src="https://user-images.githubusercontent.com/39974147/139175827-e1c0c503-84d0-4706-ad1e-f05619bd0567.png" />
  <br>
  Para el frontend se utilizo VueJS 3.
</p>
<br>
<br>
El frontend terminado se implemento y lanzo con un contenedor de docker para asi permitir que la EC2 soportara todo lo referente al framework.

El dockerfile que permitio la construccion de la imagen que contendra el contenedor del frontend puede ser visto en

[Frontend Dockerfile](u-social/Dockerfile)

De esta manera se crea una imagen en docker que despues sera expuesta en el puerto 8080. Permitiendo asi su acceso total a traves de la EC2.

## BACKEND
<p align="left"> 
  <img align="left" width="300px" src="https://user-images.githubusercontent.com/39974147/139177997-d98118c5-ef96-4a46-9fb7-5c8858b54c0d.png" />
  <br>
  El backend fue realizado con NodeJS
</p>
<br>
<br>

El backend se conecta a una base de datos que se encuentra alojada en un contenedor diferente que se encuentra en una EC2 diferente a donde se encuentra el Frontend y este Backend. 

El Backend tambien realiza la publicacion y obtención de imagenes de un bucket de S3 previamente configurado.
Este servicio (backend) se implemento en una imagen con la ayuda de docker para que la EC2 pudiera correrlo sin problemas junto con el frontend.
<br>
[Backend Dockerfile](backend/Dockerfile)

## BASE DE DATOS
<p align="left"> 
  <img align="left" width="150px" src="https://user-images.githubusercontent.com/39974147/139179182-d6d301b9-bdd3-40e8-810e-8cf2b7b0a283.png" />
  <br>
  Para la base de datos se utilizo una base de datos relacional de MYSQL.
</p>
<br>
<br>

Esta Base de datos se implemento en una EC2 diferente a la EC2 donde se encuentran los servicios dockerizados del frontend y el backend. 
Para 'dockerizar' esta base de datos simplemente se hizo pull de una imagen ya existente en el repositorio de docker, luego se lanzo y configuro la EC2 para poder acceder al puerto 3306 desde cualquier instancia local de MySQL Workbench 
<br>

[Setup MySQL Docker](https://phoenixnap.com/kb/mysql-docker-container)

## S3 BUCKET
<p align="left"> 
  <img align="left" width="150px" src="https://user-images.githubusercontent.com/39974147/139180098-8c59d5bc-cb11-4de6-b26a-cce17f432ad6.png" />
  <br>
</p>
<br>
<br>
<br>
Para el alojamiento de imagenes se utilizo un bucket de AWS S3. El cual se configuracion dos carpetas distintas para guardar las fotos de perfil y las imagenes de las publicaciones hechas en la aplicacion principal (frontend)
<p align="center"> 
  <img align="center" width="500px" src="https://user-images.githubusercontent.com/39974147/139180057-08c7a24e-cb43-47ba-a470-dfa1f87d5e4c.png" />
</p>

# Usuarios IAM

<p align="center"> 
  <img align="center" width="500px" src="https://user-images.githubusercontent.com/39974147/139183283-cb63ea74-78e2-4f18-ad60-7e733ae9bbf1.png" />
</p>

## Administrador_201404405
### Politica Asociada: AdministratorAccess
Este usuario funciona como administador de los servicios de AWS, su politica permite crear usuarios IAM y acceso a cualquier servicio excepto facturacion.
 
## rekognition_201404405
### Politica Asociada: AmazonRekognitionFullAccess
Este usuario tiene acceso total a los servicios de rekognition para reconocimiento de imagen mediante IA.
 
## s3-201404045
### Politica Asociada: AmazonS3FullAccess
La politica que tiene este usuario permite acceso, creacion, modificacion de archivos en S3 mediante programacion, con su llave secreta se puede acceder desde un backend de NodeJS para postear u obtener imagenes.

 ## semi1-translate
### Politica Asociada: TranslateFullAccess
El usuario semi1-translate tiene una politica asociada que permite el acceso total mediante programacion hacia el servicio de Amazon Translate. De esta forma se pueden hacer peticiones a dicho servicio desde un backend de NodeJS utilizando la llave secreta de este usuario.
   




