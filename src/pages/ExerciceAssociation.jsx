import {  useEffect, useState, useContext, useRef  } from "react";
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
import DivModal from "../components/DivModal";
import TabResultatExoAssociation from "../components/TabResultatExoAssociation";



//ce composant permet d'afficher la page d'un exercice d'association en fonction d'une categorie et d'un niveau passé en parametres
function ExerciceAssociation() {

    //******************************************************************************************************************
    //    DECLARATIONS DES USESTATE ET USEREF 
    //*******************************************************************************************************************/
    
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
    const [modelAssociation,setModelAssociation] = useState(null); //ce useState créer un objet contenant les règles d'association, permettant de créer un composant choisi. cela servira de comparaison avec le model que l'enfant créera durant l'exercice (constructionRegleAssociation).
    const [constructionModelAssociation, setConstructionModelAssociation] = useState(null); // ce useState servira pour que l'enfant puisse voir les regles d'association qu'il créera et pour si il fait erreur ou non
    const [materielUtilisable, setMaterielUtilisable] = useState(""); // contiendra le nom du matériel disponible après avoir reussi à construire un model d'association complet et correct
    
    const [ouvrirModalExplicationCommande, setOuvrirModalExplicationCommande] = useState(false); // contindra un booléen qui permettra de savoir si la modal permettant de faire apparaitre la "commande" à réaliser pour l'exercice
    const [ouvrirModalRegleAssociation, setOuvrirModalRegleAssociation] = useState(false); //contiendra un booléen qui permettra de savoir si la modal permettant de faire apparaitre les "règles d'association" de l'exercice
    
    const [listeComposantsCreeParLUtilisateur,setlisteComposantsCreeParLUtilisateur] = useState()//liste composant créer durant l'exercice par l'utilisateur

    const [infoResultatExercice, setInfoResultatExercice] = useState({
        "nbConsultationsCommande" : 0,
        "nbConsultationsRegleAssociation" : 0,
        "nbTentativeValidationExo":0,
        "tempsRealisationExercice": 0

    })//contiendra un objet permetttant d'enregistrer les resultats de l'exerice
    
    const [qteCompoExerciceEgalQteCompoUtilisateur, setQteCompoExerciceEgalQteCompoUtilisateur ] = useState(false) //booléen pour savoir si la liste des composant créer par l'utilisateur est égal à la liste des composants de l'exercice à réaliser

    // Utilisation de useRef pour stocker la valeur actuelle du timer
    const secondsRef = useRef(0);

    // État pour contrôler le démarrage/arrêt du timer
    const [isRunning, setIsRunning] = useState(true);

    //******************************************************************************************************************
    //   DECLARATIONS DES USEEFFECT 
    //*******************************************************************************************************************/

    //chargement des données de l'exercices
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

        //reinitialisation des states ...
        return() =>{
            isCancelled = true
            document.title = ""
            handleNomAudio("")
            setDonneesExerciceChoisi("")
            setPhase("")
            setDonneeImagesComposantDragAndDrop(null)
            setEtapeExercice("")
            setModelAssociation(null) 
            setConstructionModelAssociation(null)
            setMaterielUtilisable("")
            setOuvrirModalExplicationCommande(false)
            setOuvrirModalRegleAssociation(false)
            setlisteComposantsCreeParLUtilisateur(null)
            setInfoResultatExercice({
                "nbConsultationsCommande" : 0,
                "nbConsultationsRegleAssociation" : 0,
                "nbTentativeValidationExo":0,
                "tempsRealisationExercice": 0
            })
            setQteCompoExerciceEgalQteCompoUtilisateur(false)
            setIsRunning(true)
            secondsRef.current = 0;

        }
    },[categorie,niveau])

    //permet de manipuler le son en fonction des phases de l'exercice et de l'exercice si l'utilisateur à reussi finir l'exercice le timer s'arrete
    useEffect(() => {
        if(phase == "explicationCommande" && donneesExerciceChoisi != "" ){
            handleNomAudio(donneesExerciceChoisi?.sndCommandeExerciceAssociation)
        }
        if(phase == "explicationRegle" && donneesExerciceChoisi != "" ){
            handleNomAudio(donneesExerciceChoisi?.sndRegleAssociation)
        }
        if(phase == "realisationExercice" && donneesExerciceChoisi != "" ){
            handleNomAudio(donneesExerciceChoisi?.sndExplicationExercice)
        }
        if(phase == "explicationRegle" && donneesExerciceChoisi != "" ){
            handleNomAudio(donneesExerciceChoisi.sndRegleAssociation)
        }
        if(phase == "validationExercice" && (donneesExerciceChoisi != "") ){
            if(qteCompoExerciceEgalQteCompoUtilisateur){
                handleNomAudio(donneesExerciceChoisi.sndValidationExerciceAssociationOk)
            }
            else{
                handleNomAudio(donneesExerciceChoisi.sndValidationExerciceAssociationKo)
            }
            
        }
        if(donneesExerciceChoisi == "" ){
            handleNomAudio("EKO.mp3")
        }
    }, [phase,categorie,niveau]);

    //permet de gerer le timer de l'exercice
    // Utilisation de useEffect pour démarrer le timer lors du rendu initial
    useEffect(() => { //ATTENTION LORS DU FETCH A ATTENDRE LA REQUETE POUR DEMARRER LE TIMER
        let timerId;
        // Vérification si le timer doit continuer à s'exécuter
        if (isRunning) {
        timerId = setInterval(() => {
            secondsRef.current += 1;
            // Mise à jour de l'affichage du timer
            //console.log("Timer: ", secondsRef.current);
        }, 1000);
        }
        // Nettoyage du timer lors du démontage du composant ou lorsque le timer est arrêté
        return () => clearInterval(timerId);
    }, [isRunning,categorie,niveau]); // Le useEffect se déclenche lorsque isRunning change


    //******************************************************************************************************************
    //    FONCTIONS PERMETTANT DE GERER L'EXERCICE
    //*******************************************************************************************************************/

    // Fonction pour arrêter le timer
    // function stopTimer() {
    //     setIsRunning(false);
    //     secondsRef.current = 0
    // };

    //fonction permettant d'initialiser les données de l'exercice d'association choisi
    function handleInitialisationExerciceChoisi( ressourcemax, donneeInitaleExerciceChoisi){
        console.log("handle INitialisation")
        //setPhase("realisationExercice")
        setPhase("explicationCommande")
        setDonneesExerciceChoisi(donneeInitaleExerciceChoisi)

        setEtapeExercice(ressourcemax)
        //setMaterielUtilisable("du blé") //AAAAAAAAAAa mettre en commentaire
        setModelAssociation("")
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


    ///USELESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSs
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

    //fonction permettant de consulter la modal contenant la "commande" de l'exercice et de compter le nombre de fois ou l'utilisateur à consulter cette modal
    function handleNbConsultationCommandeExercice(){
        //console.log('apparition modal commande + 1 ')
        setInfoResultatExercice({...infoResultatExercice, "nbConsultationsCommande": infoResultatExercice.nbConsultationsCommande + 1})
        setOuvrirModalExplicationCommande(true)
    }

    //fonction permettant de consulter la modal contenant "les règles d'associtaions" de l'exercice et de compter le nombre de fois ou l'utilisateur à consulter cette modal
    function handleNbConsultationRegleAssociation(){
        //console.log('apparition modal regle association + 1 ')
        setInfoResultatExercice({...infoResultatExercice, "nbConsultationsRegleAssociation": infoResultatExercice.nbConsultationsRegleAssociation + 1})
        setOuvrirModalRegleAssociation(true)
    }
    //fonction  permettant de consulter le nombre de fois l'eleve à tenter de valider l'exercice
    function handleNbTentativeValidationExo(){
        //console.log('nombre essai validation exo + 1 ')
        setInfoResultatExercice({...infoResultatExercice, "nbTentativeValidationExo": infoResultatExercice.nbTentativeValidationExo + 1})
    }
    //fonction permettant de mettre a jour le temps que l'utilisateur à mis pour reussir l'exercice et ajoute 1 tentative de validation exo
    function handleTempsRealisationExerciceEtNbTentativeValidationExo(){
        //console.log('temps mis pour reussir exercice en seconde et ajout 1 tentative')
       
        setInfoResultatExercice({...infoResultatExercice, "tempsRealisationExercice": secondsRef.current, "nbTentativeValidationExo": infoResultatExercice.nbTentativeValidationExo + 1})
    }

    //fonction permettant de parametrer les useState nécessaire pour afficher la phase "validationExercice" correctement.
    function handleParametresPhaseValidationExercice(){
        const bonneQteDeComposants = comparerQteListeCompoExerciceEtListeCompoCreerParLUtilisateur()
        //console.log(bonneQteDeComposants)
        setQteCompoExerciceEgalQteCompoUtilisateur(bonneQteDeComposants)
        if(bonneQteDeComposants){
            handleTempsRealisationExerciceEtNbTentativeValidationExo()
        }
        else{
            handleNbTentativeValidationExo()
        }
        setPhase("validationExercice")
    } 

    //fonction permettant de reinitialiser les useState en rapport avec la construction de model d'association (faite par l'utilisateur)
    //cette fonction est seulement utilisé pour les exercice au dessus du niveau 1
    function handleReinitialisationConstructionModelAssociation(){
        setModelAssociation("")
        setConstructionModelAssociation(constructionModelAssocitiationVide)
        setEtapeExercice(donneesExerciceChoisi.ressourceMax)
        setMaterielUtilisable("")
    }


    //fonction  permettant de comparer la liste des composant de l'exercice et la liste des composants créer par l'utilisateur (renvoi vrai ou faux)
    //compte les quantité de chaque composant des 2 liste, si les quantité ne correspondent pas on ajouter 1 au compteur "resultatComparaison"
    //tant que les quatites sont identiques le compteur reste à zero
    //la fonction renvoie vrai quand le compteur est à zero (car les quantité de chaque elements 2 listes sont identiques)
    function comparerQteListeCompoExerciceEtListeCompoCreerParLUtilisateur(){
        let resultatComparaison = 0 ;
        if(donneesExerciceChoisi.composants && listeComposantsCreeParLUtilisateur){
            //console.log(listeComposantsCreeParLUtilisateur)
            //console.log(donneesExerciceChoisi.composants )
            {donneesExerciceChoisi.composants.map((composant)=>{
                const composantChoisi = listeComposantsCreeParLUtilisateur.find(compo => compo.nom === composant.nom);
                //console.log(composantChoisi.listeImg.length)
                //console.log(composant.qteOk)
                if(composantChoisi.listeImg.length != composant.qteOk){
                    resultatComparaison++
                }
            })}
        }
        //console.log(resultatComparaison)
        return (resultatComparaison == 0 ) ? true : false
      
    }

    //******************************************************************************************************************
    //    AFFICHAGE PAGE EN FONCTION DE LA PHASE DE L'EXERCICE
    //*******************************************************************************************************************/

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
    if(phase == 'realisationExercice' ){
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
                    setlisteComposantsCreeParLUtilisateur,
                    constructionModelAssociation,
                    setConstructionModelAssociation,
                    modelAssociation,
                    setModelAssociation
                    }}
            >
                <main className="min-h-screen py-32 sm:py-32 lg:py-42 " >
                    <div className="text-green-500 py-3 px-3">{donneesExerciceChoisi.txtExplicationExercice}</div>

                    <div className="mx-auto max-w-6xl ">
                        <div className="grid grid-cols-12 gap-2 ">
                            <div className="col-span-3 p-1 ">
                                <DivListeSymboleMonnaieMateriaux />
                            </div>
                            <div className="grid grid-cols-10 col-span-9 p-1 gap-1">
                            <DragAndDrop />
                            </div>
                        </div>
                    </div>
                    
                    <div className="mx-auto max-w-6xl mt-5">
                        <div className="flex align-end justify-end justify-items-end ">
                            {(niveau != "niveau 1") && 
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={()=>handleReinitialisationConstructionModelAssociation()}>
                                    REVOIR LES PIECES
                                </button>
                            }
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={()=>handleNbConsultationCommandeExercice()}>
                                REVOIR LA COMMANDE 
                            </button>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={()=>handleNbConsultationRegleAssociation()}>
                                REVOIR LA REGLE 
                            </button>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={()=>handleParametresPhaseValidationExercice()}>
                                VALIDER {`>`} 
                            </button>
                        </div>
                    </div>

                    <DivModal 
                        ouvrirModal={ouvrirModalExplicationCommande} 
                        setOuvrirModal={setOuvrirModalExplicationCommande}
                        titre={"Information commande"}
                    >
                       <Commande 
                            composants={donneesExerciceChoisi.composants} 
                            categorie={donneesExerciceChoisi.categorie}
                        />
                    </DivModal>

                    <DivModal 
                        ouvrirModal={ouvrirModalRegleAssociation} 
                        setOuvrirModal={setOuvrirModalRegleAssociation}
                        titre={"Règle d'association"}
                    >
                        <RegleAssociation  
                            detailComposantExercice={
                                {  
                                    "categorieExercice":donneesExerciceChoisi.categorie,
                                    "composants":donneesExerciceChoisi.composants , 
                                    "etapeRessources" : donneesExerciceChoisi.etapeRessource
                                }
                            }
                        />
                    </DivModal>

                </main>
            </ContexteRealisationExerciceAssociation.Provider>
        )
    }

    //cree un div pour afficher l'interface permettant à l'éleve de voir si il a réaliser l'exercice correctement ou pas
    if(phase == 'validationExercice'){
        return (
            <main className="min-h-screen py-32 sm:py-32 lg:py-42 " >
                <div className="mx-auto max-w-6xl text-center text-2xl py-9">
                 Résultats
                </div>

                <div className="max-w-3xl mx-auto ">
                    <TabResultatExoAssociation 
                        categorie={donneesExerciceChoisi.categorie}
                        listeComposantsCreeParLUtilisateur={listeComposantsCreeParLUtilisateur}
                        listeComposantExo={donneesExerciceChoisi.composants}
                    />
                </div>
                {qteCompoExerciceEgalQteCompoUtilisateur ?
                (<>
                    <div className="pt-5 text-center text-green-500 sm:text-xl md:text-2xl">{donneesExerciceChoisi.txtValidationExerciceAssociationOk}</div>
                    <div className="mt-5  text-center color-green-500 bg-green-200  sm:text-xl "> 
                        {infoResultatExercice.nbTentativeValidationExo} essai{`(`}s{`)`} en {infoResultatExercice.tempsRealisationExercice} s - {infoResultatExercice.nbConsultationsRegleAssociation} règle{`(`}s{`)`} - {infoResultatExercice.nbConsultationsCommande} commande{`(`}s{`)`} .
                    </div>
                </>
                )
                :(  
                    <>
                    <div className="pt-5 text-center text-red-500 sm:text-xl md:text-2xl">{donneesExerciceChoisi.txtValidationExerciceAssociationKo}</div>
                    <div className="mx-auto max-w-6xl mt-5">
                        <div className="flex align-end justify-end justify-items-end ">
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={()=>setPhase("realisationExercice")}>
                                {`<`}  RETOUR EXERCICE 
                            </button>
                        </div>
                    </div>
                    </>
                )}
               
            </main>

        )
    }
}

export default ExerciceAssociation;


