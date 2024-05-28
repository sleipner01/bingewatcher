import './styles/index.scss';
import './styles/colors.scss';

import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { UserProvider } from './context/UserContext';
import { Router } from './routes';

const serverURI = new HttpLink({
  uri: import.meta.env.VITE_SERVER_URI as string,
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: serverURI,
});

const root = ReactDOM.createRoot(document.getElementById('root')!);

// Call root.render() to render your app
root.render(
  <React.StrictMode>
    <UserProvider>
      <ApolloProvider client={client}>
        <RouterProvider router={Router} />
      </ApolloProvider>
    </UserProvider>
  </React.StrictMode>,
);
