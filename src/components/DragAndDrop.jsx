import { useContext, useState, useEffect } from "react";
import { ContexteRealisationExerciceAssociation } from "../utils/contexte/ContexteRealisationExerciceAssociation";
import {  useDrop } from "react-dnd";


import ImageDraggable from "./ImageDraggable";

function DragAndDrop(){
    const {donneesExerciceChoisi,donneeImagesComposantDragAndDrop,materielUtilisable,listeComposantsCreeParLUtilisateur, setlisteComposantsCreeParLUtilisateur} = useContext(ContexteRealisationExerciceAssociation)
    //console.log(donneeImagesComposantDragAndDrop)
    //console.log(donneesExerciceChoisi)
   
    let [{isOver},drop] = useDrop(()=>({
        accept: "image",
        drop: (item)=> handleListeComposantsCreeParLUtilisateur(item),
    }),[materielUtilisable])

   
    //a remplacer plus tard
    function handleListeComposantsCreeParLUtilisateur(item){
        // console.log(donneesExerciceChoisi.categorie)
        // console.log('dropover')
        if(item.materiel == item.materielCompo){
            console.log('youpi ?')
            //console.log(item)
            //console.log(listeComposantsCreeParLUtilisateur)
            // Créez une copie de la liste d'objets
            const nouvelleListeComposantsCreeParLUtilisateur = [...listeComposantsCreeParLUtilisateur];
            //console.log(newListeObjets)
            const composantChoisi = nouvelleListeComposantsCreeParLUtilisateur.find(compo => compo.nom === item.nom);
            //console.log(composantChoisi)
            let indexComposant = nouvelleListeComposantsCreeParLUtilisateur.indexOf(composantChoisi)
            // Modifiez la liste d'images du deuxième objet
            nouvelleListeComposantsCreeParLUtilisateur[indexComposant].listeImg.push(item.img);
            // Mettez à jour la liste des composant Creer par l'uilisateur
            setlisteComposantsCreeParLUtilisateur(nouvelleListeComposantsCreeParLUtilisateur);
        }
    }

    return(
        <>
            <div className="Pictures col-span-1 bg-green-500">  
                {donneeImagesComposantDragAndDrop.map((compo)=>{
                    //console.log(compo)
                    return (
                    <div key={compo.id} className={(materielUtilisable == compo.materiel) ? "bg-pink-900 pt-4" : "hidden" }>
                        {compo.listeImg.map((item,index) => (
                            <ImageDraggable 
                                key={compo.id+"imgdraggable"+item.nom} 
                                id={item.id} nom={item.nom} img={item.img} 
                                categorie={donneesExerciceChoisi.categorie}
                                materiel={item.materiel}
                                materielCompo={compo.materiel}
                                />
                           
                        ))}
                    </div>
                    )
                })}
            </div>
            <div className="col-span-5 bg-blue-500 grid grid-cols-2 gap-1" ref={drop}>
                {listeComposantsCreeParLUtilisateur.map((compo)=>{
                    if (compo.listeImg.length >0){
                        return(
                            <div key={compo.nom} >
                                    <div>{compo.nom}  </div>
                                    <div className="grid grid-cols-5">
                                    {compo.listeImg.map((item,index) => ( 
                                        <div key={index+'a'+item.nom}><img src={`img/${donneesExerciceChoisi.categorie}/composants/${item}`} /></div>
                                    ))}
                                    </div>
                                
                            </div>
                        )
                    }
                   
                })}
               
            </div>
        </>
    )
} 

export default DragAndDrop;

