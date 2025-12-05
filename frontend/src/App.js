import {BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import Guess from "./pages/Guess";


function App() {
  return (
   <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/results" element={<Results />} />
      <Route path="/guess" element={<Guess />} />
    </Routes>
   </Router>
  );
}

export default App;
