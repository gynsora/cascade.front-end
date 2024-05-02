import { useContext, useState } from "react";
import { ContexteRealisationExerciceAssociation } from "../utils/contexte/ContexteRealisationExerciceAssociation";
import DivImageSymbolesMonnaiesMateriaux from "./DivImageSymbolesMonnaiesMateriaux";

//permettant d'afficher les symbole, les monnaies et les materiaux en fonction de l'etape de l'exercice choisi
function DivListeSymboleMonnaieMateriaux(){
    const {donneesExerciceChoisi, materielUtilisable,setMaterielUtilisable,etapeExercice,setEtapeExercice,handleConstructionModelAssociation} = useContext(ContexteRealisationExerciceAssociation)
  
  
    

    return (
        <>
        {donneesExerciceChoisi.etapeRessource.map((etape)=>{
            return (
            <div key={etape} className={(etapeExercice == etape) ? "bg-purple-500 p-4 grid grid-cols-3 gap-1" : "hidden" }>
               
                {donneesExerciceChoisi[etape].map((item,index) => (
                   <DivImageSymbolesMonnaiesMateriaux 
                        key={item.nom}
                        item={item}
                        etape={etape}
                    />
                ))}
            </div>
            )
            
        })}
        </>
    )
    
}

export default DivListeSymboleMonnaieMateriaux