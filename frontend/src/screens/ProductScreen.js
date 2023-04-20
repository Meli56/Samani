import { useParams, useNavigate } from 'react-router-dom';
import {useContext, useEffect, useReducer} from "react";
import axios from "axios";
import {Badge, Button, Card, Col, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import Rating from "../components/Rating";
import {Helmet} from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {getError} from "../utils";
import {Store} from "../Store";


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

function ProductScreen() {
    const navigate = useNavigate();
    const params = useParams();
    const {slug} = params;

    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: '',
    });
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`/api/products/slug/${slug}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
    }, [slug]);

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;
    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
        window.alert('Sorry. Product is out of stock');
        return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...product, quantity },
        });
        navigate('/cart');
    };
    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div>
            <section id="section1" className="section1">
            <Row>

                <Col md={6}>
                    <img className="img-large" src={product.image} alt={product.name}/>
                </Col>

                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroupItem>
                            <Helmet>
                                <title>{product.name}</title>
                            </Helmet>
                            <h1>{product.name}</h1>

                        </ListGroupItem>

                        <ListGroupItem>
                            <Rating
                                rating={product.rating}
                                numReviews={product.numReviews}>
                            </Rating>
                        </ListGroupItem>

                        <ListGroupItem>
                            Prix : {product.price}€
                        </ListGroupItem>

                        <ListGroupItem>
                            Description:
                            <p>{product.description}</p>
                        </ListGroupItem>
                        <ListGroupItem>
                            Couleur:
                            <p>{product.color}</p>
                        </ListGroupItem>
                    </ListGroup>
                </Col>

                <Col md={3}>
                    <Card className="items-cart">
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroupItem>
                                    <Row>
                                    <Col>Prix : </Col>
                                        <Col>{product.price}€</Col>
                                    </Row>
                                </ListGroupItem>

                                <ListGroupItem>
                                    <Row>
                                        <Col>Status : </Col>
                                        <Col>{product.countInStock > 0 ? (
                                                <Badge bg="success">En stock</Badge>
                                            ) : (
                                                <Badge bg="danger">Indisponible</Badge>
                                            )
                                        }</Col>
                                    </Row>
                                </ListGroupItem>
                                {product.countInStock > 0 && (
                                    <ListGroupItem>
                                        <div className="d-grid">
                                            <Button onClick={addToCartHandler} variant="primary">
                                                Ajouter au panier
                                            </Button>
                                        </div>
                                    </ListGroupItem>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            </section>
        </div>
    );
}
export default ProductScreen;