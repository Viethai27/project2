import User from '../models/1. AUTH_EMPLOYEE/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {
  // Generate JWT token
  generateToken(user, role = null) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        role: role || user.role || 'patient',
      },
      process.env.JWT_SECRET || 'pamec_secret_key_2024',
      { expiresIn: '7d' }
    );
  }

  // Register new user
  async register(userData) {
    const { name, email, password, phone } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email đã được sử dụng');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username: name,
      email,
      password_hash,
      phone,
      status: 'active',
    });

    const token = this.generateToken(user, user.role);

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        status: user.status,
        role: user.role,
      },
    };
  }

  // Login user
  async login(email, password) {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    // Check if user is active
    if (user.status !== 'active') {
      throw new Error('Tài khoản đã bị khóa hoặc vô hiệu hóa');
    }

    // Check user role - prioritize role field in User model
    let role = user.role || 'patient'; // Use role from User model if exists
    
    // If no role is set in User model, check related collections
    if (!user.role) {
      // Check if user is a doctor (priority check)
      const Doctor = (await import('../models/1. AUTH_EMPLOYEE/Doctor.model.js')).default;
      const doctor = await Doctor.findOne({ user: user._id });
      
      if (doctor) {
        role = 'doctor';
      } else {
        // Only check patient if not a doctor
        const Patient = (await import('../models/3. PATIENT_INSURANCE/Patient.model.js')).default;
        const patient = await Patient.findOne({ user: user._id });
        
        if (patient) {
          role = 'patient';
        }
      }
    }

    const token = this.generateToken(user, role);

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        status: user.status,
        role: role,
      },
    };
  }

  // Get user profile
  async getProfile(userId) {
    const user = await User.findById(userId).select('-password_hash');
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }

    // Check if user is a doctor and get doctor details
    const Doctor = (await import('../models/1. AUTH_EMPLOYEE/Doctor.model.js')).default;
    const doctor = await Doctor.findOne({ user: user._id });
    
    if (doctor) {
      // Return user with doctor details
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: 'doctor',
        // Doctor specific fields
        full_name: doctor.full_name,
        specialty: doctor.specialty,
        specialization: doctor.specialization,
        license_number: doctor.license_number,
        gender: doctor.gender,
        experience_years: doctor.experience_years,
        education: doctor.education,
        description: doctor.description,
        avatar: doctor.avatar,
      };
    }

    // Check if user is a patient
    const Patient = (await import('../models/3. PATIENT_INSURANCE/Patient.model.js')).default;
    const patient = await Patient.findOne({ user: user._id });
    
    if (patient) {
      return {
        ...user.toObject(),
        role: 'patient',
        patientDetails: patient,
      };
    }

    return {
      ...user.toObject(),
      role: 'user',
    };
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      throw new Error('Mật khẩu hiện tại không đúng');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(newPassword, salt);
    await user.save();

    return { message: 'Đổi mật khẩu thành công' };
  }

  // Forgot password - Generate reset token
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Không tìm thấy người dùng với email này');
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // In production, you would send this token via email
    // For now, we'll return it directly
    // TODO: Integrate email service (nodemailer, sendgrid, etc.)
    
    return {
      message: 'Email đặt lại mật khẩu đã được gửi',
      resetToken, // Remove this in production, only send via email
      resetLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`,
    };
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error('Không tìm thấy người dùng');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(newPassword, salt);
      await user.save();

      return { message: 'Đặt lại mật khẩu thành công' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Link đặt lại mật khẩu đã hết hạn');
      }
      throw new Error('Link đặt lại mật khẩu không hợp lệ');
    }
  }
}

export default new AuthService();
