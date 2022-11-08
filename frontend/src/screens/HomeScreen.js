import { Link } from 'react-router-dom';
//import data from '../data';
import {useEffect, useReducer} from "react";
import axios from "axios";
import logger from "use-reducer-logger";


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

            <section id="section1" className="section1">
            <h1>Produits</h1>
            <div className="products">
                {
                    loading? (
                        <div>Loading...</div>
                    ):
                    error? (
                        <div>{error}</div>
                    ):(
                    products.map((product) => (
                    <div className="product" key={product.slug}>
                        <Link to={`/product/${product.slug}`}>
                            <img src={product.image} alt={product.name} />
                        </Link>
                        <div className="product-info">
                            <Link to={`/product/${product.slug}`}>
                                <h1>{product.name}</h1>
                            </Link>
                            <p>
                                {product.description}
                            </p>
                            <p>
                                <strong>{product.price}€</strong>
                            </p>
                            <button>Ajouter au panier</button>
                        </div>
                    </div>
                )))}
            </div>
            </section>
        </div>
    );
}
export default HomeScreen;