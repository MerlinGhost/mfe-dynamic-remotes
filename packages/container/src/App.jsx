import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
//import { loadRemoteModule } from './libs/load-remote-module';

import Header from './components/Header';
import Home from './components/Home';
import Loader from './components/Loader';
import NotFound from './components/NotFound';

import './index.scss';

//const RemoteProductApp = lazy ( () => loadRemoteModule ( 'product', './ProductApp' ) );

export default () => {
  const [loading, setLoading] = useState ( false );
  
  return <div>
    <BrowserRouter>
      <Header/>
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path='/' element={<Home loading={loading} setLoading={setLoading}/>}/>
          {/*<Route path='/products/*' element={<RemoteProductApp/>}/>*/}
          {/*<Route path='/orders/*' element={<RemoteOrderApp/>}/>*/}
          {/*<Route path='/delivery/*' element={<RemoteDeliveryApp/>}/>*/}
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </div>
};
