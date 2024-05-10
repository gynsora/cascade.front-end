import {  useEffect } from "react";


//fonction permettant d'afficher les fleche a chaque changement de phase durant la construction du model d'association
function FlecheInterEtape({modelAssociation,listeEtapes,etape,etapeExercice}){
    if(modelAssociation){     
        const indexEtape = listeEtapes.indexOf(etape)
        //console.log(etapeExercice)
        //console.log(indexEtape)
        const indexEtapeExercice = listeEtapes.indexOf(etapeExercice)
        //console.log(indexEtapeExercice)

        if(indexEtape-indexEtapeExercice <= 0 && indexEtape != 0 ){
           return <img key={etape+"-fleche"} src={`img/arrow1.png`} alt={`image fleche`} className="ml-1 w-8 md:w-12"/> 
        }
    }
}
//fonction permettant d'afficher les images lié a chaque ressource durant la construction du model d'association
function ListeImageEtapeConstructionModelAssociation({constructionModelAssociation,etape,categorie}){
    if(constructionModelAssociation[etape].length > 0){
        return (
            <span key={etape+'listeImages'} className="flex">
                {constructionModelAssociation[etape].map((image,index)=>{
                    return <img key={image+"-"+index} src={`img/${categorie}/${etape}/${image}`} alt={`image construction model association ${image}`} className="ml-1 w-8 md:w-12"/>
                })}
            </span> 
        )
    }

}

//fonction permettant de créer la div qui affichera les regles d'association construite par l'utilisateur (exercice au dela du niveau 1)
function DivConstructionModelAssociation({constructionModelAssociation, listeEtapes,categorie,modelAssociation,etapeExercice}){
    
    
    // useEffect(() => { 
    //     console.log('ziak')
    //     console.log(modelAssociation)
    // }, [constructionModelAssociation]); 
    return (
        <div className="text-white px-6 py-4 border-0 rounded relative mb-2 bg-amber-500">
            <span className="inline-block align-middle mr-8 flex h-8 md:h-12">
            {listeEtapes.map((etape,index)=>{
              return (
                <span key={etape+ index} className="flex">
                <FlecheInterEtape 
                    modelAssociation={modelAssociation}  
                    listeEtapes={listeEtapes}
                    etape={etape}
                    etapeExercice={etapeExercice}
                />
                <ListeImageEtapeConstructionModelAssociation 
                    constructionModelAssociation={constructionModelAssociation}
                    etape={etape}
                    categorie={categorie}
                />
                 </span>
            )
              })} 
            </span>
            {/* <button className="absolute bg-transparent text-3xl font-semibold leading-none right-0 top-0 mt-3 mr-6 outline-none focus:outline-none hover:text-red-500">
                <span>×</span>
            </button> */}
        </div>
    )
}

export default DivConstructionModelAssociation ;

