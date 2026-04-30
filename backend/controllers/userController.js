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
exports.forgotPassword = async (req, res) => {
  try {
    await userService.forgotPassword(req.body.email);

    res.status(200).json({
      message: "Password reset link sent to email"
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    await userService.resetPassword(req.params.token, req.body.password);

    res.status(200).json({
      message: "Password reset successful"
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    await userService.changePassword(
      userId,
      req.body.currentPassword,
      req.body.newPassword
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};