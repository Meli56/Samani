import data from "./data";


function App() {
  return (
    <div >
      <header >
        <a href="/">Samani</a>
      </header>
        <main>
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
  );
}

export default App;
