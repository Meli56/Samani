import React, {useContext, useReducer, useState} from "react";
import { Button, } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import {Store} from "../Store";

export default function ContactScreen(){
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
                    loading: false,
                };
            case 'FETCH_FAIL':
                return { ...state, loading: false, error: action.payload };
        }
    };
    const navigate = useNavigate();
    const [{ loading, error, loadingUpdate, loadingUpload}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });
    const [email, setEmail] = useState('');

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    const handleChange = event => {
        setEmail(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (isValidEmail(email)) {
            toast.success('Mail envoyé ');
            dispatch({ type: 'FETCH_REQUEST' });
            navigate(`/`);
        } else {
            toast.error('Mail non valide');
        }
    };

    return (
        <div >
          <Helmet>
            <title>Contact</title>
          </Helmet>
          <h1>Contact</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" >
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label>Mail</Form.Label>
                        <Form.Control
                                id="message"
                                name="message"
                                value={email}
                                onChange={handleChange}
                            />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Sujet</Form.Label>
                        <Form.Control
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="image">
                        <Form.Label>Message</Form.Label><br/>
                        <Form.Text>
                            <textarea rows={4} className="w-100" />
                        </Form.Text>
                    </Form.Group>
                    <div className="mb-3">
                        <Button type="submit">
                            Envoyer
                        </Button>
                    </div>
                </Form>
        </div>
    );
    
}