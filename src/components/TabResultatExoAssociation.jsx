// fonction permettant d'afficher le tableau pour que l'eleve puisse comparer sa liste de composants avec la liste des composant de l'exercice
function TabResultatExoAssociation({categorie,listeComposantsCreeParLUtilisateur,listeComposantExo}){
      
      
        //console.log(listeComposantsCreeParLUtilisateur)
        //console.log(listeComposantExo)
    //console.log(categorie)
        return (
            <table className="table-auto">
                <tbody>
                    {listeComposantExo.map((compo,index) => {
                        let boolqteCompoUtilisateurEgalQteCompoExercice = false
                        //console.log(compo)
                        const composantUtilisateur = listeComposantsCreeParLUtilisateur.find(composantUtilisateur => composantUtilisateur.nom === compo.nom);
                        //console.log(composantUtilisateur)
                        if(compo.qteOk == composantUtilisateur.listeImg.length){boolqteCompoUtilisateurEgalQteCompoExercice = true}
                        //console.log(boolqteCompoUtilisateurEgalQteCompoExercice)
                        return (
                            <tr key={compo.nom} scope="row" className="px-6 my-3">
                                <td  className=" px-1 py-2 w-16">
                                    <p className={(boolqteCompoUtilisateurEgalQteCompoExercice) ? 
                                                    "bg-green-500 w-full text-white text-center align-middle rounded-md px-1 py-2 md:w-24 "
                                                   :"bg-red-500 w-full text-white text-center align-middle rounded-md px-1 py-2 md:w-24 "
                                                }
                                    >
                                        {composantUtilisateur.listeImg.length} 
                                    </p> 
                                </td>
                                <td className="px-6 my-3" >{`>`}</td>
                                <td className=" px-1 py-2 w-16" >
                                    <p className="bg-green-500 w-full text-white text-center align-middle rounded-md px-1 py-2  md:w-24">
                                        {compo.qteOk}
                                    </p> 
                                </td>
                                <td className="px-6 my-3" >
                                    <img src={`img/${categorie}/composants/${compo.img}`} className="h-14" alt={`images de ${compo.nom}`}/>
                                </td>
                                <td className="text-xl align-middle w-16 hidden sm:inline " >
                                        {compo.nomAuPluriel}
                                </td>
                            </tr>
                        )
                    })}
                    
                </tbody>
            </table>
        )
}

export default TabResultatExoAssociation;