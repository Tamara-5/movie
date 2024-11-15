const Router = require("express");
const authController = require("../controller/auth.controller");
const movieController = require("../controller/movie.controller");
const router = new Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/auth/sign-up", authController.signUp);
router.post("/auth/sign-in", authController.signIn);
router.post(
  "/movie/create",
  upload.array("files", 12),
  movieController.createMovie
);
router.post("/movie/edit", upload.array("files", 12), movieController.editMovie);
router.post("/movie/get-list", movieController.getList);
module.exports = router;
