
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Header from "./screens/Header";
import {Badge, Container, Nav, Navbar, NavbarBrand} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import Bandeau from "./screens/Bandeau";
import {useContext} from "react";
import {Store} from "./Store";
import CartScreen from './screens/CartScreen';
/*
                  <Routes>
                      <Route path="/" element={<Bandeau />} />
                  </Routes>
 */

function App() {
    const {state} = useContext(Store);
    const {cart} = state;

    return (

      <BrowserRouter>
          <div className="d-flex flex-column site-container">
              <header >
                  <Navbar bg="dark" variant="dark">
                      <Container>
                          <LinkContainer to="/">
                              <Navbar.Brand>SAMANI</Navbar.Brand>
                          </LinkContainer>
                          <Nav className="me-auto">
                              <Link to="/cart" className="nav-link">
                                  Cart&nbsp;&nbsp;
                                  {cart.cartItems.length > 0 && (
                                      <Badge pill bg="danger">
                                           {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                                      </Badge>
                                  )}
                              </Link>
                          </Nav>
                      </Container>
                  </Navbar>
              </header>
              <main>
                  <Container className="mt-4">
                  <Routes>
                      <Route path="/product/:slug" element={<ProductScreen />} />
                      <Route path="/cart" element={<CartScreen />} />
                      <Route path="/" element={<HomeScreen />} />
                  </Routes>
                  </Container>
              </main>
              <footer>
                  <div className="text-center"> © Tous les droits sont réservés</div>
              </footer>
          </div>
      </BrowserRouter>

  );
}

export default App;
