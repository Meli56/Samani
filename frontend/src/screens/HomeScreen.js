import { Link } from 'react-router-dom';
//import data from '../data';
import {useEffect, useState} from "react";
import axios from "axios";

function HomeScreen() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('/api/products');
            setProducts(result.data);
        };
        fetchData();
    }, []);
    return (
        <div>
            <div className="bandeau">
                <img src="/images/bandeau.jpg" alt="" />
                <a href="#section1" className="btn_bandeau" >DECOUVRIR</a>
            </div>
            <section id="section1" className="section1">
            <h1>Produits</h1>
            <div className="products">
                {products.map((product) => (
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
                ))}
            </div>
            </section>
        </div>
    );
}
export default HomeScreen;