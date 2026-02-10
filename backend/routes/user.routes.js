import express from 'express'
const router = express.Router();
const {validationMiddleware,authenticate} = require("../middlewares/validation.middlewares.js").default;
const {signupUser,getUser} = require("../controllers/user.controllers.js").default;
const {signupSchema} = require("../validation/user.validation.js");

router.post("/signup",validationMiddleware(signupSchema),signupUser);
router.get("/",authenticate,getUser);

module.exports = router;