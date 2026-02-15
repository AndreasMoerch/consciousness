import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ThreadList from './components/ThreadList';
import ThreadComments from './components/ThreadComments';

function App() {
  return (
    <Router basename="/consciousness">
      <Routes>
        <Route path="/" element={<ThreadList />} />
        <Route path="/thread/:threadId" element={<ThreadComments />} />
      </Routes>
    </Router>
  );
}

export default App;
