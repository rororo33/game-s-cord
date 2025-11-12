import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home"
import MyPage from "./page/MyPage/MyPage";
import Template from './template/Template';

function App() {
  return (
    <BrowserRouter>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Mypage" element={<MyPage />} />
        </Routes>
      </Template>
    </BrowserRouter>
  )
}

export default App
