import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home"
import Template from './template/Template';
import Search from "./page/Search";

function App() {
  return (
    <BrowserRouter>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search/>} />
        </Routes>
      </Template>
    </BrowserRouter>
  )
}

export default App
