import './App.css';
import Crown from './components/Crown.js';
import Message from "./components/Message.js";
import SyncButton from './components/SyncButton.js';
import Nav from './components/Nav.js';

function App() {
  return (
    <>
      <Nav/>
      <Message/>
      <Crown/>
    </>
  );
}

export default App;
