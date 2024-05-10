import { useContext , useEffect} from "react";

import { Link } from "react-router-dom";

//DONNEES LIER A LAFFICHAGE DES EXERCICES
import { DonneeExercices } from "../utils/Data";
const donnesExercice = DonneeExercices ;

import { ContexteAudio } from "../utils/contexte/ContexteAudio";

//composant permetttant d'afficher tous les exercices disponible sur le site
function Exercices(){
    // on utilise le context audio pour changer le son, lors du chargement de la page 
    let {handleNomAudio} = useContext(ContexteAudio)

    useEffect(() => {
        //changement du title de la page
        document.title = "★ Cascade - Listes de tout les exercices ★"
        //initialisation de l'audio pour cette page
        handleNomAudio("Jazzure.mp3")
        return() =>{
            document.title = ""
            handleNomAudio("Jazzure.mp3")
        }
    },[])
    
    return (
        <>
        <main className="min-h-screen py-32 sm:py-32 lg:py-42 " >
        
            {/* boucle pour parcourir chaque categorie*/ } 
            {donnesExercice.map((categorieExercice) => (
                <section key={`${categorieExercice.categorie}`}  className="max-w-screen-xl mx-auto mb-2">
                    <div className="p-5">
                        <h1 className="text-3xl mb-2">{categorieExercice.categorie}</h1>
                        <hr className="bg-green-500 border-0 h-1 "/>
                    </div>
                    <div className="px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 ">
                        {/* boucle pour parcourir chaques exercices appartenant à 1 catégorie*/ }
                        { categorieExercice.listeExercice.map((exercice ) => (
                            /* mettre un if else en fonction du type d'exercice */
                            <Link to={"/exercice-association/"+categorieExercice.categorie+"/"+exercice.niveau} key={`${exercice.niveau}`}>
                                <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow border-2  hover:border-green-500  mx-auto cursor-pointer">
                                    <div className="flex flex-col items-center pb-10">
                                        <img className="w-24 h-24 mb-3 rounded-full shadow-lg " src={'img/'+categorieExercice.categorie+'/'+categorieExercice.imgCategorie} alt={'image de la categorie '+categorieExercice.categorie}/>
                                        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{categorieExercice.categorie}</h5>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{exercice.niveau}</span>
                                    </div>
                                </div>
                            </Link>
                            
                       ))}
                        
                   
                    </div>
                </section>
            ))}
            
          
        </main>
        </>
    );
}

export default Exercices;