import {  useEffect, useState, useContext } from "react";
import { Navigate, useParams } from "react-router-dom";

//DONNEES LIER A LAFFICHAGE DES EXERCICES A CHANGER PAR UN FETCH DATA
import { DonneeExercices } from "../utils/Data";

import { ContexteAudio } from "../utils/contexte/ContexteAudio";
import { ContexteRealisationExerciceAssociation } from "../utils/contexte/ContexteRealisationExerciceAssociation";

import melangerTableau from "../utils/fonctionGenerale/melangerTableau";
import comparerTableau from "../utils/fonctionGenerale/comparerTableau";

import DivListeSymboleMonnaieMateriaux from "../components/DivListeSymboleMonnaieMateriaux";
import DragAndDrop from "../components/DragAndDrop";
import Commande from "../components/Commande";
import RegleAssociation from "../components/RegleAssociation";



//ce composant permet d'afficher la page d'un exercice d'association en fonction d'une categorie et d'un niveau passé en parametres
function ExerciceAssociation() {
    //contient les données des exercices //A RETIRER APRES INTEGRATIONS BDD
    const donnesDeToutLesExercices = DonneeExercices ;

    // valeur initiale de "constructionModelAssociation"
    //les clefs de cette objet correspondent au clé du tableau "etapeRessource", (on ne prend pas en compte les composants)
    const constructionModelAssocitiationVide = {
        "symboles":[],
        "monnaies":[],
        "materiaux":[],
        "composants":[]
    }

    //contexte pour le son
    let {handleNomAudio} = useContext(ContexteAudio)

    const [donneesExerciceChoisi, setDonneesExerciceChoisi] = useState(""); // contiendra les données basique de l'exo voir https://www.youtube.com/watch?v=00lxm_doFYw&t=863s
    const { categorie, niveau } = useParams(); //recupere les parametres en url, ici on recupere la categorie de l'exercice et le niveau de l'exercice
    const [error, setError] = useState(false); //permet de gerer les erreurs lors du fetch dans useEffect
    const [phase,setPhase] = useState(""); //permet de gerer les phases de l'exercice: explicationCommande, explicationRegle, realisationExercice, validationExercice
    
    const [donneeImagesComposantDragAndDrop,setDonneeImagesComposantDragAndDrop]= useState(); //permet de cree un liste d'image(pour chaque composant), cest images seront mis dans un ordre random 

    const [etapeExercice,setEtapeExercice] = useState(''); //permet de gerer le niveau de ressource de l'exercice: symbole, monnaie , materiaux, composants 
    const [modelAssocitation,setModelAssocitation] = useState(); //ce useState créer un objet contenant les règles d'association, permettant de créer un composant choisi. cela servira de comparaison avec le model que l'enfant créera durant l'exercice (constructionRegleAssociation).
    const [constructionModelAssociation, setConstructionModelAssociation] = useState(); // ce useState servira pour que l'enfant puisse voir les regles d'association qu'il créera et pour si il fait erreur ou non
    const [materielUtilisable, setMaterielUtilisable] = useState(""); // contiendra le nom du matériel disponible après avoir reussi à construire un model d'association complet et correct
    
    const [listeComposantsCreeParLUtilisateur,setlisteComposantsCreeParLUtilisateur] = useState()//liste composant créer durant l'exercice par l'utilisateur

    useEffect(() => {
        let isCancelled = false
        //a remplacer par le fetch data plus tard voir https://www.youtube.com/watch?v=QQYeipc_cik&list=LL&index=2&t=1142s
        function fetchExerciceAssociation(){
            if(!isCancelled){
                console.log("fetchingData")
                //initialisation du title de la page
                document.title = "★ Cascade - Exercice d'association ★"
                //fetch ici
                const categorieChoisi = donnesDeToutLesExercices.find(cat => cat.categorie === categorie);
                if (!categorieChoisi) {
                    setError(true);
                    return;
                }
                const detailExerciceChoisi = categorieChoisi.listeExercice.find(niv => niv.niveau === niveau && niv.type === "association") ;
                if (!detailExerciceChoisi) {
                    setError(true);
                    return;
                }
                //création de l'objet qui contiendra toutes données initiale de l'exercice choisi
                const donneeInitaleExerciceChoisi = {
                    categorie: categorieChoisi.categorie,
                    txtCommandeExerciceAssociation: categorieChoisi.txtCommandeExerciceAssociation,
                    sndCommandeExerciceAssociation: categorieChoisi.sndCommandeExerciceAssociation,
                    txtRegleAssociation: categorieChoisi.txtRegleAssociation,
                    sndRegleAssociation: categorieChoisi.sndRegleAssociation,
                    txtValidationExerciceAssociationOk: categorieChoisi.txtValidationExerciceAssociationOk,
                    sndValidationExerciceAssociationOk: categorieChoisi.sndValidationExerciceAssociationOk,
                    txtValidationExerciceAssociationKo: categorieChoisi.txtValidationExerciceAssociationKo,
                    sndValidationExerciceAssociationKo: categorieChoisi.sndValidationExerciceAssociationKo,
                    target: categorieChoisi.target,
                    imgCategorie: categorieChoisi.imgCategorie,
                    niveauExercice: detailExerciceChoisi.niveau,
                    typeExercice: detailExerciceChoisi.type,
                    txtExplicationExercice: detailExerciceChoisi.txtExplicationExercice,
                    sndExplicationExercice: detailExerciceChoisi.sndExplicationExercice,
                    ressourceMax: detailExerciceChoisi.ressourceMax,
                    etapeRessource: detailExerciceChoisi.etapeRessource,
                    composants: categorieChoisi.composants,
                    materiaux: categorieChoisi.materiaux,
                    monnaies: categorieChoisi.monnaies,
                    symboles: categorieChoisi.symboles
                } ;

                
                // initialisation des states qui seront utiliser lors de l'exercice
                handleInitialisationExerciceChoisi(detailExerciceChoisi.ressourceMax, donneeInitaleExerciceChoisi)
            }
        }
        fetchExerciceAssociation()

        return() =>{
            isCancelled = true
            document.title = ""
            setMaterielUtilisable("")
            setDonneesExerciceChoisi("")
            handleNomAudio("")
        }
    },[categorie,niveau])

    //permet de manipuler le son en fonction des phases de l'exercice
    useEffect(() => {
        if(phase == "explicationCommande" && donneesExerciceChoisi ){
            handleNomAudio(donneesExerciceChoisi?.sndCommandeExerciceAssociation)
        }
        if(phase == "explicationRegle" && donneesExerciceChoisi){
            handleNomAudio(donneesExerciceChoisi?.sndRegleAssociation)
        }
        if(phase == "realisationExercice" && donneesExerciceChoisi){
            handleNomAudio(donneesExerciceChoisi?.sndExplicationExercice)
        }
        if(phase == "explicationRegle" && donneesExerciceChoisi){
            handleNomAudio(donneesExerciceChoisi.sndRegleAssociation)
        }
    }, [phase,categorie,niveau]);

    //fonction permettant d'initialiser les données de l'exercice d'association choisi
    function handleInitialisationExerciceChoisi( ressourcemax, donneeInitaleExerciceChoisi){
        console.log("handle INitialisation")
        //setPhase("realisationExercice")
        setPhase("explicationCommande")
        setDonneesExerciceChoisi(donneeInitaleExerciceChoisi)

        setEtapeExercice(ressourcemax)
        //setMaterielUtilisable("du blé") //AAAAAAAAAAa mettre en commentaire
        //setModelAssocitation("")
        setConstructionModelAssociation(constructionModelAssocitiationVide)
        
        //initialisation des données d'images (liste d'images pour chaque composant) nécessaire pour le drag and drop (pour le côté des images Draggable)
        const tableauImagesPourDragAndDrop = handleInitialisationNouvellesListesRandomImagesRandom(donneeInitaleExerciceChoisi.composants)
        setDonneeImagesComposantDragAndDrop(tableauImagesPourDragAndDrop)

        //initialisation liste composant creer par l'utilisateur
        const tableauListeComposantdeLutilisateur = handleInitialisationlisteComposantsCreeParLUtilisateur(donneeInitaleExerciceChoisi.composants)
        setlisteComposantsCreeParLUtilisateur(tableauListeComposantdeLutilisateur)
    }

    //fonction permettant d'initialiser le useState donneeImagesComposantDragAndDrop
    //cree un liste d'images composants dans un ordre aléatoire pour chaque composant (pour le Drag And Drop) 
    function handleInitialisationNouvellesListesRandomImagesRandom(listecomposants){
        
        //creation d'une liste d'objet contenant l'image ,le nom, et l'id de chaque composant (pour creer un liste d'image random)
        const listeImagesComposant = []
        listecomposants.map((compo)=> {
            const image = compo.img
            const id = compo.id
            const nom = compo.nom
            const coutmaterielDucomposant = compo.coutComposant.find((res)=> res.ressource == "materiaux")
            const nomMaterielDuComposant = coutmaterielDucomposant.texte
            const nouvelObjetImage = {"img":image, "id":id, "nom":nom ,"materiel":nomMaterielDuComposant}
            listeImagesComposant.push(nouvelObjetImage)
        })
        //console.log(listeImagesComposant)

        //creation pour chaque composant de données
        const nouvelleslistesRandomImagesComposant = []
        listecomposants.map((compo)=> {
            //console.log(compo)
            const idComposant = compo.id
            //console.log(idComposant)
            const nomComposant = compo.nom
            //console.log(nomComposant)

            const coutmaterielDucomposant = compo.coutComposant.find((res)=> res.ressource == "materiaux")
            const nomMaterielDuComposant = coutmaterielDucomposant.texte
            //console.log(nomMaterielDuComposant)

            const listeRandomImagesComposants = melangerTableau(listeImagesComposant)
            //console.log(listeRandomImagesComposants)

            const nouvelObjetComposant = {
                "id":idComposant,
                "nom":nomComposant,
                "materiel":nomMaterielDuComposant,
                "listeImg":listeRandomImagesComposants
            }
            //console.log(nouvelObjetComposant)
            nouvelleslistesRandomImagesComposant.push(nouvelObjetComposant)
        })
        //console.log(nouvelleslistesRandomImagesComposant)
        return nouvelleslistesRandomImagesComposant
    }
  
    // fonction permettant d'initialiser listeComposantsCreeParLUtilisateur
    function handleInitialisationlisteComposantsCreeParLUtilisateur(listecomposants){
        let nouvelleListeComposantCreerParLUtilisateur = []
        listecomposants.map((compo)=> {
            let nomComposant = compo.nom
            let listeImg= []
            let nouvelObjetComposant = {"nom":nomComposant,"listeImg":listeImg}
            nouvelleListeComposantCreerParLUtilisateur.push(nouvelObjetComposant)
        })
        //console.log(nouvelleListeComposantCreerParLUtilisateur)
        return nouvelleListeComposantCreerParLUtilisateur
    }

    

    //fonction permettant d'ajouter des elements en fonction d'une regle d'association (cet element peut reprensenter un symbole, une monnaie , un materiaux)
    // pour les exercices de niveau 1 on n'affiche pas la liste d'association
    function handleConstructionModelAssociation(element){//AAAAAAA FAIRE
        //permet de gerer les exercices d'association de niveau 1
        if(element.utilisable && donneesExerciceChoisi.ressourceMax == "materiaux"){
            console.log(materielUtilisable)
            setMaterielUtilisable("waza")
            // //setMaterielUtilisable(element.)
            // console.log(donneesExerciceChoisi.composants)
            // //console.log(element.img)
            // let tabImgMateriel = [element.img]
            // console.log(rechercheComposantModelAssociation(tabImgMateriel))
            
            // setMaterielUtilisable("du blé")
          
            //const rechercheMaterielDuComposant = donneesExerciceChoisi?.composants.coutComposant.find((compo) => compo.ressource === "materiaux" )
            //console.log(rechercheMaterielDuComposant)
        }
    }

  

    //cette fonction renvera un objet "composant" en fonction de l'étape de l'exercice et du tableau d'image mit en paramètre
    function rechercheComposantModelAssociation(tableauDimg){
        let nouveauComposantModel = ""
        donneesExerciceChoisi.composants.map((composantModel,index) => {
            const coutNouveauModel = composantModel.coutComposant.find((cout) => cout.ressource === etapeExercice )
            if (comparerTableau(tableauDimg, coutNouveauModel.listeImg) ){
                console.log('youpiz')
                nouveauComposantModel = composantModel 
            }
        })
        return nouveauComposantModel
    }


    //redirige l'utilisateur vers la page not found si les fetch dans useEffect ne renvoi rien ou genere une erreur
    if (error) {
        return <Navigate to="/erreur-404" replace={true} />;
    }

    //cree une div pour afficher la liste des composants que l'eleve doit reproduire pour realiser la commande de l'exercice choisi. 
    if (phase =='explicationCommande'){
        return (
            <main className="min-h-screen py-32 sm:py-32 lg:py-42 " >
                <div className="text-green-500 py-3 px-3">{donneesExerciceChoisi.txtCommandeExerciceAssociation}</div>
                <div className="mx-auto max-w-6xl ">
                    <Commande 
                        composants={donneesExerciceChoisi.composants} 
                        categorie={donneesExerciceChoisi.categorie}
                    />
                </div>
                <div className="mx-auto max-w-6xl ">
                    <div className="flex align-end justify-end justify-items-end">
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={()=>setPhase("explicationRegle")}>
                            VOIR LES RÈGLES D'ASSOCITATIONS {`>`} 
                        </button>
                    </div>
                </div>
            </main>
        )
    }

    //cree une div pour afficher les regles d'association pour obtenir chaque composants 
    if (phase =='explicationRegle'){
        return (
            <main className="min-h-screen py-32 sm:py-32 lg:py-42 " >
                <div className="text-green-500 py-3 px-3">{donneesExerciceChoisi.txtRegleAssociation}</div>
                <div className="mx-auto max-w-6xl ">
                <RegleAssociation  
                    detailComposantExercice={
                        {  
                            "categorieExercice":donneesExerciceChoisi.categorie,
                            "composants":donneesExerciceChoisi.composants , 
                            "etapeRessources" : donneesExerciceChoisi.etapeRessource
                        }
                    }
                />
                </div>
                <div className="mx-auto max-w-6xl ">
                    <div className="flex align-end justify-end justify-items-end">
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={()=>setPhase("realisationExercice")}>
                            COMMENCER L'EXERCICE {`>`} 
                        </button>
                    </div>
                </div>
                
            </main>
        )
    }

    //cree un div pour afficher l'interface permettant à l'éleve de réaliser sont exercice
    if(phase =='realisationExercice' ){
        return (
            <ContexteRealisationExerciceAssociation.Provider 
                value={{
                    niveau,
                    donneesExerciceChoisi,
                    etapeExercice,setEtapeExercice,
                    donneeImagesComposantDragAndDrop,
                    materielUtilisable,setMaterielUtilisable,
                    listeComposantsCreeParLUtilisateur,
                    handleConstructionModelAssociation,
                    setlisteComposantsCreeParLUtilisateur
                     }}
            >
                <main className="min-h-screen py-32 sm:py-32 lg:py-42 " >
                    <div className="text-green-500 py-3 px-3">{donneesExerciceChoisi.txtExplicationExercice}</div>
                    <div className="mx-auto max-w-6xl ">
                        <div className="grid grid-cols-9 gap-2 ">
                            <div className="col-span-3  bg-red-400 p-1 ">
                                <DivListeSymboleMonnaieMateriaux />
                            </div>
                            <div className="grid grid-cols-6 col-span-6 bg-yellow-400 p-1">
                            <DragAndDrop />
                            </div>
                        </div>
                    </div>
                    <div>PREPARATION MODAL</div>
                    <div className="mx-auto max-w-6xl ">
                        <RegleAssociation  
                            detailComposantExercice={
                                {  
                                    "categorieExercice":donneesExerciceChoisi.categorie,
                                    "composants":donneesExerciceChoisi.composants , 
                                    "etapeRessources" : donneesExerciceChoisi.etapeRessource
                                }
                            }
                        />
                    </div>
                    <div className="mx-auto max-w-6xl ">
                        <Commande 
                            composants={donneesExerciceChoisi.composants} 
                            categorie={donneesExerciceChoisi.categorie}
                        />
                    </div>

                </main>
            </ContexteRealisationExerciceAssociation.Provider>
        )
    }
}

export default ExerciceAssociation;


