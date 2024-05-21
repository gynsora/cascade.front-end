import { useContext, useState } from "react";
import { ContexteRealisationExerciceAssociation } from "../utils/contexte/ContexteRealisationExerciceAssociation";

import comparerTableau from "../utils/fonctionGenerale/comparerTableau";

//fonction permettant d'afficher les images des materiaux, des symboles ou des monnaies en fonction de "l'étape de lexercice"
function DivImageSymbolesMonnaiesMateriaux({item,etape}){
    const {donneesExerciceChoisi,etapeExercice,setEtapeExercice,modelAssociation ,setModelAssociation ,materielUtilisable, setMaterielUtilisable,constructionModelAssociation ,setConstructionModelAssociation}= useContext(ContexteRealisationExerciceAssociation)
    // console.log(item)
    // console.log(etape)
    // console.log(categorie)

    //fonction permettant de construire les règles d'association créer par l'eleve.
    //attention les exercices d'association de niveau 1 ne nécessite pas de construire les regles d'association, on créer un comportement différent à ce moment la
    function handleConstructionModelAssociation(item){
        //permet de gerer les exercices d'association de niveau 1
        if(item.utilisable && (materielUtilisable != item.nom) && donneesExerciceChoisi.ressourceMax == "materiaux"){ 
            //console.log('nouveau matériel utilisable niveau1 ')
            setMaterielUtilisable(item.nom)
        }
        //permet de gerer les exercices d'association de niveau 1
        if(!item.utilisable && donneesExerciceChoisi.ressourceMax == "materiaux"){
            setMaterielUtilisable("")
        }
        //permet de gerer les exercices au dela du niveau 1, lorsque l'etape de l'exercice n'est pas lié à la gestion des matériaux
        if(item.utilisable &&  donneesExerciceChoisi.ressourceMax != "materiaux" && etapeExercice != "materiaux"){
            //console.log(item)
            //console.log("az")
            const nouvelleContructionModelAssociation = constructionModelAssociation
            //console.log(nouvelleContructionModelAssociation)
            nouvelleContructionModelAssociation[etapeExercice].push(item.img)
            //console.log(nouvelleContructionModelAssociation)

            if(modelAssociation == ""){// si il n'y pas encore de model d'association on va en chercher un  
                //permet de voir si constructionModelAssociation (contient un tableau d'image coreespondant à l'un des cout de compasant d'un composant)
                const  nouveauComposantModel = rechercheComposantModelAssociation(nouvelleContructionModelAssociation[etapeExercice])
                if(nouveauComposantModel){
                    //console.log("composant Model trouvé")
                 
                    //setModelAssociation(nouveauComposantModel)
                   
                    const indexEtapeActuelle = donneesExerciceChoisi.etapeRessource.indexOf(etapeExercice)
                    setModelAssociation(nouveauComposantModel)
                    
                    setConstructionModelAssociation({
                        ...constructionModelAssociation,
                        [etapeExercice]:nouvelleContructionModelAssociation[etapeExercice]
                    })
                    
                    setEtapeExercice(donneesExerciceChoisi.etapeRessource[indexEtapeActuelle+1])
                }
                else{
                    setConstructionModelAssociation({
                        ...constructionModelAssociation,
                        [etapeExercice]:nouvelleContructionModelAssociation[etapeExercice]
                    })
                }
             
            }
            if(modelAssociation){// A gerer pour les exercices au dessus du level 2

            }
            
        }
        //permet de gerer les exercices au dela du niveau 1, lorsque l'etape de l'exercice est lié à la gestion des matériaux
        if(item.utilisable &&  donneesExerciceChoisi.ressourceMax != "materiaux" && etapeExercice == "materiaux"){
            //console.log('etape materiaux exercice niveau 2 et plus')
            const coutmaterielDucomposant = modelAssociation.coutComposant.find((res)=> res.ressource == "materiaux")
            //console.log(coutmaterielDucomposant)
            if(coutmaterielDucomposant.listeImg[0] == item.img){
                
                const nouvelleContructionModelAssociation = constructionModelAssociation
                nouvelleContructionModelAssociation[etapeExercice].push(item.img)
                //console.log(nouvelleContructionModelAssociation)
                //setConstructionModelAssociation(nouvelleContructionModelAssociation)
                setConstructionModelAssociation({
                    ...constructionModelAssociation,
                    [etapeExercice]:nouvelleContructionModelAssociation[etapeExercice]
                })
                setMaterielUtilisable(coutmaterielDucomposant.texte)
                
           }
        }
    }

    //cette fonction renvera un objet "composant" en fonction de l'étape de l'exercice et du tableau d'image mit en paramètre
    function rechercheComposantModelAssociation(tableauDimg){
        let nouveauComposantModel = ""
        donneesExerciceChoisi.composants.map((composantModel,index) => {
            const coutNouveauModel = composantModel.coutComposant.find((cout) => cout.ressource === etapeExercice )
            if (comparerTableau(tableauDimg, coutNouveauModel.listeImg) ){
                //console.log('youpi')
                nouveauComposantModel = composantModel 
            }
        })
        return nouveauComposantModel
    }

    return(
        <div className={(materielUtilisable == item.nom ) ? 
                            "p-1 border-2 rounded-md border-blue-100 bg-green-500 cursor-pointer  flex justify-center items-center  hover:border-green-500"
                            :"p-1 border-2 rounded-md border-pink-900              cursor-pointer  flex justify-center items-center  hover:border-green-500"
                        }
            onClick={()=>handleConstructionModelAssociation(item)}>
                <img 
                    src={`img/${donneesExerciceChoisi.categorie}/${etape}/${item.img}`} alt={`images materiel utilisable: ${item.nom}`}
                   
                />
        </div>
    )
}

export default DivImageSymbolesMonnaiesMateriaux

