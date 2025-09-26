const express = require("express");
const router = express.Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

// Remove these routes:
// router.post("/", createUser);
// router.get("/", getUsers);
// router.get("/:id", getUser);

router.get("/me", getCurrentUser);
router.patch("/me", updateCurrentUser);

// ...other user-related routes if needed...

module.exports = router;
