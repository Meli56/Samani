
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import {Badge, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import Bandeau from "./screens/Bandeau";
import {useContext} from "react";
import {Store} from "./Store";
import CartScreen from './screens/CartScreen';
import SigninScreen from "./screens/SigninScreen";
import {ToastContainer} from "react-toastify";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";

/*
                  <Routes>
                      <Route path="/" element={<Bandeau />} />
                  </Routes>
 */

function App() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    const signoutHandler = () => {
        ctxDispatch({ type: 'USER_SIGNOUT' });
        localStorage.removeItem('userInfo');
        localStorage.removeItem('shippingAddress');
    };

    return (

      <BrowserRouter>
          <div className="d-flex flex-column site-container">
              <ToastContainer position="bottom-center" limit={1} />
              <header >
                  <Navbar bg="dark" variant="dark" className="nav">
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
                              {userInfo ? (
                                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                                      <LinkContainer to="/profile">
                                          <NavDropdown.Item>User Profile</NavDropdown.Item>
                                      </LinkContainer>
                                      <LinkContainer to="/orderhistory">
                                          <NavDropdown.Item>Order History</NavDropdown.Item>
                                      </LinkContainer>
                                      <NavDropdown.Divider />
                                      <Link
                                          className="dropdown-item"
                                          to="#signout"
                                          onClick={signoutHandler}
                                      >
                                          Sign Out
                                      </Link>
                                  </NavDropdown>
                              ) : (
                                  <Link className="nav-link" to="/signin">
                                      Sign In
                                  </Link>
                              )}
                          </Nav>
                      </Container>
                  </Navbar>
              </header>
              <main className="contain">
                  <Routes>
                      <Route path="/" element={<Bandeau />} />
                  </Routes>
                  <Container className="mt-4">

                  <Routes>
                      <Route path="/product/:slug" element={<ProductScreen />} />
                      <Route path="/cart" element={<CartScreen />} />
                      <Route path="/signin" element={<SigninScreen />} />
                      <Route path="/shipping" element={<ShippingAddressScreen />} />
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
