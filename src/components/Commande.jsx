//affiche un liste d'images correspondant à la quantité d'1 seul ingrédient, ces images ne s'affiche que lorsque l'ecran est de detail sm ou plus
function AffichageImagesComposantTailleSMetPlus(props){
    const items = [];
    for (let i = 0; i < props.composant.qteOk ; i++) {
      items.push(props.composant.img);
    }
    return (
      <>
        {items.map((item,index) => {
            return (
                <div key={item+"-"+index} className="hidden sm:block">
                    <img src={"/img/"+props.categorie+"/composants/"+item} alt={"yahou"}/>
                </div>
            ) 
        })}
      </>
    );

}

//affiche la liste des ingredients/ composant de la commande. (ex:5beurre, 2paquet deblé etc... )
function Commande(props){
  //console.log(props.composants)
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 ">
            {props.composants.map((composant,index) => {
                return (
                    <div key={composant.nom}>
                        <div className="text-2xl p-2">{`${composant.qteOk} ${composant.nomAuPluriel}`}</div>
                        <div className="grid grid-cols-1 items-center justify-center rounded-md  p-2 sm:grid-cols-5">
                            <AffichageImagesComposantTailleSMetPlus composant={composant} categorie={props.categorie}/>
                            <div className="grid grid-cols-3 gap-2  p-2 sm:hidden">
                                <div className=" p-1 sm:hidden">
                                    <img src={"/img/"+props.categorie+"/composants/"+composant.img} alt={"yahou"}/>
                                </div>
                                <div className=" p-2 col-span-2 sm:block text-lg py-8">{`X ${composant.qteOk}`}</div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Commande;
