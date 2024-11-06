import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home';
import Buy from './Pages/Buy';
import Reminder from './Pages/Reminder';
import Pricing from './Pages/Pricing';
import Aboutus from './Pages/Aboutus';
import Loginsignup from './Pages/Loginsignup';
import Sell from './Pages/Sell';
import ProductDisplay from './Components/ProductDisplay/ProductDisplay'; 
import Login from './Pages/Login';
import LoginSuccess from './Pages/LoginSuccess';
import ShopContextProvider from './Context/Context'; // Your existing shop context

function App() {
  return (
    <ShopContextProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/buy' element={<Buy />} />
          <Route path='/product/:productName' element={<ProductDisplay />} />
          <Route path='/sell' element={<Sell />} />
          <Route path='/reminder' element={<Reminder />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/Aboutus' element={<Aboutus />} />
          <Route path='/signup' element={<Loginsignup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/loginsuccess' element={<LoginSuccess />} />
        </Routes>
      </BrowserRouter>
    </ShopContextProvider>
  );
}

export default App;
