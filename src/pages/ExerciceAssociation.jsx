import {  useEffect, useState, useContext } from "react";
import { Navigate, useParams } from "react-router-dom";

//DONNEES LIER A LAFFICHAGE DES EXERCICES A CHANGER PAR UN FETCH DATA
import { DonneeExercices } from "../utils/Data";

import { ContexteAudio } from "../utils/contexte/ContexteAudio";
import { ContexteRealisationExerciceAssociation } from "../utils/contexte/ContexteRealisationExerciceAssociation";

import DragAndDrop from "../components/DragAndDrop";
import melangerTableau from "../utils/fonctionGenerale/melangerTableau";

//ce composant permet d'afficher la page d'un exercice d'association en fonction d'une categorie et d'un niveau passé en parametres
function ExerciceAssociation() {
    //contient les données des exercices //A RETIRER APRES INTEGRATIONS BDD
    const donnesDeToutLesExercices = DonneeExercices ;

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
    const [materielUtilisable, setMaterielUtilisable] = useState(); // contiendra le nom du matériel disponible après avoir reussi à construire un model d'association complet et correct
    
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
        }
    },[categorie,niveau])

    //permet de manipuler le son en fonction des phases de l'exercice
    useEffect(() => {
        if(phase == "explicationCommande" && donneesExerciceChoisi){
            handleNomAudio(donneesExerciceChoisi?.sndCommandeExerciceAssociation)
        }
        if(phase == "explicationRegle" && donneesExerciceChoisi){
            handleNomAudio(donneesExerciceChoisi?.sndRegleAssociation)
        }
        if(phase == "realisationExercice" && donneesExerciceChoisi){
            handleNomAudio(donneesExerciceChoisi?.sndExplicationExercice)
        }
        // if(phase == "explicationRegle" && donneesExerciceChoisi){
        //     handleNomAudio(donneesExerciceChoisi.sndRegleAssociation)
        // }
       
    }, [phase,categorie,niveau]);

    //fonction permettant d'initialiser les données de l'exercice d'association choisi
    function handleInitialisationExerciceChoisi( ressourcemax, donneeInitaleExerciceChoisi){
        console.log("handle INitialisation")
        setPhase("realisationExercice")
        setDonneesExerciceChoisi(donneeInitaleExerciceChoisi)

        //setEtapeExercice(ressourcemax)
        setMaterielUtilisable("un pommier") //AAAAAAAAAAa mettre en commentaire
        //setModelAssocitation("")
        //setConstructionModelAssociation(constructionModelAssocitiationVide)
        
        //initialisation des données d'images (liste d'images pour chaque composant) nécessaire pour le drag and drop (pour le côté des images Draggable)
        const tableauImagesPourDragAndDrop = handleNouvellesListesRandomImagesRandom(donneeInitaleExerciceChoisi.composants)
        setDonneeImagesComposantDragAndDrop(tableauImagesPourDragAndDrop)
        //initialisationListeComposantsCreeParUtilisateur(donneeInitaleExerciceChoisi)
    }

    //cree un liste d'images composants dans un ordre aléatoire pour chaque composant (pour le Drag And Drop)
    function handleNouvellesListesRandomImagesRandom(listecomposants){
        
        //creation d'une liste d'objet contenant l'image ,le nom, et l'id de chaque composant (pour creer un liste d'image random)
        const listeImagesComposant = []
        listecomposants.map((compo)=> {
            const image = compo.img
            const id = compo.id
            const nom = compo.nom
            const nouvelObjetImage = {"img":image, "id":id, "nom":nom}
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


    //redirige l'utilisateur vers la page not found si les fetch dans useEffect ne renvoi rien ou genere une erreur
    if (error) {
        return <Navigate to="/erreur-404" replace={true} />;
    }

    if(phase =='realisationExercice' ){
        return (
            <ContexteRealisationExerciceAssociation.Provider value={{donneesExerciceChoisi,donneeImagesComposantDragAndDrop,materielUtilisable }}>
                <main className="min-h-screen py-32 sm:py-32 lg:py-42 " >
                <div className="text-green-500 py-3 px-3">{donneesExerciceChoisi.txtExplicationExercice}</div>
                    <div className="grid grid-cols-9 gap-2 min-h-80">
                        <div className="col-span-2 grid grid-cols-3 bg-red-400 p-1 ">
                            affichage 
                        </div>
                        <div className="grid grid-cols-7 col-span-7 bg-yellow-400 p-1">
                           <DragAndDrop />
                        </div>
                    </div>
                </main>
            </ContexteRealisationExerciceAssociation.Provider>
        )
    }
}

export default ExerciceAssociation;


