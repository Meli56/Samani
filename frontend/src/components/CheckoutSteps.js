import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function CheckoutSteps(props) {
    return (
        <Row className="checkout-steps">
            <Col className={props.step1 ? 'active' : ''}>Connexion</Col>
            <Col className={props.step2 ? 'active' : ''}>Livraison</Col>
            <Col className={props.step3 ? 'active' : ''}>Paiement</Col>
            <Col className={props.step4 ? 'active' : ''}>Passer la commande</Col>
        </Row>
    );
}