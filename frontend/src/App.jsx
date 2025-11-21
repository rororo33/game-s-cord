import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Template from "./template/Template";
import JoinGameMatch from "./Match/JoinGameMatch.jsx";

function App() {
  return (
    <BrowserRouter>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match" element={<JoinGameMatch />} /> {/*임시 라우트*/}
        </Routes>
      </Template>
    </BrowserRouter>
  );
}

export default App;
