import { useContext , useEffect} from "react";
import { Link } from "react-router-dom";

import { ContexteAudio } from "../utils/contexte/ContexteAudio";


function NotFound(){
    //utilisation du contexte audio pour modifier le son de cette page
    let {handleNomAudio} = useContext(ContexteAudio)
    useEffect(() => {
        //changement du title pour cette page
        document.title = "★ Page inexistante - erreur 404 ★"
        //utilisation du contexte audio pour modifier le son de cette page
        handleNomAudio("EKO.mp3")
    },[])
    
    return (
            <main className="grid min-h-screen place-items-center  px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-2xl font-semibold text-green-600">404</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page introuvable</h1>
                    <p className="mt-6 text-base leading-7 text-gray-600">Désolé, la page que vous recherchez n'existe pas</p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link to="/" className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Retour à la page d'accueil</Link>
                    </div>
                </div>
            </main>
    );
}
export default NotFound ;