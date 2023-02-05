
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import {Badge, Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import Bandeau from "./screens/Bandeau";
import {useContext, useEffect, useState} from "react";
import {Store} from "./Store";
import CartScreen from './screens/CartScreen';
import SigninScreen from "./screens/SigninScreen";
import {toast, ToastContainer} from "react-toastify";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import {getError} from "./utils";
import axios from "axios";
import SearchBox from './components/SearchBox';
import SearchScreen from "./screens/SearchScreen";

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
        localStorage.removeItem('paymentMethod');
        window.location.href = '/signin';
    };

    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`/api/products/categories`);
                setCategories(data);
            } catch (err) {
                toast.error(getError(err));
            }
        };
        fetchCategories();
    }, []);
    return (

      <BrowserRouter>
              <div
                  className={
                      sidebarIsOpen
                          ? 'd-flex flex-column site-container active-cont'
                          : 'd-flex flex-column site-container'
                  }
              >
              <ToastContainer position="bottom-center" limit={1} />
              <header >
                  <Navbar bg="dark" variant="dark" className="nav" expand="lg">
                      <Container>
                          <Button
                              variant="dark"
                              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                          >
                              <i className="fas fa-bars"></i>
                          </Button>
                          <div
                              className={
                                  sidebarIsOpen
                                      ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
                                      : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
                              }
                          >
                              <Nav className="flex-column text-white w-100 p-2 bg-black">
                                  <Nav.Item>
                                      <strong>Categories</strong>
                                  </Nav.Item>
                                  <Nav.Item>
                                      <LinkContainer to="/" onClick={() => setSidebarIsOpen(false)}>
                                          <Nav.Link>All</Nav.Link>
                                      </LinkContainer>
                                  </Nav.Item>
                                  {categories.map((category) => (

                                      <Nav.Item key={category}>
                                          <LinkContainer
                                              to={{
                                                  pathname: "/search",
                                                  search: `?category=${category}`,
                                              }}

                                              onClick={() => setSidebarIsOpen(false)}
                                          >
                                              <Nav.Link>{category}</Nav.Link>
                                          </LinkContainer>

                                      </Nav.Item>
                                  ))}

                              </Nav>
                          </div>
                          <LinkContainer to="/">
                              <Navbar.Brand>FIHAZGIN</Navbar.Brand>
                          </LinkContainer>
                          <SearchBox />
                          <Navbar.Toggle aria-controls="basic-navbar-nav" />
                          <Navbar.Collapse id="basic-navbar-nav">
                              <Nav className="me-auto  w-100  justify-content-end">
                                  <Link to="/cart" className="nav-link">
                                      Cart
                                      {cart.cartItems.length > 0 && (
                                          <Badge pill bg="danger" className="mx-2">
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
                      </Navbar.Collapse>
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
                      <Route path="/signup" element={<SignupScreen />} />
                      <Route path="/placeorder" element={<PlaceOrderScreen />} />

                      <Route path="/orderhistory" element={<OrderHistoryScreen />}></Route>
                      <Route path="/order/:id" element={<OrderScreen />} />
                      <Route path="/profile" element={<ProfileScreen />} />
                      <Route path="/search" element={<SearchScreen />} />

                      <Route path="/shipping" element={<ShippingAddressScreen />} />
                      <Route path="/payment" element={<PaymentMethodScreen />}></Route>
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
