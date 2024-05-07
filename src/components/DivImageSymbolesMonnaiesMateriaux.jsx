import { useContext, useState } from "react";
import { ContexteRealisationExerciceAssociation } from "../utils/contexte/ContexteRealisationExerciceAssociation";


//fonction permettant d'afficher les images des materiaux, des symboles ou des monnaies en fonction de "l'étape de lexercice"
function DivImageSymbolesMonnaiesMateriaux({item,etape}){
    const {donneesExerciceChoisi ,materielUtilisable, setMaterielUtilisable}= useContext(ContexteRealisationExerciceAssociation)
    // console.log(item)
    // console.log(etape)
    // console.log(categorie)

    //fonction permettant de construire les règles d'association créer par l'eleve.
    //attention les exercices d'association de niveau 1 ne nécessite pas de construire les regles d'association, on créer un comportement différent à ce moment la
    function handleConstructionModelAssociation(item){
        if(item.utilisable && (materielUtilisable != item.nom) && donneesExerciceChoisi.ressourceMax == "materiaux"){ 
            //console.log('nouveau matériel utilisable niveau1 ')
            setMaterielUtilisable(item.nom)
        }
        if(!item.utilisable && donneesExerciceChoisi.ressourceMax == "materiaux"){
            setMaterielUtilisable("")
        }
    }


    return(
        <div className={(materielUtilisable == item.nom ) ? 
                            "p-1 border-2 rounded-md border-blue-100 bg-green-500 cursor-pointer  flex justify-center items-center  hover:border-green-500"
                            :"p-1 border-2 rounded-md border-pink-900              cursor-pointer  flex justify-center items-center  hover:border-green-500"
                        }
            onClick={()=>handleConstructionModelAssociation(item)}>
                <img 
                    src={`img/${donneesExerciceChoisi.categorie}/${etape}/${item.img}`} 
                   
                />
        </div>
    )
}

export default DivImageSymbolesMonnaiesMateriaux

