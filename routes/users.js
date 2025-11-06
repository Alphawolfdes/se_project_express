const express = require("express");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const { validateUserInfoBody } = require("../middlewares/validation");

const router = express.Router();

// Remove these routes:
// router.post("/", createUser);
// router.get("/", getUsers);
// router.get("/:id", getUser);

router.get("/me", getCurrentUser);
router.patch("/me", validateUserInfoBody, updateCurrentUser);

// ...other user-related routes if needed...

module.exports = router;
