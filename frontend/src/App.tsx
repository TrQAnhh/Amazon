import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { ProductDetail } from "./pages/ProductDetail.tsx";
import { OrderDetails } from "./pages/OrderDetails.tsx";
import { CheckoutSuccess } from "./pages/CheckOutSuccess.tsx";
import { CheckoutFailed } from "./pages/CheckOutFailed.tsx";
import { Cart } from "./pages/Cart.tsx";
import { BuyNow } from "./pages/BuyNow.tsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/products" element={<Products />}/>
            <Route path="/products/:sku" element={<ProductDetail />} />
            <Route
              path="/cart"
              element={
                  <ProtectedRoute>
                      <Cart />
                  </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
                path="/orders/:orderId"
                element={
                <ProtectedRoute>
                    <OrderDetails />
                </ProtectedRoute>
                }
            />
            <Route
              path="/buy-now"
              element={
                  <ProtectedRoute>
                      <BuyNow />
                  </ProtectedRoute>
              }
            />
            <Route
              path="/checkout/success"
              element={
                  <ProtectedRoute>
                      <CheckoutSuccess />
                  </ProtectedRoute>
              }
            />
            <Route
              path="/checkout/failed/:orderId"
              element={
                  <ProtectedRoute>
                      <CheckoutFailed />
                  </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/products" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;