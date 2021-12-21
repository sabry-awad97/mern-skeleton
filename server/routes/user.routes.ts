import express from "express";
import userCtrl from "../controllers/user.controller";

const router = express.Router();

/*
 * /api/users for the following:
 *      Listing users with GET
 *      Creating a new user with POST
 
 * /api/users/:userId for the following:
 *      Fetching a user with GET
 *      Updating a user with PUT
 *      Deleting a user with DELETE
 */

router.route("/api/users").get(userCtrl.list).post(userCtrl.create);

router
    .route("/api/users/:userId")
    .get(userCtrl.read)
    .put(userCtrl.update)
    .delete(userCtrl.remove);

router.param("userId", userCtrl.userByID);

export default router;
