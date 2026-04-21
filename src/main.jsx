import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'

import { AuthProvider } from './context/AuthContext'

import Layout from './layout/Layout'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import BookingPage from './pages/BookingPage'
import ContactPage from './pages/ContactPage'
import AuthPage from './pages/AuthPage'
import NotFoundPage from './pages/NotFoundPage'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="szolgaltatasok" element={<ServicesPage />} />
                        <Route path="foglalas" element={<BookingPage />} />
                        <Route path="kapcsolat" element={<ContactPage />} />
                        <Route path="fiok" element={<AuthPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
)