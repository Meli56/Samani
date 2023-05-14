import LoadingBox from "../components/LoadingBox";
import React, {useContext, useEffect, useReducer} from "react";
import MessageBox from "../components/MessageBox";
import {Store} from "../Store";
import {Link, useNavigate, useParams} from "react-router-dom";
import {getError} from "../utils";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Button, Card, ListGroup} from "react-bootstrap";
import {Helmet} from "react-helmet-async";
import {toast} from "react-toastify";

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'DELIVER_REQUEST':
            return { ...state, loadingDeliver: true };
        case 'DELIVER_SUCCESS':
            return { ...state, loadingDeliver: false, successDeliver: true };
        case 'DELIVER_FAIL':
            return { ...state, loadingDeliver: false };
        case 'DELIVER_RESET':
            return {
                ...state,
                loadingDeliver: false,
                successDeliver: false,
            };
        default:
            return state;
    }
}


export default function OrderScreen(){
    const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams();
    const { id: orderId } = params;
    const navigate = useNavigate();

    const [
        {
            loading,
            error,
            order,
            successPay,
            loadingDeliver,
            successDeliver,
        },
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        order: {},
        error: ''
    });

    useEffect(() => {

        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };

        if (!userInfo) {
            return navigate('/login');
        }
        if (
            !order._id ||
            successPay ||
            successDeliver ||
            (order._id && order._id !== orderId)
        ) {
            fetchOrder();
            if (successDeliver) {
                dispatch({ type: 'DELIVER_RESET' });
            }
        }
    }, [
        order,
        userInfo,
        orderId,
        navigate,
        successPay,
        successDeliver,
    ]);

    async function deliverOrderHandler() {
        try {
            dispatch({ type: 'DELIVER_REQUEST' });
            const { data } = await axios.put(
                `/api/orders/${order._id}/deliver`,
                {},
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({ type: 'DELIVER_SUCCESS', payload: data });
            toast.success('Commande livrée');
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'DELIVER_FAIL' });
        }
    }

    const handleSubmit = event => {
            toast.success('Un mail de confirmation a été envoyé à votre adresse mail');
            dispatch({ type: 'FETCH_REQUEST' });
            navigate(`/`);
    };

    return loading ? (
        <LoadingBox></LoadingBox>
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div>
            <Helmet>
                <title>Commande {orderId}</title>
            </Helmet>
            <h1 className="my-3">Commande {orderId}</h1>
            <Row>
                <Col md={8}>
                    <Card className="items-cart mb-3">
                        <Card.Body>
                            <Card.Title>Livraison</Card.Title>
                            <Card.Text>
                                <strong>Nom:</strong> {order.shippingAddress.fullName} <br />
                                <strong>Adresse: </strong> {order.shippingAddress.address},&nbsp;
                                {order.shippingAddress.city},&nbsp;{order.shippingAddress.postalCode}
                                ,&nbsp;{order.shippingAddress.country}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3 items-cart">
                        <Card.Body>
                            <Card.Title>Paiement</Card.Title>
                            <Card.Text>
                                <strong>Methode:</strong> {order.paymentMethod}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3 items-cart">
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant="flush">
                                {order.orderItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid rounded img-thumbnail"
                                                ></img>{' '}
                                                <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={3}>
                                                <span>{item.quantity}</span>
                                            </Col>
                                            <Col md={3}>{item.price}€ TTC</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-3 items-cart">
                        <Card.Body>
                            <Card.Title>Resumé commande</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col className="align-right">{order.itemsPrice.toFixed(2)}€ TTC</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Livraison</Col>
                                        <Col className="align-right">{order.shippingPrice.toFixed(2)}€ TTC</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> Total</strong>
                                        </Col>
                                        <Col className="align-right">
                                            <strong>{order.totalPrice.toFixed(2)}€ TTC</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        <Button onClick={handleSubmit}>
                                            Payer
                                        </Button>

                                    </ListGroup.Item>
                                )}
                                {userInfo.isAdmin && !order.isDelivered && (
                                    <ListGroup.Item>
                                        {loadingDeliver && <LoadingBox></LoadingBox>}
                                        <div className="d-grid">
                                            <Button type="button" onClick={deliverOrderHandler}>
                                                Livrer la commande
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
