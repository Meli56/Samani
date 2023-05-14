import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import {generateToken, isAdmin, isAuth} from '../utils.js';
import Product from "../models/productModel.js";

const userRouter = express.Router();
userRouter.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const users = await User.find({});
        res.send(users);
    })
);
userRouter.get(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: 'Utilisateur non trouvé' });
        }
    })
);

userRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (user) {
            user.name = req.body.name ;
            user.email = req.body.email ;
            user.isAdmin = Boolean(req.body.isAdmin);
            const updatedUser = await user.save();
            res.send({ message: 'Utilisateur modifé', user: updatedUser });
        } else {
            res.status(404).send({ message: 'Utilisateur non trouvé ' });
        }
    })
);
userRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.email === 'admin@example.com') {
                res.status(400).send({ message: 'On ne peut pas supprimer un compte administrateur' });
                return;
            }
            await user.remove();
            res.send({ message: 'Utilisateur supprimé' });
        } else {
            res.status(404).send({ message: 'Utilisateur non trouvé' });
        }
    })
);

userRouter.post(
    '/signin',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user),
                });
                return;
            }
        }
        res.status(401).send({ message: 'Mail ou mot de passe invalide' });
    })
);
userRouter.post(
    '/signup',
    expressAsyncHandler(async (req, res) => {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
        });
        const user = await newUser.save();
        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user),
        });
    })
);

userRouter.put(
    '/profile',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = bcrypt.hashSync(req.body.password, 8);
            }

            const updatedUser = await user.save();
            res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser),
            });
        } else {
            res.status(404).send({ message: 'Utilisateur non trouvé' });
        }
    })
);
export default userRouter;