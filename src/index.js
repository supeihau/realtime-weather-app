import React from 'react';
import ReactDOM from 'react-dom/client';
//這個css會作用到全域上
import './index.css';
import WeatherApp from './WeatherApp';
// 把APP打包成PWA(漸進式網頁應用) 
// import * as serviceWorker from './service-worker.js';
import * as serviceWorker from './serviceWorker'
// import reportWebVitals form './reportWebVitals.js';

const App = () => {
  return(
    <WeatherApp />
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 把APP打包成PWA
serviceWorker.register();
