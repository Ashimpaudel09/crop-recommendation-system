import jwt from 'jsonwebtoken';

// VALIDATION MIDDLEWARE
export const validationMiddleware = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      errors: error.details.map(err => err.message),
    });
  }

  next();
};

// AUTH MIDDLEWARE
export const authenticate = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // attach user info for downstream use
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
