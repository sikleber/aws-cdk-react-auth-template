import React, { ReactElement } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/loginPage'
import HomePage from './pages/homePage'
import ConfirmUserPage from './pages/confirmUserPage'

const App: React.FunctionComponent = (): ReactElement => {
  const isAuthenticated = (): boolean => {
    const accessToken = sessionStorage.getItem('accessToken')
    return !!accessToken
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            isAuthenticated() ? (
              <Navigate replace to='/home' />
            ) : (
              <Navigate replace to='/login' />
            )
          }
        />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/confirm' element={<ConfirmUserPage />} />
        <Route
          path='/home'
          element={
            isAuthenticated() ? <HomePage /> : <Navigate replace to='/login' />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
