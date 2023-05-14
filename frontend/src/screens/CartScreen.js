import { useContext } from "react";
import { Col, ListGroup, Row, Button, Card } from "react-bootstrap";
import MessageBox from "../components/MessageBox";
import {Store} from '../Store';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import axios from "axios";

export default function CartScreen(){
    const navigate = useNavigate();
    const {state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: {cartItems},
    } = state;

    const updateCartHandler = async (item, quantity) => {
        const { data } = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
          window.alert('Sorry. Product is out of stock');
          return;
        }
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload: { ...item, quantity },
        });
      };
    const removeItemHandler = (item) => {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    };

    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping');
    };

    return (
        <div >
          <Helmet>
            <title>Panier</title>
          </Helmet>
          <h1>Panier</h1>
          <Row>
            <Col md={8}>
              {cartItems.length === 0 ? (
                <MessageBox>
                  Le panier est vide. <Link to="/">Voir les produits</Link>
                </MessageBox>
              ) : (
                <ListGroup>
                  {cartItems.map((item) => (
                    <ListGroup.Item key={item._id} className="items-cart">
                      <Row className="align-items-center">
                        <Col md={4}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                          ></img>{' '}
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </Col>
                        <Col md={3}>
                          <Button variant="light" disabled={item.quantity === 1}
                          onClick={()=> 
                            updateCartHandler(item, item.quantity - 1)
                            }
                        >
                            <i className="fas fa-minus-circle"></i>
                          </Button>{' '}
                          <span>{item.quantity}</span>{' '}
                          <Button
                            variant="light"
                            onClick={()=> 
                                updateCartHandler(item, item.quantity + 1)
                            }
                            disabled={item.quantity === item.countInStock}
                          >
                            <i className="fas fa-plus-circle"></i>
                          </Button>
                        </Col>
                        <Col md={3}>{item.price}€ TTC</Col>
                        <Col md={2}>
                          <Button
                              onClick={() => removeItemHandler(item)}
                              variant="light"
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Col>
            <Col md={4}>
              <Card className="items-cart">
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <h3>
                        Sous total ({cartItems.reduce((a, c) => a + c.quantity, 0)}) <br/>
                          {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}€ TTC
                      </h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button
                          type="button"
                          variant="primary"
                          onClick={checkoutHandler}
                          disabled={cartItems.length === 0}
                        >
                          Valider le panier
                        </Button>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
    );
    
}