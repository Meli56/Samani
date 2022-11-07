import data from "./data";


function App() {
  return (
    <div >
      <header >
        <a href="/">Samani</a>
      </header>
        <main>
            <h1>Products</h1>
            <div className="products">
            {data.products.map(product => (
                <div className="product" key={product.slug}>
                    <img src={product.image} alt={product.name} />
                    <p>{product.name}</p>
                    <p>{product.price}€</p>
                </div>))
            }
            </div>
        </main>
    </div>
  );
}

export default App;
