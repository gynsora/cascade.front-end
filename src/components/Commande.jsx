//affiche un liste d'images correspondant à la quantité d'1 seul ingrédient, ces images ne s'affiche que lorsque l'ecran est de detail sm ou plus
function AffichageImagesComposantTailleSMetPlus({composant,categorie}){
    const items = [];
    for (let i = 0; i <composant.qteOk ; i++) {
      items.push(composant.img);
    }
    return (
      <>
        {items.map((item,index) => {
            return (
                <div key={item+"-"+index} className="hidden sm:block">
                    <img src={"/img/"+categorie+"/composants/"+item} alt={"yahou"}/>
                </div>
            ) 
        })}
      </>
    );

}

//affiche la liste des ingredients/ composant de la commande. (ex:5beurre, 2paquet deblé etc... )
function Commande({composants,categorie}){
  //console.log(props.composants)
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 ">
            {composants.map((composant,index) => {
                return (
                    <div key={composant.nom}>
                        <div className="hidden sm:block text-xl p-2">{`${composant.qteOk} ${composant.nomAuPluriel}`}</div>
                        <div className="grid grid-cols-1 items-center justify-center rounded-md  p-1 sm:grid-cols-5 sm:p-2" >
                            <AffichageImagesComposantTailleSMetPlus composant={composant} categorie={categorie}/>
                            <div className="grid grid-cols-3 gap-1   sm:p-2 sm:hidden">
                                <div className="col-span-2 p-1 sm:hidden">
                                    <img src={"/img/"+categorie+"/composants/"+composant.img} alt={"yahou"}/>
                                </div>
                                <div className=" p-2 text-base sm:block sm:text-lg py-8">{`X ${composant.qteOk}`}</div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Commande;
