import mongoose, { Document } from "mongoose";

interface UserMethods {
  isPasswordValid(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface User extends Document, UserMethods {
  _id: mongoose.Types.ObjectId;
  email: string;
  username: string;
  password: string;
  profilePicture?: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface RegisterUserRequest {
  username: string;
    password: string;
    email: string;
    profilePicture?: string;
}
