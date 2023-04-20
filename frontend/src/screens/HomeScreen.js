import {Link, useNavigate} from 'react-router-dom';
//import data from '../data';
import {useEffect, useReducer, useState} from "react";
import axios from "axios";
import logger from "use-reducer-logger";
import {Button, Col, Row} from "react-bootstrap";
import Product from "../components/Product";
import {Helmet} from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};


function HomeScreen() {
    const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
        products: [],
        loading: true,
        error: '',
    });
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/search/?query=${query}` : '/search');
    };
    //const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get('/api/products');
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }

            // setProducts(result.data);
        };
        fetchData();
    }, []);
    return (
        <div>
            <Helmet>
                <title>Fihazgin</title>
            </Helmet>
            <section id="section1" className="section1">
                <h1>Nouveautés</h1>
                <div className="products">
                    {loading ? (
                            <LoadingBox/>
                        ):
                        error ? (
                            <MessageBox variant="danger">{error}</MessageBox>
                        ):(
                            <Row>
                                {products.map((product) => (
                                    <Col key={product.slug} sm={6} md={6} lg={3} >
                                        <Product product={product}></Product>
                                    </Col>
                                ))}
                            </Row>
                        )}
                </div>
                <br/>
                <Button className="btn-all" onClick={submitHandler} >Tous les produits</Button>
            </section>
        </div>
    );
}
export default HomeScreen;