import { Routes, Route } from 'react-router-dom';

import AuthPage from './components/AuthPage';
import Index from './components/Index';
// import ShippingForm from './components/ShippingForm';

const Main = () => {
  return (
    <Routes>
      <Route  path='/authpage' element={<AuthPage/>} />
      <Route  path='/' element={<Index/>} />
    </Routes>
  );
}

export default Main;