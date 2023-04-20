import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import Product from '../components/Product';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                countProducts: action.payload.countProducts,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

const prices = [
    {
        name: '$1 to $50',
        value: '1-50',
    },
    {
        name: '$51 to $200',
        value: '51-200',
    },
    {
        name: '$201 to $1000',
        value: '201-1000',
    },
];


export default function SearchScreen() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search); // /search?category=Shirts
    const category = sp.get('category') || 'all';
    const query = sp.get('query') || 'all';
    const price = sp.get('price') || 'all';
    const color = sp.get('color') || 'all';
    const order = sp.get('order') || 'newest';
    const page = sp.get('page') || 1;

    const [{ loading, error, products, pages, countProducts }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    `/api/products/search?page=${page}&query=${query}&category=${category}&color=${color}&price=${price}&order=${order}`
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(error),
                });
            }
        };
        fetchData();
    }, [category, error, order, page, color, price, query]);

    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`/api/products/categories`);
                setCategories(data);
                //setColors(data2);
            } catch (err) {
                toast.error(getError(err));
            }
        };
        const fetchColors = async () => {
            try {
                const { data } = await axios.get(`/api/products/colors`);
                setColors(data);
            } catch (err) {
                toast.error(getError(err));
            }
        };
        fetchCategories();
        fetchColors();
    }, [dispatch]);

    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page;
        const filterCategory = filter.category || category;
        const filterQuery = filter.query || query;
        const filterColor = filter.color || color;
        const filterPrice = filter.price || price;
        const sortOrder = filter.order || order;
        return `/search?category=${filterCategory}&query=${filterQuery}&color=${filterColor}&price=${filterPrice}&order=${sortOrder}&page=${filterPage}`;
    };
    return (
        <div>
            <Helmet>
                <title>Recherche </title>
            </Helmet>
            <Row>
                <Col md={3} className="decoration bg-dark">
                    <h3>Categories</h3>
                    <div>
                        <ul>
                            <p>
                                <Link
                                    className={'all' === category ? 'text-bold' : ''}
                                    to={getFilterUrl({ category: 'all' })}
                                >
                                    Toutes
                                </Link>
                            </p>
                            {categories.map((c) => (
                                <p key={c}>
                                    <Link
                                        className={c === category ? 'text-bold' : ''}
                                        to={getFilterUrl({ category: c })}
                                    >
                                        {c}
                                    </Link>
                                </p>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Prix</h3>
                        <ul>
                            <p>
                                <Link
                                    className={'all' === price ? 'text-bold' : ''}
                                    to={getFilterUrl({ price: 'all' })}
                                >
                                    Tous
                                </Link>
                            </p>
                            {prices.map((p) => (
                                <p key={p.value}>
                                    <Link
                                        to={getFilterUrl({ price: p.value })}
                                        className={p.value === price ? 'text-bold' : ''}
                                    >
                                        {p.name}
                                    </Link>
                                </p>
                            ))}
                        </ul>
                    </div>
                    <h3>Couleur</h3>
                    <div>
                        <ul>
                            <p>
                                <Link
                                    className={'all' === color ? 'text-bold' : ''}
                                    to={getFilterUrl({ color: 'all' })}
                                >
                                    Toutes
                                </Link>
                            </p>
                            {colors.map((c) => (
                                <p key={c}>
                                    <Link
                                        className={c === color ? 'text-bold' : ''}
                                        to={getFilterUrl({ color: c })}
                                    >
                                        {c}
                                    </Link>
                                </p>
                            ))}
                        </ul>
                    </div>

                </Col>
                <Col md={9}>
                    {loading ? (
                        <LoadingBox></LoadingBox>
                    ) : error ? (
                        <MessageBox variant="danger">{error}</MessageBox>
                    ) : (
                        <>
                            <Row className="justify-content-between mb-3">
                                <Col md={6}>
                                    <div>
                                        {countProducts === 0 ? 'No' : countProducts} Results
                                        {query !== 'all' && ' : ' + query}
                                        {category !== 'all' && ' : ' + category}
                                        {price !== 'all' && ' : Price ' + price}
                                        {color !== 'all' && ' : Color ' + color}
                                        {query !== 'all' ||
                                        category !== 'all' ||
                                        color !== 'all' ||
                                        price !== 'all' ? (
                                            <Button
                                                variant="light"
                                                onClick={() => navigate('/search')}
                                            >
                                                <i className="fas fa-times-circle"></i>
                                            </Button>
                                        ) : null}
                                    </div>
                                </Col>
                                <Col className="text-end">
                                    Trier{' '}
                                    <select
                                        value={order}
                                        onChange={(e) => {
                                            navigate(getFilterUrl({ order: e.target.value }));
                                        }}
                                    >
                                        <option value="newest">Nouveautés</option>
                                        <option value="lowest">Prix croissant</option>
                                        <option value="highest">Prix décroissant</option>
                                        <option value="toprated">Populaires</option>
                                    </select>
                                </Col>
                            </Row>
                            {products.length === 0 && (
                                <MessageBox>No Product Found</MessageBox>
                            )}

                            <Row>
                                {products.map((product) => (
                                    <Col sm={6} lg={4} className="mb-3" key={product._id}>
                                        <Product product={product}></Product>
                                    </Col>
                                ))}
                            </Row>

                            <div>
                                {[...Array(pages).keys()].map((x) => (
                                    <Link
                                        key={x + 1}
                                        className="mx-1"
                                        to={getFilterUrl({ page: x + 1 })}
                                    >
                                        <Button
                                            className={Number(page) === x + 1 ? 'text-bold' : ''}
                                            variant="light"
                                        >
                                            {x + 1}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
}