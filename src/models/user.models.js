import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://placehold.co/200x200`,
        localPath: "",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotpasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  const secret =
    process.env.ACCESS_SECRET_KEY || process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error(
      "ACCESS secret is not set in environment (set ACCESS_SECRET_KEY or ACCESS_TOKEN_SECRET)",
    );
  }

  const expiresInRaw =
    process.env.ACCESS_SECRET_EXPIRY ||
    process.env.ACCESS_TOKEN_EXPIRY ||
    "15m";
  const expiresIn =
    typeof expiresInRaw === "string"
      ? expiresInRaw.trim()
      : String(expiresInRaw);

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    secret,
    { expiresIn },
  );
};

userSchema.methods.generateRefreshToken = async function () {
  const secret =
    process.env.REFRESH_TOKEN_SECRET || process.env.REFRESH_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "REFRESH_TOKEN_SECRET is not set in environment (set REFRESH_TOKEN_SECRET)",
    );
  }

  const expiresInRaw =
    process.env.REFRESH_TOKEN_EXPIRY ||
    process.env.REFRESH_SECRET_EXPIRY ||
    "7d";
  const expiresIn =
    typeof expiresInRaw === "string"
      ? expiresInRaw.trim()
      : String(expiresInRaw);

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    secret,
    { expiresIn },
  );
};

userSchema.methods.generateTemporaryToken = async function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 60 * 1000;

  return { unHashedToken, hashedToken, tokenExpiry };
};

export const User = mongoose.model("User", userSchema);
