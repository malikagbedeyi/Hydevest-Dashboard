import { HashRouter, Routes, Route, useLocation,useNavigate } from 'react-router-dom';
import SignUp from './component/Authentication/SignUp';
import DashboardPage from './component/Dashboard/DashboardPage';


function AppContent() {
  return (
    <>
      {/* {loading ? (
        <LoadingSpinner /> // Show only the spinner until loading is complete
      ) : ( */}
      <Routes>
        <Route path='/' element={<SignUp />} />
          <Route path='/dashboard' element={<DashboardPage />} />
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

//eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvZW5kcG9pbnRzLmh5ZGV2ZXN0LmNvbVwvYXBpXC92MlwvYXBwXC9hdXRoXC9sb2dpbiIsImlhdCI6MTc2ODY3MjA0MywiZXhwIjoxODAwMjA4MDQzLCJuYmYiOjE3Njg2NzIwNDMsImp0aSI6ImdPaktBWGpQb0tiWHBKWXIiLCJzdWIiOjEsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.WfdZTjMHV55EmXxmun6SJJk1KI2_TgXHA8WFOu1KBAk