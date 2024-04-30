import { useContext, useState } from "react";
import { ContexteRealisationExerciceAssociation } from "../utils/contexte/ContexteRealisationExerciceAssociation";
import {  useDrop } from "react-dnd";


import ImageDraggable from "./ImageDraggable";

function DragAndDrop(){
    const {donneesExerciceChoisi,donneeImagesComposantDragAndDrop,materielUtilisable} = useContext(ContexteRealisationExerciceAssociation)
    //console.log(donneeImagesComposantDragAndDrop)
    //console.log(donneesExerciceChoisi)

    //a remplacer plus tard
    const [board, setBoard] = useState([])

    const [{isOver},drop] = useDrop(()=>({
        accept: "image",
        drop: (item)=> addImageToBoard(item),
    }))
    //a remplacer plus tard
    function addImageToBoard(item){
        console.log('youpi ?')
        console.log(item)
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
                                categorie={donneesExerciceChoisi.categorie}/>
                           
                        ))}
                    </div>
                    )
                })}
            </div>
            <div className="col-span-6 bg-blue-500" ref={drop}>
                
                    {board.map((picture,index)=>{
                        return <img src={`img/${donneesExerciceChoisi.categorie}/composants/${picture.img}`}/>
                    })}
               
            </div>
        </>
    )
} 

export default DragAndDrop;

