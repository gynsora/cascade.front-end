import { useEffect, useState } from "react";

//composant , interne au composant RegleAssociation, permettant d'afficher les images de ingredient/ressource nécessaire pour réaliser les exercices.
function ListeImageParTypeRessource({categorie,typeRessource,listeImage }){
    return (
        <>
        {listeImage.map((image,index) => {
            return(
                <img key={image+''+index} src={"/img/"+categorie+"/"+typeRessource+"/"+image} alt={"image "+image} className=" align-middle"></img>
            )
        })}
        </>
    )
}

// fonction permettant de cree un composant qui affiche les regle d'association d'un exercice
function RegleAssociation({detailComposantExercice}){
    const {categorieExercice, composants  ,etapeRessources } = detailComposantExercice ;
    const [classesGridConteneur, setclassesGridConteneur] = useState("");
    //const tailleEtapeRessource = etapeRessources.length ;
    useEffect(() => {
        const tailleEtapeRessource = etapeRessources.length
        setclassesGridConteneur(`grid grid-cols-${tailleEtapeRessource} gap-1`)    
    }, [etapeRessources]);
    return (
        <div>
            
            {composants.map((compo,index) => (// parcours tout les "ingr"dients" de l'exercice
                <div key={'div-'+compo.nom} className ={classesGridConteneur}>
                    {etapeRessources.map((ressource,index) => { //pour chaque "ingredient" on parcours la  table des ressources ("etapeRessources") de l'exercice, cette table contient des valeurs qui correspondent à l'attribut ressource des "coutComposant" de l'ingrédient.
                        const coutCompoRessourceActuel = compo.coutComposant.find((res) => res.ressource === ressource)
                        //console.log(coutCompoRessourceActuel)
                        if(coutCompoRessourceActuel){
                            return (
                                <div key={ressource+'listeImage'}  className="grid grid-cols-2  p-1 md:grid-cols-3 lg:grid-cols-4 ">
                                    <div className ={ (ressource == "symboles" || ressource == "monnaies" ) ? 'grid h-full grid-cols-1 gap-1  p-1 md:col-span-2 md:grid-cols-2 align-middle p-1 items-center justify-center ' : 'grid h-full grid-cols-1 gap-1   p-1  items-center justify-center ' }>
                                        <ListeImageParTypeRessource  
                                            categorie={categorieExercice}
                                            typeRessource={ressource}
                                            listeImage={coutCompoRessourceActuel.listeImg}
                                        />
                                    </div>
                                    { coutCompoRessourceActuel.texte &&
                                         <div className="hidden lg:flex lg:col-span-2  items-center justify-center  h-full">
                                            <p className="bg-white text-center text-lg">{coutCompoRessourceActuel.texte}</p>
                                        </div>
                                    }
                                    { (ressource != "composants" ) &&
                                        <div className="h-full  p-1 py-5">
                                            <img src="/img/arrow1.png" alt="Image 1" className="max-h-12 inline-block" />
                                        </div>
                                    }
                                </div> 
                            )
                        }
                        
                    })}
                </div>
            ))}

        </div>

    );
}


export default RegleAssociation;