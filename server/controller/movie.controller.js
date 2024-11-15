const { User, Movie } = require("../models/models");

class MovieController {
  async createMovie(req, res) {
    try {
      const { email, title, year } = req.body;
      if (!email || !title || !year) {
        return res.status(400).json({
          error: {
            message: "not all the required fields are filled",
            status: 400,
          },
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Invalid email format",
        });
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(400).json({
          error: {
            message: "user not found",
            status: 400,
          },
        });
      }
      if (typeof req.files !== "object") {
        throw new Error("Invalid request body");
      }

      if (!Array.isArray(req.files)) {
        throw new Error("Files should be an array");
      }

      const move = await Movie.create({
        title,
        year,
        photo: "/uploads/" + req.files[0].originalname,
        userId: user.id,
      });

      return res.status(200).json({
        message: "movie create successfully",
        data: move,
      });
    } catch (error) {
      return res.status(500).json({
        error: "InternalsignIn Server Error",
      });
    }
  }

  async editMovie(req, res) {
    try {
      const { email, title, year, id } = req.body;

      const newData = {
        title,
        year,
        photo: req.files.length ? "/uploads/" + req.files[0].originalname : "",
      };

      if (!email || !id) {
        return res.status(400).json({
          error: {
            message: "not all the required fields are filled",
            status: 400,
          },
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Invalid email format",
        });
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(400).json({
          error: {
            message: "user not found",
            status: 400,
          },
        });
      }

      if (typeof req.files !== "object") {
        throw new Error("Invalid request body");
      }

      if (!Array.isArray(req.files)) {
        throw new Error("Files should be an array");
      }
      const move = await Movie.findOne({
        where: {
          id,
        },
      });
      const updatedMovie = await Movie.update(
        {
          title: newData.title ? newData.title : move.title,
          year: newData.year ? newData.year : move.year,
          photo: newData.photo ? newData.photo : move.photo,
        },
        {
          where: {
            id,
          },
        }
      );
      return res.status(200).json({
        message: "The movie was edited successfully",
        data: updatedMovie,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }

  async getList(req, res) {
    try {
      const { email, limit, page } = req.body;
      if (!email) {
        return res.status(400).json({
          error: {
            message: "not all the required fields are filled",
            status: 400,
          },
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Invalid email format",
        });
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(400).json({
          error: {
            message: "user not found",
            status: 400,
          },
        });
      }

      const totalCount = await Movie.count({
        where: {
          userid: user.id,
        },
      });

      let lim = limit ? Number(limit) : 10;
      let pag = page
        ? page == 0
          ? 0 * lim
          : Number(Number(page) - 1) * lim
        : 0;
      const movies = await Movie.findAll({
        where: {
          userid: user.id,
        },
        limit: lim,
        offset: pag,
      });
      return res.status(200).json({
        message: "List of the movies",
        data: {
          movies,
          totalCount,
          lim,
          pag,
        },
      });
    } catch (error) {
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }
}
module.exports = new MovieController();
