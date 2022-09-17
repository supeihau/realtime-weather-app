import React from 'react';
import ReactDOM from 'react-dom/client';
//這個css會作用到全域上
import './index.css';
import WeatherApp from './WeatherApp';

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
