import { Router } from "express";
import { apiController } from "../controllers/apiController";
import { userController } from "../controllers/userController";
import { chatController } from "../controllers/chatController";
class ApiRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post("/login", userController.loginCognito);
    this.router.post("/login-face", userController.loginFace);
    this.router.post("/signup", userController.signup);
    this.router.put("/edit-profile", userController.editProfileCognito);

    this.router.get("/tags", apiController.getAllTags);
    this.router.get("/user/:username", apiController.getUserByName);
    this.router.get("/testusers", apiController.getTestUsers);
    this.router.get("/posts", apiController.getAllPosts);
    this.router.post("/new-post", apiController.newPost);
    this.router.post("/detect-etiquetas", apiController.detectEtiquetas);
    this.router.post("/new-tag", apiController.newTag);
    this.router.post("/post-tags", apiController.publicacionesNTags);

    this.router.get("/friends/:iduser", apiController.getAllFriends);
    this.router.get("/requests/:iduser", apiController.getAllFriendRequests);
    this.router.get("/users/:iduser", apiController.getAllExceptFriends);
    this.router.post("/translate/", apiController.translatePost);
    this.router.put("/reject", apiController.rejectRequest);
    this.router.put("/confirm", apiController.confirmRequest);
    this.router.put("/send-again", apiController.sendRequest_Again);
    this.router.post("/send-request", apiController.sendRequest);


    //CHAT QUERIES.
    this.router.post("/room", chatController.getAllMessagesFromRoom);
  }
}

const apiRoutes = new ApiRoutes();
export default apiRoutes.router;
