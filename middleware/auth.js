import jwt from 'jsonwebtoken';
import Users from '../models/userModel.js';

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decodedToken = jwt.verify(token,'mysecretkey');
        const user = await Users.findOne({ email: decodedToken.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authenticate;