
import { useContext , useEffect} from "react";
import { Link } from "react-router-dom";

import { ContexteAudio } from "../utils/contexte/ContexteAudio";


function Home(){
  //utilisation du contexte audio pour modifier le son de cette page
  let {handleNomAudio} = useContext(ContexteAudio)
  useEffect(() => {
    //changement du title pour cette page
    document.title = "★ Cascade - Application d'apprentissage ★"
     //utilisation du contexte audio pour modifier le son de cette page
    handleNomAudio("Jazzure.mp3")
  },[])
   return(
      <main className="min-h-screen"> 
            <div className="text-center mx-auto max-w-2xl py-32 sm:py-32 lg:py-52">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Bienvenue sur Cascade
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 px-2">
              Ici vous pourrez exercice votre mémoire à travers des exercices d'associations, ces exercices ont un but pédagogique et ludique.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {/*<Link to="/connexion" className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                Mode connecté <span aria-hidden="true">→</span>
              </Link>*/}
              <Link to="/exercices" className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Mode invité <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </main>
   )
}

export default Home ;