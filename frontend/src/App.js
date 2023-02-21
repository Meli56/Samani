
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
import ProtectedRoute from "./components/ProtectedRoute";
import * as PropTypes from "prop-types";
import DashboardScreen from "./screens/DashboardScreen";
import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";

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
              <div className={'d-flex flex-column site-container'}>
              <ToastContainer position="bottom-center" limit={1} />
              <header >
                  <Navbar bg="dark" variant="dark" className="nav" expand="lg">
                      <Container>

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
                              {userInfo && userInfo.isAdmin && (
                                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                                      <LinkContainer to="/admin/dashboard">
                                          <NavDropdown.Item>Dashboard</NavDropdown.Item>
                                      </LinkContainer>
                                      <LinkContainer to="/admin/products">
                                          <NavDropdown.Item>Products</NavDropdown.Item>
                                      </LinkContainer>
                                      <LinkContainer to="/admin/orders">
                                          <NavDropdown.Item>Orders</NavDropdown.Item>
                                      </LinkContainer>
                                      <LinkContainer to="/admin/users">
                                          <NavDropdown.Item>Users</NavDropdown.Item>
                                      </LinkContainer>
                                  </NavDropdown>
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

                      <Route
                          path="/orderhistory"
                          element={<OrderHistoryScreen />}
                          element={
                              <ProtectedRoute>
                                  <OrderHistoryScreen />
                              </ProtectedRoute>
                          }
                      ></Route>
                      <Route
                          path="/order/:id"
                          element={
                              <ProtectedRoute>
                                  <OrderScreen />
                              </ProtectedRoute>
                          }
                      ></Route>
                      <Route
                          path="/profile"
                          element={
                              <ProtectedRoute>
                                  <ProfileScreen />
                              </ProtectedRoute>
                          }
                      />                      <Route path="/search" element={<SearchScreen />} />

                      <Route path="/shipping" element={<ShippingAddressScreen />} />
                      <Route path="/payment" element={<PaymentMethodScreen />}></Route>

                      {/* Admin Routes */}
                      <Route
                          path="/admin/dashboard"
                          element={
                              <AdminRoute>
                                  <DashboardScreen />
                              </AdminRoute>
                          }
                      ></Route>
                      <Route
                          path="/admin/products"
                          element={
                              <AdminRoute>
                                  <ProductListScreen />
                              </AdminRoute>
                          }
                      ></Route>
                      <Route
                          path="/admin/product/:id"
                          element={
                              <AdminRoute>
                                  <ProductEditScreen />
                              </AdminRoute>
                          }
                      ></Route>


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
