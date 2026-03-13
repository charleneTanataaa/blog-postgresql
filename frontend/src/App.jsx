import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import { Routes, Route } from 'react-router-dom';

function App() {
  return(
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/posts/:id' element={<PostDetail />} />
    </Routes>
  )
}

export default App
