import { ImportOutlined } from '@ant-design/icons';
import './App.css';
import Header from './header/header';
import Footer from './footer/footer';
import store from './store';
import { Provider } from "react-redux"
import { Body } from "./body/body";
import { BrowserRouter as Router } from 'react-router-dom';
import { useContext, useState, createContext } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from './api/backendapi';
const msalInstance = new PublicClientApplication(msalConfig);



let searchQueryContext = createContext();

export function App() {
  let [searchQuery, setSearchQuery] = useState("");
  let [searchOpened, setSearchOpened] = useState(false);
  return (
    <Provider store={store}>
      <MsalProvider instance={msalInstance}>
        <searchQueryContext.Provider value={{searchQuery, setSearchQuery, searchOpened, setSearchOpened}}>
          <Router>
              <Header />
              <Body />
              <Footer />
          </Router>
        </searchQueryContext.Provider>
      </MsalProvider>
    </Provider>
  );
}

export function useSearchContext() {
    return useContext(searchQueryContext);
}
