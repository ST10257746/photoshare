// middleware/rbac.js
// Simple role-based access control middleware
export default (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Authorization required' });
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  };
  