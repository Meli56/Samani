import LoadingBox from "../components/LoadingBox";
import React, {useContext, useEffect, useReducer, useState} from "react";
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
    const [count, setCount] = useState(0);
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
            loadingPay,
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
            toast.success('Order is delivered');
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'DELIVER_FAIL' });
        }
    }







    return loading ? (
        <LoadingBox></LoadingBox>
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div>
            <Helmet>
                <title>Order {orderId}</title>
            </Helmet>
            <h1 className="my-3">Order {orderId}</h1>
            <Row>
                <Col md={8}>
                    <Card className="items-cart mb-3">
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                                <strong>Address: </strong> {order.shippingAddress.address},&nbsp;
                                {order.shippingAddress.city},&nbsp;{order.shippingAddress.postalCode}
                                ,&nbsp;{order.shippingAddress.country}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3 items-cart">
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Method:</strong> {order.paymentMethod}
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
                                            <Col md={3}>${item.price}</Col>
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
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${order.itemsPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${order.taxPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> Order Total</strong>
                                        </Col>
                                        <Col>
                                            <strong>${order.totalPrice.toFixed(2)}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        <Button onClick={() => window.open('https://www.sandbox.paypal.com', "_blank")}>
                                            Payer
                                        </Button>

                                    </ListGroup.Item>
                                )}
                                {userInfo.isAdmin && !order.isDelivered && (
                                    <ListGroup.Item>
                                        {loadingDeliver && <LoadingBox></LoadingBox>}
                                        <div className="d-grid">
                                            <Button type="button" onClick={deliverOrderHandler}>
                                                Deliver Order
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
