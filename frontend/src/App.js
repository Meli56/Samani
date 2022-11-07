import data from "./data";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";


function App() {
  return (
      <BrowserRouter>
        <div >
          <header >
            <a href="/">Samani</a>
          </header>
            <main>
                <Routes>
                    <Route path="/" element={<HomeScreen />} />
                </Routes>
                <h1>Produits</h1>
                <div className="products">
                {data.products.map(product => (
                    <div className="product" key={product.slug}>
                        <a href={`/product/${product.slug}`}>
                            <img src={product.image} alt={product.name} />
                        </a>
                        <div className="product-info">
                            <a href={`/product/${product.slug}`}>
                                <p>{product.name}</p>
                            </a>
                            <p>{product.description}</p>
                            <p><strong>{product.price}€</strong></p>
                            <button>Ajouter au panier</button>
                        </div>
                    </div>))
                }
                </div>
            </main>
        </div>
      </BrowserRouter>
  );
}

export default App;
