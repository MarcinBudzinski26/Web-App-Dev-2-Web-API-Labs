import express from 'express';
import User from './userModel';
import asyncHandler from 'express-async-handler';

const router = express.Router(); // eslint-disable-line

// Get all users
router.get('/', asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
}));

// Register/Create or Authenticate User
router.post('/', asyncHandler(async (req, res) => {
    if (req.query.action === 'register') {
        // Validation for missing fields
        if (!req.body.username || !req.body.password) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }

        // Attempt to save the user
        try {
            const user = await User(req.body).save();
            res.status(201).json({
                code: 201,
                msg: 'Successfully created new user.',
                user,
            });
        } catch (err) {
            // Handle duplicate username or other validation errors
            res.status(400).json({ error: err.message });
        }
    } else {
        // Authentication logic
        const user = await User.findOne(req.body);
        if (!user) {
            return res.status(401).json({ code: 401, msg: 'Authentication failed' });
        } else {
            return res.status(200).json({
                code: 200,
                msg: "Authentication Successful",
                token: 'TEMPORARY_TOKEN',
            });
        }
    }
}));

// Update a user
router.put('/:id', asyncHandler(async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await User.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code: 200, msg: 'User Updated Successfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to Update User' });
    }
}));

export default router;
