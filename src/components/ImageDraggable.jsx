import { useDrag } from "react-dnd";


//fonction permettant de creer des images "draggable"
function ImageDraggable({id,img,nom, categorie,materiel,materielCompo}){
    const [{isDragging}, drag] = useDrag(()=>({
        type:"image",
        item:{img: img,materiel:materiel,nom:nom,materielCompo:materielCompo},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    return(  
        <>
        {(materiel == materielCompo ) ? (
            <div>
                <img  
                    ref={drag} 
                    className={(isDragging) ? "p-1 cursor-pointer bg-green-500":"p-1 cursor-pointer hover:bg-yellow-200 "} 
                    src={process.env.PUBLIC_URL+`/img/${categorie}/composants/${img}`}
                />
            </div>
           ) :(
            <div>
                <img  
                    className={"p-1 cursor-pointer hover:bg-yellow-200"} 
                    src={process.env.PUBLIC_URL+`/img/${categorie}/composants/${img}`}
                />
            </div>
           )
        }
        </>
    )
}

export default ImageDraggable;