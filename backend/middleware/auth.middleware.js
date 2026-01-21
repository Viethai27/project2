import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token, vui lòng đăng nhập'
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'pamec_secret_key_2024'
    );

    // Add user info to request (support both formats)
    req.userId = decoded.userId || decoded.id;
    req.user = { id: decoded.userId || decoded.id, email: decoded.email, role: decoded.role };
    req.email = decoded.email;
    req.role = decoded.role;

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

// Alias for protect
export const protect = verifyToken;

// Middleware to check user role
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.role) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập'
      });
    }

    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này'
      });
    }

    next();
  };
};
