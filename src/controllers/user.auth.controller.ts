import { Request, Response } from "express";
import { LoginUserRequest, RegisterUserRequest } from "../types/types";
import { User } from "../models/user.model";

export const loginUser = async (
  req: Request<{}, {}, LoginUserRequest>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await user.isPasswordValid(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const,
      path: "/",
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        message: "User verified successfully",
        data: user,
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const registerUser = async (
  req: Request<{}, {}, RegisterUserRequest>,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(409).json({ message: "Username already exists" });
      return;
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
