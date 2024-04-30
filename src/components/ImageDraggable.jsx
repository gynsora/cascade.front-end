import { useDrag } from "react-dnd";


//fonction permettant de creer des images "draggable"
function ImageDraggable({id,img,nom, categorie}){
    const [{isDragging}, drag] = useDrag(()=>({
        type:"image",
        item:{img: img},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    return <img  
                ref={drag} 
                className={(isDragging) ? "p-2 cursor-pointer bg-gray-500":"p-2 cursor-pointer"} 
                src={`img/${categorie}/composants/${img}`}
            />
}

export default ImageDraggable;