import './App.css';
import Crown from './components/Crown.js';
import Message from "./components/Message.js";
import SyncButton from './components/SyncButton.js';


function App() {
  return (
    <div>
      <Message/>
      <Crown/>
      <SyncButton/>
    </div>
  );
}

export default App;
