import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Home.jsx';
import App from './App.jsx';
import Map from './Map.jsx';
import Convert from './Convert.jsx';
import Header from './Header.jsx';
import './index.css';

function MainApp() {
  const pathname = window.location.pathname;
  
  const renderComponent = () => {
    switch (pathname) {
      case '/':
        return <Home />;
      case '/App':
        return <App />;
      case '/Map':
        return <Map />;
      case '/Convert':
        return <Convert />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      <Header />
      {renderComponent()}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);