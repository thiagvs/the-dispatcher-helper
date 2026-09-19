import MainLayout from "./layout";
import AuthWrapper from "./views/login";

function App() {
  return (
    <AuthWrapper>
      <div className="min-h-screen flex flex-col">
        <MainLayout />
      </div>
    </AuthWrapper>

  );
}

export default App;