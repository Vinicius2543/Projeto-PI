// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './pages/RecipeList';
import RecipeForm from './components/RecipeForm'; 
import Navbar from './components/Navbar';
import './styles/global.css';
import './styles/reactConfirmAlertOverrides.css';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import RecipeEditForm from './components/RecipeEditForm';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <div class="appWrapper">
      <ThemeProvider>
        <Router>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<RecipeList />} />
              <Route path="/nova-receita" element={<RecipeForm />} />
              <Route path="/editar-receita/:id" element={<RecipeEditForm />} />
            </Routes>
          </div>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
