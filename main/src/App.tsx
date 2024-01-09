import React, { Suspense, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { loadRemoteModule } from './Libs/load-remote-module';

import './index.scss';

import Header from './Components/Header';
import Home from './Components/Home';
import Loader from './Components/Loader';
import NotFound from './Components/NotFound';

// const RemoteProductApp = React.lazy ( () => loadRemoteModule ( 'product', './ProductApp' ) );

const RemoteProductApp = React.lazy ( () => new Promise ( ( resolve, reject ) => {
  loadRemoteModule ( 'product', './ProductApp' )
  .then ( result => {
    console.log ( '[r][result]' );
    console.log ( result );
    
    resolve ( result.default ? result : { default: result } )
  } )
  .catch ( ( error ) => {
    console.log('[r][error]');
    console.log(error);
    
    reject ( error )
  } )
} ) );

const RemoteOrderApp = React.lazy ( () => loadRemoteModule ( 'order', './OrderApp' ) );
const RemoteDeliveryApp = React.lazy ( () => loadRemoteModule ( 'delivery', './DeliveryApp' ) );

const App = () => {
  const [ loading, setLoading ] = useState ( false );
  
  console.log('[r][RemoteProductApp]');
  console.log(RemoteProductApp);
  
  return <div>
    <Header/>
    <Suspense fallback={<Loader/>}>
      <Routes>
        <Route path='/' element={<Home loading={loading} setLoading={setLoading}/>}/>
        <Route path='/products/*' element={<RemoteProductApp/>}/>
        <Route path='/orders/*' element={<RemoteOrderApp/>}/>
        <Route path='/delivery/*' element={<RemoteDeliveryApp/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </Suspense>
  </div>
};

export default App
