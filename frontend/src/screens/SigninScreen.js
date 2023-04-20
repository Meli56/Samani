import {Link, useLocation, useNavigate} from 'react-router-dom';
import {Container, Form, Button} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import {useContext, useEffect, useState} from "react";
import {Store} from "../Store";
import {toast} from "react-toastify";
import {getError} from "../utils";
import 'react-toastify/dist/ReactToastify.css'
import Axios from "axios";

export default function SigninScreen() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const  [email, setEmail] = useState('');
    const  [password, setPassword] = useState('');
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await Axios.post('/api/users/signin', {
                email,
                password,
            });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
        }catch (err){
            toast.error(getError(err));
        }
    }

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);


    return (
        <Container className="small-container" >
            <Helmet>
                <title>Connexion</title>
            </Helmet>
            <h1 className="my-3">Connexion</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control type="password" required  onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Connexion</Button>
                </div>
                <div className="mb-3">
                    Pas de compte ?{' '}
                    <Link to={`/signup?redirect=${redirect}`}>Créer un compte</Link>
                </div>
            </Form>
        </Container>
    );
}