import { HashRouter, Route, Routes } from "react-router-dom"

import { AudioProvider } from "./utils/contexte/ContexteAudio"

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
// import Connexion from "./pages/Connexion";
// import Inscription from "./pages/Inscription";
import Exercices from "./pages/Exercices";
import ExerciceAssociation from "./pages/ExerciceAssociation";
import ExerciceQCM from "./pages/ExerciceQCM"

function App() {
  return (
    <Routes>
      {/*<Route path='/inscription' element={<Inscription />} />*/}
      <Route path='/' element={<Home />} />
      <Route path='/exercices' element={<Exercices />} />
      <Route path='*' element={<NotFound />} />
      <Route path='/erreur-404' element={<NotFound />} /> 
      <Route path='/exercice-association/:categorie/:niveau' element={<ExerciceAssociation />} />
      <Route path='/exercice-QCM/:categorie/:niveau' element={<ExerciceQCM />} />
    </Routes>
  );  
}

export function WrappedApp() {
 
  return ( 
    <HashRouter>
        <AudioProvider>
          <Header />
          <App />
          <Footer />
        </AudioProvider>
    </HashRouter>
  );
}


export default App
