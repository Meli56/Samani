
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import {Badge, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import Bandeau from "./screens/Bandeau";
import {useContext} from "react";
import {Store} from "./Store";
import CartScreen from './screens/CartScreen';
import ContactScreen from './screens/ContactScreen';
import SigninScreen from "./screens/SigninScreen";
import {ToastContainer} from "react-toastify";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchBox from './components/SearchBox';
import SearchScreen from "./screens/SearchScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardScreen from "./screens/DashboardScreen";
import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";

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
                                  <Link to="/contact" className="nav-link">
                                      Contact
                                  </Link>
                                  <Link to="/cart" className="nav-link">
                                      Panier
                                      {cart.cartItems.length > 0 && (
                                          <Badge pill bg="danger" className="mx-2">
                                              {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                                          </Badge>
                                      )}
                                  </Link>
                              {userInfo ? (
                                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                                      <LinkContainer to="/profile">
                                          <NavDropdown.Item>Profil</NavDropdown.Item>
                                      </LinkContainer>
                                      <LinkContainer to="/orderhistory">
                                          <NavDropdown.Item>Historique commandes</NavDropdown.Item>
                                      </LinkContainer>
                                      <NavDropdown.Divider />
                                      <Link
                                          className="dropdown-item"
                                          to="#signout"
                                          onClick={signoutHandler}
                                      >
                                          Déconnexion
                                      </Link>
                                  </NavDropdown>
                              ) : (
                                  <Link className="nav-link" to="/signin">
                                      Connexion
                                  </Link>
                              )}
                              {userInfo && userInfo.isAdmin && (
                                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                                      <LinkContainer to="/admin/dashboard">
                                          <NavDropdown.Item>Tableau de bord</NavDropdown.Item>
                                      </LinkContainer>
                                      <LinkContainer to="/admin/products">
                                          <NavDropdown.Item>Produits</NavDropdown.Item>
                                      </LinkContainer>
                                      <LinkContainer to="/admin/orders">
                                          <NavDropdown.Item>Commandes</NavDropdown.Item>
                                      </LinkContainer>
                                      <LinkContainer to="/admin/users">
                                          <NavDropdown.Item>Utilisateurs</NavDropdown.Item>
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
                      <Route path="/contact" element={<ContactScreen />} />
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
                      <Route
                          path="/admin/orders"
                          element={
                              <AdminRoute>
                                  <OrderListScreen />
                              </AdminRoute>
                          }
                      ></Route>
                      <Route
                          path="/admin/users"
                          element={
                              <AdminRoute>
                                  <UserListScreen />
                              </AdminRoute>
                          }
                      ></Route>
                      <Route
                          path="/admin/user/:id"
                          element={
                              <AdminRoute>
                                  <UserEditScreen />
                              </AdminRoute>
                          }
                      ></Route>


                      <Route path="/" element={<HomeScreen />} />

                  </Routes>

                  </Container>
              </main>
              <footer>
                  <div className="text-center"> © Tous les droits sont réservés - Mentions légales - Conditions de générale de vente<br/>
                      <Link to="/contact" >Contact</Link>
                  </div>
              </footer>
          </div>
      </BrowserRouter>

  );
}

export default App;
