const userService = require('../services/userService');

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    await userService.registerUser(req.body, req.file);

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.'
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { token, user } = await userService.loginUser(
      req.body.email,
      req.body.password
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// ================= VERIFY EMAIL =================
exports.verifyEmail = async (req, res) => {
  try {
    await userService.verifyEmail(req.params.token);

    res.send('Email verified successfully. You can now login.');
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// ================= GET PROFILE =================
exports.getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.params.id);

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({
      message: err.message
    });
  }
};

// ================= UPDATE PROFILE =================
exports.updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserProfile(
      req.params.id,
      req.body,
      req.files
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};