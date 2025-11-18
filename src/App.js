import { HashRouter, Routes, Route, useLocation,useNavigate } from 'react-router-dom';
import SignUp from './component/Authentication/SignUp';


function AppContent() {
  return (
    <>
      {/* {loading ? (
        <LoadingSpinner /> // Show only the spinner until loading is complete
      ) : ( */}
      <Routes>
        <Route path='/' element={<SignUp />} />
      </Routes>
      {/* )} */}
    </>
      
  );
}

function App() {

  return (
    <div className="App">
       <HashRouter>
        <AppContent />
      </HashRouter>
    </div>
  );
}
export default App;
// git add .
// git commit -m "Your commit message"
// git push