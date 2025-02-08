import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'boxicons/css/boxicons.min.css'
import 'sweetalert2/dist/sweetalert2.min.css'

import { BrowserRouter as Router , Routes, Route } from "react-router-dom";
import List from './components/Users/list';
import QuestionsList from './components/Questions/QuestionsList';
import NavBar from './components/Admin/NavBar';
import Admin from './components/Admin/Admin';
import Assessments from './components/Admin/Assessments';
const globalStyles = {
  body: {
    fontFamily: 'cnn_sans_display, helveticaneue, Helvetica, Arial, Utkal, sans-serif'
  }
}

// Add global styles
document.body.style.fontFamily = globalStyles.body.fontFamily

function App() {
  return (
    <main>
      <Router>
          <Routes>
              <Route path="/" element={<List />} />
              <Route path="/questions" element={<QuestionsList />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/assessments" element={<Assessments/>} />
          </Routes>
      </Router>
    </main>
  )
}

export default App