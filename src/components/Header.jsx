import { Link, NavLink } from "react-router-dom";
import { useState, useContext } from "react";

import { ContexteAudio } from "../utils/contexte/ContexteAudio";

import { SpeakerWaveIcon , SpeakerXMarkIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid" ;

import imgLogo from '../assets/img/epmi_logo.png';


//composant, interne au header, permettant d'afficher le logo du site sur le header
function Logo(){
  return(
      <div className="md:justify-end logo h-14 w-14 bg-white p-1  mr-1 pt-2">
          <img src={imgLogo} /> 
      </div>
  );
}

//composant, interne au header, permettant d'afficher le bouton pour aller sur la âge de connexion 
function ConnectionButton(){
  return(
      <Link to="/Connexion" className="bg-lime-500 text-white font-[Poppins] py-2 px-6 rounded md:ml-8 hover:text-emerald-900 duration-500">Connexion</Link>
  );
}


//affiche le  header du site
function Header() {
    //permet de manipuler le bouton menu (hamburger) lors le header est sur un petit ecran
    let [open,setOpen] = useState(false);
    //permet de manipuler l'activation ou la désactivation du son 
    let {isPlaying, togglePlay} = useContext(ContexteAudio)
    
  
    return (
        <>
        <header className="bg-green-600 shadow-md w-full fixed top-0 left-0 text-amber-50 z-10">
            <div className="md:flex items-center md:justify-between bg-green-600  py-4 md:px-10 px-7">
                <Link to="/">
                    <div className='text-3xl cursor-pointer flex items-center  font-sans-serif'>
                        <Logo />
                        CASCADE
                    </div> 
                </Link>
                <div className="text-3xl absolute right-8 top-6 hover:text-emerald-900 duration-200 cursor-pointer md:hidden" 
                    onClick={() =>setOpen(!open)}>
                    {open ? <XMarkIcon className="h-8 w-8"/> : <Bars3Icon className="h-8 w-8"/> } 
                </div>
                <div>
                <ul className={`md:flex md:items-center md:pb-0 pb-10 absolute md:static bg-green-600 md:z-auto z-[100] 
                                left-0 w-full md:w-auto md:pl-0 pl-9 
                                ${open ? 'top-20 opacity-100': 'top-[-490px] md:opacity-100 opacity-0'}
                            `}>
                    <li className="md:ml-8 text-xl md:my-0 my-7 hover:text-emerald-900 duration-500">
                            <NavLink 
                                to="/" 
                                className={({ isActive }) =>
                                   isActive ? "text-emerald-900" : ""
                                }
                            >
                                INDEX
                            </NavLink>
                    </li>
                    <li className="md:ml-8 text-xl md:my-0 my-7 hover:text-emerald-900 duration-500">
                        <NavLink 
                            to="/exercices"
                            className={({ isActive }) =>
                               isActive ? "text-emerald-900" : ""
                            }>
                                EXERCICES
                        </NavLink>
                    </li>
                    <li className="md:ml-8 text-xl md:my-0 my-7 cursor-pointer hover:text-emerald-900 duration-500" onClick={togglePlay}>
                        {isPlaying ? <SpeakerWaveIcon className="h-8 w-8" /> : <SpeakerXMarkIcon className="h-8 w-8" />}
                    </li>  
                    {/* <li className="md:ml-8 text-xl md:my-0 my-7 cursor-pointer hover:text-emerald-900 duration-500"><SpeakerXMarkIcon className="h-8 w-8" /></li>   */}
                    
                    {/* <ConnectionButton /> */}
                </ul>
                </div>
            </div>
        </header>
     
        </>
    );
  
  }
  
export default Header ;