import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
  },

  password: {
    type: String,
    required: function () {
      return !this.googleId; // 🔥 KEY FIX
    },
    minlength: [8, "Password must be at least 8 characters"],
    select: false
  },

  googleId: { // 🔥 NEW FIELD
    type: String
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },

  isVerified: {
    type: Boolean,
    default: true // 🔥 Google users are already verified
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date

}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function(next) {
  // ❌ skip if no password (Google user)
  if (!this.password) return next();

  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
  
// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;