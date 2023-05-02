import express from "express";
import Product from "../models/productModel.js";
import data from "../data.js";
import expressAsyncHandler from "express-async-handler";
import {isAdmin, isAuth} from "../utils.js";

const productRouter = express.Router();
const PAGE_HOME = 4;
productRouter.get('/', async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_HOME;

    const products = await Product.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    res.send(products);
});

productRouter.post(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {

        const newProduct = new Product({
            name: 'nom ' + Date.now(),
            slug: 'nom-' + Date.now(),
            image: '/images/p1.jpg',
            price: 0,
            category: 'categorie',
            brand: 'marque',
            countInStock: 0,
            rating: 0,
            numReviews: 0,
            description: 'description',
            color: 'couleur',
        });

        const product = await newProduct.save();
        res.send({ message: 'Produit crée', product });
    })
);

productRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {
            product.name = req.body.name;
            product.slug = req.body.slug;
            product.price = req.body.price;
            product.image = req.body.image;
            product.color = req.body.color;
            product.category = req.body.category;
            product.brand = req.body.brand;
            product.countInStock = req.body.countInStock;
            product.description = req.body.description;
            await product.save();
            res.send({ message: 'Produit modifié' });
        } else {
            res.status(404).send({ message: 'Produit non trouvé' });
        }
    })
);

productRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.remove();
            res.send({ message: 'Produit supprimé' });
        } else {
            res.status(404).send({ message: 'Produit non trouvé' });
        }
    })
);


const PAGE_SIZE = 6;
productRouter.get(
    '/admin',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || PAGE_SIZE;

        const products = await Product.find()
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        const countProducts = await Product.countDocuments();
        res.send({
            products,
            countProducts,
            page,
            pages: Math.ceil(countProducts / pageSize),
        });
    })
);


productRouter.get(
    '/search',
    expressAsyncHandler(async (req, res) => {
        const { query } = req;
        const pageSize = query.pageSize || PAGE_SIZE;
        const page = query.page || 1;
        const category = query.category || '';
        const price = query.price || '';
        const color = query.color || '';
        const rating = query.rating || '';
        const order = query.order || '';
        const searchQuery = query.query || '';

        const queryFilter =
            searchQuery && searchQuery !== 'all'
                ? {
                    name: {
                        $regex: searchQuery,
                        $options: 'i',
                    },
                }
                : {};
        const categoryFilter = category && category !== 'all' ? { category } : {};
        const colorFilter = color && color !== 'all' ? { color } : {};
        const ratingFilter =
            rating && rating !== 'all'
                ? {
                    rating: {
                        $gte: Number(rating),
                    },
                }
                : {};
        const priceFilter =
            price && price !== 'all'
                ? {
                    // 1-50
                    price: {
                        $gte: Number(price.split('-')[0]),
                        $lte: Number(price.split('-')[1]),
                    },
                }
                : {};
        const sortOrder =
            order === 'featured'
                ? { featured: -1 }
                : order === 'lowest'
                    ? { price: 1 }
                    : order === 'highest'
                        ? { price: -1 }
                        : order === 'toprated'
                            ? { rating: -1 }
                            : order === 'newest'
                                ? { createdAt: -1 }
                                : { _id: -1 };

        const products = await Product.find({
            ...queryFilter,
            ...categoryFilter,
            ...colorFilter,
            ...priceFilter,
            ...ratingFilter,
        })
            .sort(sortOrder)
            .skip(pageSize * (page - 1))
            .limit(pageSize);

        const countProducts = await Product.countDocuments({
            ...queryFilter,
            ...categoryFilter,
            ...colorFilter,
            ...priceFilter,
            ...ratingFilter,
        });
        res.send({
            products,
            countProducts,
            page,
            pages: Math.ceil(countProducts / pageSize),
        });
    })
);


productRouter.get(
    '/categories',
    expressAsyncHandler(async (req, res) => {
        const categories = await Product.find().distinct('category');
        res.send(categories);
    })
);

productRouter.get(
    '/colors',
    expressAsyncHandler(async (req, res) => {
        const colors = await Product.find().distinct('color');
        res.send(colors);
    })
);





productRouter.get('/slug/:slug', async (req, res) => {
    const product = await Product.findOne({slug: req.params.slug });
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Produit non trouvé' });
    }
});
productRouter.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Produit non trouvé' });
    }
});
export default productRouter;