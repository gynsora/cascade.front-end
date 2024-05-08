import {  createContext, useState , useEffect} from "react";

// Création du contexte AudioContext
export const ContexteAudio = createContext()


export const AudioProvider = ({ children }) => {
    const [nomAudio, setNomAudio] = useState("Jazzure.mp3")
    const [audio, setAudio] = useState(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
   
    useEffect(() => {
     // console.log(audio.src)
      audio.src="";
      audio.pause();
      audio.src = "/sound/"+nomAudio;
      if(isPlaying){
        audio.play();
      }
      return() =>{
        //audio.pause();
        audio.src = ""
      }
    }, [nomAudio])
    
    //Fonction pour jouer ou mettre en pause l'audio
    const togglePlay = () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };
    
    const handleNomAudio = (nouveauNomAudio) => {
      setNomAudio(nouveauNomAudio)
    }

    // // Fonction pour charger un fichier audio
    // const loadAudio = (src) => {
    //     audio.src = src;
    //     setIsPlaying(false); // Arrête la lecture lorsque le fichier est chargé
    // };
    const contextValue = {
      handleNomAudio,
      isPlaying,
      togglePlay,
    };

    return (
      <ContexteAudio.Provider value={contextValue}>
        {children}
      </ContexteAudio.Provider>
    )
}