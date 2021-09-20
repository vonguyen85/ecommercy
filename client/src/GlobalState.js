import React, {createContext, useState} from 'react'

export const GlobalState = createContext()

export const DataProvider = ({children}) =>{
    return (
        <GlobalState.Provider value={{name: 'aa', date: '11/11'}}>
            {children}
        </GlobalState.Provider>
    )
}