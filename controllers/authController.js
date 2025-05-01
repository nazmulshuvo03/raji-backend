const { User, UserCredential } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Create user with default role "member", no group yet
    const user = await User.create({
      name,
      email,
      role: "member",
      groupId: null,
    });

    // Store password
    const hashedPassword = await bcrypt.hash(password, 10);
    //TODO: User transactions to rollback user creation if credentials creation fails
    await UserCredential.create({
      userId: user.id,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const credentials = await UserCredential.findOne({
      where: { userId: user.id },
    });
    if (!credentials)
      return res.status(403).json({ message: "Credentials not found" });

    const isMatch = await bcrypt.compare(password, credentials.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
