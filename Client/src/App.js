import { ImportOutlined } from '@ant-design/icons';
import './App.css';
import Header from './header/header';
import Footer from './footer/footer';
import store from './store';
import { Provider } from "react-redux"
import { Body } from "./body/body";
import { BrowserRouter as Router } from 'react-router-dom';
import { useContext, useState, createContext } from 'react';



let searchQueryContext = createContext();

export function App() {
  let [searchQuery, setSearchQuery] = useState("");
  let [searchOpened, setSearchOpened] = useState(false);
  return (
    <Provider store={store}>
      <searchQueryContext.Provider value={{searchQuery, setSearchQuery, searchOpened, setSearchOpened}}>
        <Router>
            <Header />
            <Body />
            <Footer />
        </Router>
      </searchQueryContext.Provider>
    </Provider>
  );
}

export function useSearchContext() {
    return useContext(searchQueryContext);
}
