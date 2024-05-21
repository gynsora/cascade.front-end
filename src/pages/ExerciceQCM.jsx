import {  useEffect, useState, useContext, useRef  } from "react";
import { Navigate, useParams } from "react-router-dom";

//DONNEES LIER A LAFFICHAGE DES EXERCICES A CHANGER PAR UN FETCH DATA
import { DonneeExercices } from "../utils/Data";

import { ContexteAudio } from "../utils/contexte/ContexteAudio";
import { ContexteRealisationQuestionnaireQCM } from "../utils/contexte/ContexteRealisationQuestionnaireQCM";


import AffichageChoixQuestionQCM from "../components/AffichageChoixQuestionQCM";

//fonction permettant d'afficher les reponse des QCM effectuer par l'utilisateur
function AffichageReponseQCM({listeReponse,categorie}){
    //console.log(listeReponse)
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {listeReponse.map((reponse,index) =>{
                return (
                    <div key={index} className="grid grid-cols-7 mt-5">
                        <div className="col-span-7 bg-white p-1 sm:col-span-5">
                            <div className="">{reponse.question}</div>
                            <div className= {(reponse.reponse.reponseValide) ? "bg-green-200" : "bg-red-200"}>
                                {reponse.nbEssaiQuestion} essai(s) en {reponse.tempsRealisationQuestion} sec - {reponse.nbConsultationsRegleAssociation} règle(s) - {reponse.nbConsultationsCommande} commande(s)
                            </div>
                        </div>
                        <div className="hidden sm:block sm:col-span-2">
                            {(reponse.typeReponse == "images") && 
                                <div >
                                    <img src={`img/${categorie}/${reponse.reponse.ressource}/${reponse.reponse.img}`} 
                                    alt={`image ${reponse.reponse.texte}`} 
                                    className={(reponse.reponse.reponseValide) ? "border-2 border-green-500 ml-2 w-24 h-24 lg:ml-0" : "border-2 border-red-500 ml-2 w-24 h-24  lg:ml-0"} />
                                </div>
                            }
                             {(reponse.typeReponse == "chiffres") && 
                                <div className={(reponse.reponse.reponseValide) ? "border-2 border-green-500 bg-green-200 ml-2 w-24 h-24 text-2xl flex justify-center items-center lg:ml-0" : "border-2 border-red-500 bg-red-200 ml-2 w-24 h-24  text-2xl flex justify-center items-center lg:ml-0"}>
                                  {reponse.reponse.texte}
                                </div>
                            }
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

//ce composant permet d'afficher la page d'un exercice de type QCM
function ExerciceQCM() {
    //******************************************************************************************************************
    //    DECLARATIONS DES USESTATE ET USEREF 
    //*******************************************************************************************************************/

    //contient les données des exercices //A RETIRER APRES INTEGRATIONS BDD
    const donnesDeToutLesExercices = DonneeExercices ;

    let {handleNomAudio} = useContext(ContexteAudio)

    const [donneesExerciceChoisi, setDonneesExerciceChoisi] = useState(""); // contiendra les données basique de l'exo voir https://www.youtube.com/watch?v=00lxm_doFYw&t=863s
    const { categorie, niveau } = useParams(); //recupere les parametres en url, ici on recupere la categorie de l'exercice et le niveau de l'exercice
    
    const [error, setError] = useState(false); //permet de gerer les erreurs lors du fetch dans useEffect
    const [phase,setPhase] = useState(""); //permet de gerer les phases de l'exercice QCM: explicationQCM, realisationQCM, resultatQCM
    
   
    // Utilisation de useRef pour stocker la valeur actuelle du timer
    const secondsRef = useRef(0);

    // État pour contrôler le démarrage/arrêt du timer
    const [isRunning, setIsRunning] = useState(false);

    //permet d'afficher l'index d'une question
    const [indexQuestion, setIndexQuestion] = useState(null);

    const [listeReponse,setListeReponse] = useState([])


    //******************************************************************************************************************
    //   DECLARATIONS DES USEEFFECT 
    //*******************************************************************************************************************/
    //chargement des données de l'exercices
    useEffect(() => {
        let isCancelled = false
        //a remplacer par le fetch data plus tard voir https://www.youtube.com/watch?v=QQYeipc_cik&list=LL&index=2&t=1142s
        function fetchExerciceAssociation(){
            if(!isCancelled){
                //console.log("fetchingData")
                //initialisation du title de la page
                document.title = "★ Cascade - Exercice QCM★"
                //fetch ici
                const categorieChoisi = donnesDeToutLesExercices.find(cat => cat.categorie === categorie);
                if (!categorieChoisi) {
                    setError(true);
                    return;
                }
                const detailExerciceChoisi = categorieChoisi.listeExercice.find(niv => niv.niveau === niveau && niv.type === "QCM") ;
                if (!detailExerciceChoisi) {
                    setError(true);
                    return;
                }
                //création de l'objet qui contiendra toutes données initiale de l'exercice choisi
                const donneeInitaleExerciceChoisi = {
                    
                    titreIntroductionExerciceQuizz: categorieChoisi.titreIntroductionExerciceQuizz,
                    txtIntroductionExerciceQuizz: categorieChoisi.txtIntroductionExerciceQuizz,
                    sndIntroductionExerciceQuizz: categorieChoisi.sndIntroductionExerciceQuizz,
                    txtValidationExerciceQuizz: categorieChoisi.txtValidationExerciceQuizz,
                    sndValidationExerciceQuizz:categorieChoisi.sndValidationExerciceQuizz,
                    quizzQCM: categorieChoisi.quizzQCM,

                    categorie: categorieChoisi.categorie,
                    target: categorieChoisi.target,
                    imgCategorie: categorieChoisi.imgCategorie,

                    niveauExercice: detailExerciceChoisi.niveau,
                    typeExercice: detailExerciceChoisi.type,
                    ressourceMax: detailExerciceChoisi.ressourceMax,
                    etapeRessource: detailExerciceChoisi.etapeRessource,
                    composants: categorieChoisi.composants,
                    materiaux: categorieChoisi.materiaux,
                    monnaies: categorieChoisi.monnaies,
                    symboles: categorieChoisi.symboles
                } ;

                
                // initialisation des states qui seront utiliser lors de l'exercice
                handleInitialisationExerciceChoisi(donneeInitaleExerciceChoisi)
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
            
         
          
            // setInfoResultatExercice({
            //     "nbConsultationsCommande" : 0,
            //     "nbConsultationsRegleAssociation" : 0,
            //     "nbTentativeValidationExo":0,
            //     "tempsRealisationExercice": 0
            // })
            setIsRunning(false)
            secondsRef.current = 0;

            setIndexQuestion(null)
            setListeReponse([])

        }
    },[categorie,niveau])

    //permet de manipuler le son en fonction des phases de l'exercice et de l'exercice si l'utilisateur à reussi finir l'exercice le timer s'arrete
    useEffect(() => {
        if(phase == "explicationQCM" && donneesExerciceChoisi != "" ){
            handleNomAudio(donneesExerciceChoisi.sndIntroductionExerciceQuizz)
        }
        if(phase == "realisationQCM" && donneesExerciceChoisi != "" ){
            handleNomAudio(donneesExerciceChoisi.quizzQCM[indexQuestion].sonQuestion)
        }
        
        if(donneesExerciceChoisi == "" ){
            handleNomAudio("EKO.mp3")
        }

        //console.log(phase)
    }, [phase,indexQuestion]);

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
    }, [isRunning]); // Le useEffect se déclenche lorsque isRunning change


    //******************************************************************************************************************
    //    FONCTIONS PERMETTANT DE GERER L'EXERCICE
    //*******************************************************************************************************************/
    
    //fonction permettant d'initialiser les données de l'exercice d'association choisi
    function handleInitialisationExerciceChoisi( donneeInitaleExerciceChoisi){
        //console.log("handle INitialisation QCM")
        //setPhase("realisationExercice")
        setPhase("explicationQCM")
        setDonneesExerciceChoisi(donneeInitaleExerciceChoisi)
        //handleNomAudio(donneesExerciceChoisi.sndIntroductionExerciceQuizz)

    }

    //fonction permettant de parametres les states lorsque l'utilisateur commence le questionnaire
    function handleInitialisationPhaseRealisationQuestionnaire(){
        setIndexQuestion(0)
        setPhase("realisationQCM")
        setIsRunning(true)
    }

   

    //fonction permettant de gérer les responses choisi par l'utilisateur
    // function handleReponseQCM(reponse){
    //     console.log(reponse)
    // }


    //******************************************************************************************************************
    //    AFFICHAGE PAGE EN FONCTION DE LA PHASE DE L'EXERCICE
    //*******************************************************************************************************************/

    //redirige l'utilisateur vers la page not found si les fetch dans useEffect ne renvoi rien ou genere une erreur
     if (error) {
        return <Navigate to="/erreur-404" replace={true} />;
    }


    if (phase == 'explicationQCM' && donneesExerciceChoisi != ""){
        
        //console.log(donneesExerciceChoisi.quizzQCM)
        return (
            <main className="min-h-screen py-32 sm:py-32 lg:py-42 " >
            {/* <div className="text-green-500 py-3 px-3">{donneesExerciceChoisi.txtCommandeExerciceAssociation}</div> */}
                <div className="mx-auto max-w-6xl ">
                        <div className="text-center text-2xl text-green-500 mb-2 md:text-3xl">{donneesExerciceChoisi.titreIntroductionExerciceQuizz}</div>
                        <hr />
                        <div className="px-2 pt-3 md:text-xl">
                            {donneesExerciceChoisi.txtIntroductionExerciceQuizz.map((phrase,index)=>{
                                return (<div key={index} className="">{phrase}</div>)
                            })}
                        </div>
                </div>
                <div className="mx-auto max-w-6xl ">
                    <div className="flex pt-5 justify-center justify-items-center">
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={()=>handleInitialisationPhaseRealisationQuestionnaire()}>
                            COMMENCER LE QUIZZ{`>`} 
                        </button>
                    </div>
                </div>
               
            </main>
        )
    }

    if (phase == 'realisationQCM' && donneesExerciceChoisi != ""){
        //console.log(indexQuestion)
        return (
            <ContexteRealisationQuestionnaireQCM.Provider 
                value={{ 
                    donneesExerciceChoisi,
                    indexQuestion,
                    setIndexQuestion,
                    categorie,
                    secondsRef,
                    listeReponse,
                    setListeReponse,
                    setPhase,
                    setIsRunning
                }}
            >
            <main className="min-h-screen py-32 sm:py-32 lg:py-42 " >
                <div className="mx-auto max-w-6xl ">
                    <div className="text-center text-2xl text-green-500 mb-2 md:text-3xl">Question {indexQuestion+1} / {donneesExerciceChoisi.quizzQCM.length} </div>
                    <hr />
                    <div>Question {indexQuestion+1}</div>
                    <div>{donneesExerciceChoisi.quizzQCM[indexQuestion].texteQuestion}</div>
                </div>
                <AffichageChoixQuestionQCM />
                
            </main>
            </ContexteRealisationQuestionnaireQCM.Provider>
        )
    }

    if (phase == 'resultatQCM' && donneesExerciceChoisi != ""){
        //console.log(listeReponse)
        return (
            <main className="min-h-screen py-32 sm:py-32 lg:py-42 " >
            {/* <div className="text-green-500 py-3 px-3">{donneesExerciceChoisi.txtCommandeExerciceAssociation}</div> */}
                <div className="mx-auto max-w-6xl ">
                    <div className="text-center text-2xl text-green-500 mb-2 md:text-3xl">Résultats</div>
                    <hr />
                </div>
                <div className="mx-auto max-w-6xl ">
                    <AffichageReponseQCM listeReponse={listeReponse}  categorie={categorie}/>
                </div>
                
            </main>
        )
    }
}


export default ExerciceQCM;

