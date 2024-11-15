const { User } = require("../models/models");
const bcrypt = require("bcrypt");

class AuthController {
  async signUp(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
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

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (user) {
        return res.status(409).json({
          error: "user with this email already exists",
        });
      }
      await User.create({
        email,
        password: hashedPassword,
      });

      return res.status(200).json({
        message: "user create successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }
  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
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
        where: { email },
      });
      if (!user) {
        return res.status(409).json({
          error: "user with this email not exists",
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({
          message: "Invalid  password",
        });
      }

      return res.status(200).json({
        message: "Login successful",
        data: {
          email: user.email,
        },
      });
    } catch (error) {
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }
}
module.exports = new AuthController();
