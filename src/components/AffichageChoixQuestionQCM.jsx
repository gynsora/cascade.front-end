import { useContext, useState, useEffect } from "react";
import { ContexteRealisationQuestionnaireQCM } from "../utils/contexte/ContexteRealisationQuestionnaireQCM";

import DivModal from "../components/DivModal";
import Commande from "../components/Commande";
import RegleAssociation from "../components/RegleAssociation";


//fonction permettant d'afficher les choix de réponse en fonction d'une question posé
function AffichageChoixQuestionQCM(){
    const {donneesExerciceChoisi,indexQuestion,setIndexQuestion,categorie,secondsRef,listeReponse, setListeReponse,setPhase,setIsRunning} = useContext(ContexteRealisationQuestionnaireQCM)
    
    const [messageChoixReponse, setMessageChoixReponse] = useState("")

    const [ouvrirModalExplicationCommande, setOuvrirModalExplicationCommande] = useState(false); // contindra un booléen qui permettra de savoir si la modal permettant de faire apparaitre la "commande" à réaliser pour l'exercice
    const [ouvrirModalRegleAssociation, setOuvrirModalRegleAssociation] = useState(false); //contiendra un booléen qui permettra de savoir si la modal permettant de faire apparaitre les "règles d'association" de l'exercice
    
    //usestate permettant de stocker les renseignement d'une réponse donnée, cette reponse peut etre fausse ou vrai
    const [infoResultatQuestion, setInfoResultatQuestion] = useState({
        "nbConsultationsCommande" : 0,
        "nbConsultationsRegleAssociation" : 0,
        "nbEssaiQuestion":0,
        "tempsRealisationQuestion": 0,
        "reponse":"",
        "typeReponse": "",
        "question": "",
    });
    const [affichageBtnSuivant, setAffichageBtnSuivant ] = useState(false) //useState permettant d'aller à la question suivant ou de finir le question, lorsque ce state est a true cela signifie que l'utilisateur ne peut plus donnée de réponse

   


    //******************************************************************************************************************
    //   DECLARATIONS DES USEEFFECT 
    //*******************************************************************************************************************/
    //chargement des données de l'exercices
    useEffect(() => {
        setOuvrirModalExplicationCommande(false)
        setOuvrirModalRegleAssociation(false)
        setMessageChoixReponse("")
        setAffichageBtnSuivant(false) /// false
        secondsRef.current = 0;
        //console.log(indexQuestion)
        //console.log(donneesExerciceChoisi.quizzQCM.length)

        //reinitialisation des states ...
        return() =>{
            setOuvrirModalExplicationCommande(false)
            setOuvrirModalRegleAssociation(false)
            setInfoResultatQuestion({
                "nbConsultationsCommande" : 0,
                "nbConsultationsRegleAssociation" : 0,
                "nbEssaiQuestion":0,
                "tempsRealisationQuestion": 0,
                "reponse":"",   
                "typeReponse": "",
                "question": "",
            })
            setAffichageBtnSuivant(false)
            setMessageChoixReponse("")
            secondsRef.current = 0;
        }   
    },[indexQuestion])


    
    //fonction permettant de consulter la modal contenant la "commande" de l'exercice et de compter le nombre de fois ou l'utilisateur à consulter cette modal
    function handleNbConsultationCommandeExercice(){
        //console.log('apparition modal commande + 1 ')
        //console.log(indexQuestion)
        setInfoResultatQuestion({...infoResultatQuestion, "nbConsultationsCommande": infoResultatQuestion.nbConsultationsCommande + 1})
        setOuvrirModalExplicationCommande(true)
    }

    //fonction permettant de consulter la modal contenant "les règles d'associtaions" de l'exercice et de compter le nombre de fois ou l'utilisateur à consulter cette modal
    function handleNbConsultationRegleAssociation(){
        //console.log('apparition modal regle association + 1 ')
        //setInfoResultatExercice({...infoResultatExercice, "nbConsultationsRegleAssociation": infoResultatExercice.nbConsultationsRegleAssociation + 1})
        setInfoResultatQuestion({...infoResultatQuestion, "nbConsultationsRegleAssociation": infoResultatQuestion.nbConsultationsRegleAssociation + 1})
        setOuvrirModalRegleAssociation(true)
    }

    //fonction permettant de modifier les information de la réponse lorsqu'elle est bonne
    function handleBonneReponse(reponse,typeReponse,question){
        //console.log("bonne réponse")
        setInfoResultatQuestion({...infoResultatQuestion,
            "nbEssaiQuestion":infoResultatQuestion.nbEssaiQuestion+1,
            "tempsRealisationQuestion": secondsRef.current+1,
            "reponse": reponse, "typeReponse": typeReponse,
            "question" : question})
        setMessageChoixReponse("Bravo!")
        setAffichageBtnSuivant(true)
    }
    //permet de gerer l'ajoute d'un tentative de réponse raté par l'utilisateur
    function handleMauvaiseReponseAvecTentativeRestante(){
        //console.log("mauvaise reponse tentaive restante")
        setInfoResultatQuestion({...infoResultatQuestion,"nbEssaiQuestion":infoResultatQuestion.nbEssaiQuestion+1 })
        setMessageChoixReponse("Recommence")
    }

    //fonction permettant de mettre un mauvaise réponse (plus de tentative possible)
    function handleMauvaiseReponseAucuneTentativeRestante(reponse,typeReponse,question){
        //console.log("mauvaise reponse aucune")
        setInfoResultatQuestion({...infoResultatQuestion,
            "nbEssaiQuestion":infoResultatQuestion.nbEssaiQuestion+1,
            "tempsRealisationQuestion": secondsRef.current+1, 
            "reponse": reponse, "typeReponse": typeReponse,
            "question" : question})
        setMessageChoixReponse("Raté!")
        setAffichageBtnSuivant(true)
    }

    //fonction permettant de savoir si l'utilisateur à choisis la bonne réponse et d'agir en conséquence
    function handleReponseDeLUtilisateur(reponse,typeReponse,question){
        //console.log(reponse)
        if(!affichageBtnSuivant){ // si le bouton suivant ou resultat ne s'affiche pas (l'utilisateur peut toujours tenter de répondre à la question)
            if(reponse.reponseValide){
                handleBonneReponse(reponse,typeReponse,question)
            }
            else{
                //console.log(infoResultatQuestion.nbEssaiQuestion)
                //console.log(donneesExerciceChoisi.quizzQCM[indexQuestion].nbTentativeTotal)
                const nbEssai = infoResultatQuestion.nbEssaiQuestion +1
                if(nbEssai < donneesExerciceChoisi.quizzQCM[indexQuestion].nbTentativeTotal){ //enregistre la mauvaise réponse car plus de tentative disponible
                    handleMauvaiseReponseAvecTentativeRestante()
                }
                else{// tentative disponible donc on affiche juste recommence! et on ajout une tentative au compteur
                    handleMauvaiseReponseAucuneTentativeRestante(reponse,typeReponse,question)
                }
            }
        }
    }

    //fonction permettant d'aller à la question suivante
    function handleQuestionSuivant(){
        //setPhase("realisationQCM")
        //setIndexQuestion(indexQuestion + 1 )
        //recuperer le resultat de la question et envoyer ce resultat dans exerciceQCM ici on ajoute la question au resultat total
        // console.log("resultat question actuelle")
        // console.log(infoResultatQuestion)
        // console.log(listeReponse)
        setListeReponse([...listeReponse,infoResultatQuestion] )
        setIndexQuestion(indexQuestion + 1 )
    }

    //fonction permettant de changer la phase de l'exercice et de terminer le questionnaire
    function handleResultatQuestion(){
        // //setPhase("resultatQCM")
        // console.log("resultat questionnaire (derniere question)")
        //recupérer le resultat de la question et envoyer la question dans exerciceQCM ici on ajoute la question au resultat et on change de phase
        // console.log(infoResultatQuestion)
        setListeReponse([...listeReponse,infoResultatQuestion])
        setIsRunning(false)
        setPhase("resultatQCM")
    }

    return (
        <>
            {(donneesExerciceChoisi.quizzQCM[indexQuestion].typeQuestion == "images") && 
                <div className={`mx-auto max-w-[500px] grid grid-cols-5 gap-2 p-2 md:gap-5 md:mb-[10px]` }>
                    {donneesExerciceChoisi.quizzQCM[indexQuestion].choixReponse.map((reponse)=>{
                        return (
                            <div key={reponse.img+"- index"} className="p-1 bg-gray-100 hover:bg-yellow-500 hover:cursor-pointer"
                                 onClick={()=>handleReponseDeLUtilisateur(reponse, "images",donneesExerciceChoisi.quizzQCM[indexQuestion].texteQuestion)}
                            >
                                <img src={`img/${categorie}/${reponse.ressource}/${reponse.img}`}
                                alt={`image de ${reponse.texte}`} />
                            </div>
                        )
                    })}
                </div>
            }
            {(donneesExerciceChoisi.quizzQCM[indexQuestion].typeQuestion == "chiffres") && 
                <div className={`mx-auto max-w-[500px] grid grid-cols-5 gap-2 p-2 md:gap-5 md:mb-[10px]` }>
                    {donneesExerciceChoisi.quizzQCM[indexQuestion].choixReponse.map((reponse)=>{
                        return (
                            <div key={reponse.chiffre+"- index"} className="p-1 bg-gray-100 text-center align-middle  h-[80px]  hover:bg-yellow-500 hover:cursor-pointer"
                                 onClick={()=>handleReponseDeLUtilisateur(reponse , "chiffres" ,donneesExerciceChoisi.quizzQCM[indexQuestion].texteQuestion)}>
                                <span className="inline-block align-middle h-full py-5 text-2xl"> {reponse.chiffre} </span>
                            </div>
                        )
                    })}
                </div>
            }


            <div className="h-12 md:mb-[30px]">
                { (messageChoixReponse == "Recommence" || messageChoixReponse == "Raté!" ) && 
                    <div className={`text-center text-red-500 text-2xl `}> {messageChoixReponse} </div>
                }   
                { (messageChoixReponse == "Bravo!") && 
                    <div className={`text-center text-green-500 text-2xl `}> {messageChoixReponse} </div>
                } 
            </div>
            <div className="mx-auto max-w-6xl ">
                    <div className="flex align-end justify-end justify-items-end">
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={()=>handleNbConsultationCommandeExercice()}>
                            REVOIR LA COMMANDE 
                        </button>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={()=>handleNbConsultationRegleAssociation()}>
                            REVOIR LA REGLE 
                        </button>
                        {(affichageBtnSuivant && (donneesExerciceChoisi.quizzQCM.length-1 > indexQuestion) ) &&
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={()=>handleQuestionSuivant()}>
                                SUIVANT{`>`} 
                            </button>
                        }
                        {(affichageBtnSuivant && (donneesExerciceChoisi.quizzQCM.length-1 == indexQuestion) ) &&
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={()=>handleResultatQuestion()}>
                                RESULTAT{`>`} 
                            </button>
                        }
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
        </>
    )
    
    
}

export default  AffichageChoixQuestionQCM ;