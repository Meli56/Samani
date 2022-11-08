
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Header from "./screens/Header";
import {Container, Navbar, NavbarBrand} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import Bandeau from "./screens/Bandeau";


function App() {
  return (

      <BrowserRouter>
          <div className="d-flex flex-column site-container">
              <header >
                  <Navbar bg="dark" variant="dark">
                      <Container>
                          <LinkContainer to="/">
                          <NavbarBrand className="nav">
                              <Routes>
                                  <Route path="/" element={<Header />} />
                              </Routes>
                              SAMANI
                          </NavbarBrand>
                          </LinkContainer>
                      </Container>
                  </Navbar>
              </header>
              <main>
                  <Routes>
                      <Route path="/" element={<Bandeau />} />
                  </Routes>
                  <Container>
                  <Routes>
                      <Route path="/product/:slug" element={<ProductScreen />} />
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
