import React, {createContext, useState} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {KIO} from "./KIO/KIO.component";

const root = ReactDOM.createRoot(
  document.getElementById('root')
);


const createKIOContext = () => {
    const Context = createContext([]);

    const ContextProvider = ({children}) => {
        const [state, setState] = useState({});

        return <Context.Provider value={[state, setState]}>{children}</Context.Provider>
    }

    return {Context, ContextProvider}
}
const kioContext = createKIOContext();




root.render(
    <KIO>
        <App />
    </KIO>
);