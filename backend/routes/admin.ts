import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { isDbConnected } from '../db';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET || 'secret';

  // If no DB is connected, use environment variables for mock login
  if (!isDbConnected) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@games.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin_password';
    
    if (email === adminEmail && password === adminPass) {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, user: { email, role: 'admin' }});
    }
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: admin._id, email: admin.email, role: admin.role }});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
