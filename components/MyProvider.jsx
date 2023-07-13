"use client"

import React, { useMemo } from 'react'
import { store } from '@/lib/store'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

const Context = React.createContext({
  name: 'Default',
});

let persistor = persistStore(store)

const MyProvider = ({ children }) => {
  const contextValue = useMemo(
    () => ({
      name: 'Ant Design',
    }),
    [],
  );
  return (
    <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Context.Provider value={contextValue}>
          {children}
          </Context.Provider>
        </PersistGate>
    </Provider>
  )
}

export default MyProvider
