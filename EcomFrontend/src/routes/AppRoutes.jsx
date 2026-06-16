import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Layout from '../components/layout/Layout';

import Home from '../pages/Home/Home';
import ProductListing from '../pages/ProductListing/ProductListing';
import ProductDetails from '../pages/ProductDetails/ProductDetails';
import Cart from '../pages/Cart/Cart';
import Checkout from '../pages/Checkout/Checkout';
import OrderSuccess from '../pages/OrderSuccess/OrderSuccess';
import Orders from '../pages/Orders/Orders';
import Profile from '../pages/Profile/Profile';
import Login from '../pages/Login/Login';
import OTPVerification from '../pages/OTPVerification/OTPVerification';
import NotFound from '../pages/NotFound/NotFound';

const AppRoutes = () => (
  <AnimatePresence mode='wait'>
    <Routes>
      {/* Public auth routes (redirect to home if already logged in) */}
      <Route path='/login' element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path='/verify-otp' element={
        <PublicRoute>
          <OTPVerification />
        </PublicRoute>
      } />

      {/* Main layout routes */}
      <Route path='/' element={
        <ProtectedRoute>
          <Layout><Home /></Layout>
        </ProtectedRoute>
      } />
      <Route path='/products' element={
        <ProtectedRoute>
          <Layout><ProductListing /></Layout>
        </ProtectedRoute>
      } />
      <Route path='/product/:id' element={
        <ProtectedRoute>
          <Layout><ProductDetails /></Layout>
        </ProtectedRoute>
      } />
      <Route path='/cart' element={
        <ProtectedRoute>
          <Layout><Cart /></Layout>
        </ProtectedRoute>
      } />
      <Route path='/checkout' element={
        <ProtectedRoute>
          <Layout><Checkout /></Layout>
        </ProtectedRoute>
      } />
      <Route path='/order-success' element={
        <ProtectedRoute>
          <Layout><OrderSuccess /></Layout>
        </ProtectedRoute>
      } />
      <Route path='/orders' element={
        <ProtectedRoute>
          <Layout><Orders /></Layout>
        </ProtectedRoute>
      } />
      <Route path='/profile' element={
        <ProtectedRoute>
          <Layout><Profile /></Layout>
        </ProtectedRoute>
      } />
      <Route path='*' element={<Layout><NotFound /></Layout>} />
    </Routes>
  </AnimatePresence>
);

export default AppRoutes;
