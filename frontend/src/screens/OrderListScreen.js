import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import {toast} from "react-toastify";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                orders: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state;
    }
};
export default function OrderListScreen() {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/orders`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
    }, [userInfo, successDelete]);

    const deleteHandler = async (order) => {
        if (window.confirm('Etes-vous sûr de vouloir supprimer cette commande ?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await axios.delete(`/api/orders/${order._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                toast.success('Commande supprimée');
                dispatch({ type: 'DELETE_SUCCESS' });
            } catch (err) {
                toast.error(getError(error));
                dispatch({
                    type: 'DELETE_FAIL',
                });
            }
        }
    };

    return (
        <div>
            <Helmet>
                <title>Commandes</title>
            </Helmet>
            <h1>Commandes</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table className="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>UTILISATEUR</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAYER</th>
                        <th>LIVRER</th>
                        <th>ACTIONS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.user ? order.user.name : 'UTILISATEUR SUPPRIMÉ'}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>{order.totalPrice.toFixed(2)}</td>
                            <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'Non'}</td>
                            <td>
                                {order.isDelivered
                                    ? order.deliveredAt.substring(0, 10)
                                    : 'Non'}
                            </td>
                            <td>
                                <Button
                                    type="button"
                                    variant="light"
                                    onClick={() => {
                                        navigate(`/order/${order._id}`);
                                    }}
                                >
                                    Details
                                </Button>
                                <Button
                                    type="button"
                                    variant="light"
                                    onClick={() => deleteHandler(order)}
                                >
                                    Supprimer
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}