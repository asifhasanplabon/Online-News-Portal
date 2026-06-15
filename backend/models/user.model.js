import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // password by default response-e ashbe na
    },
    role: {
      type: String,
      enum: ["user", "editor", "admin"],
      default: "user",
    },
    avatar: {
      public_id: { type: String, default: "" },   // cloudinary public_id
      url: { type: String, default: "" },          // cloudinary url
    },
    isActive: {
      type: Boolean,
      default: true, // admin deactivate korte parbe
    },
  },
  { timestamps: true }
);

// ── Save korar age password hash koro ──
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return next(); // shudhu change hole hash korbe
  this.password = await bcrypt.hash(this.password, 12);
});

// ── Password compare method ──
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;