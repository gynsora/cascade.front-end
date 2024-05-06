export const DonneeExercices = [
    {
            "categorie" : "Pâtisserie",
            //texte et son pour décrire la commande de l'exercice (cette description apparaît pour les exercices d'association)
            "txtCommandeExerciceAssociation": "Ta mère veut bien te faire la tarte aux pommes que tu lui demandes.	Elle s\'aperçoit qu\'il lui manque quelques produits. Peux-tu aller les chercher ? Elle a besoin de :",
            "sndCommandeExerciceAssociation":"cascade55.mp3",
            
            //texte et son pour décrire les règles de conversion de l'exercice (cette description apparaît pour les exercices d'association)
            "txtRegleAssociation": "Observe bien l'image qu'il faudra choisir pour obtenir les ingrédients nécessaires.",
            "sndRegleAssociation": "cascade3.mp3",
            
            //texte et son lorsque les resultats de l'exercice correspondent à la commande de l'exercice (cette description apparaît pour les exercices d'association)
            "txtValidationExerciceAssociationOk"	: "Parfait, tu as tous les ingrédients pour finir la tarte !",
            "sndValidationExerciceAssociationOk"	: "cascade8.mp3",
            
            //texte et son lorsque les resultats de l'exercice ne correspondent pas à la commande de l'exercice (cette description apparaît pour les exercices d'association)
            "txtValidationExerciceAssociationKo"	: "Regarde les résultats et complète les quantités en reprenant l'exercice",
            "sndValidationExerciceAssociationKo"	: "cascade7.mp3",

            //texte et son pour introduire l'exercice de type quizz (cette description apparaît pour les exercices de type quizz)
            "titreIntroductionExerciceQuizz": "Voilà, la tarte est faite, bravo !",
            "txtIntroductionExerciceQuizz":"Maintenant il te faut le couteau pour pouvoir la couper. Mais je ne vais pas donner cette possibilité à n'importe qui !<br/>Pour savoir que c'est bien ta tarte, tu dois essayer de répondre à quelques questions.<br/><br/>Clique sur Quizz ou sur Vrai ou faux",
            "sndIntroductionExerciceQuizz":"cascade10.mp3",

            //texte et son pour valider l'exercice de type quizz  (cette description apparaît pour les exercices de type quizz)
            "txtValidationExerciceQuizz":"Pour voir le résultat clique sur le couteau:",
            "sndValidationExerciceQuizz":"cascade59.mp3",

            "target" : "Desserte",
            "imgCategorie": "Pâtisserie.jpg",

            "listeExercice":[
                {
                    "niveau": "niveau 1",
                    "type": "association",
                    "txtExplicationExercice":"Pour obtenir un ingrédient, clique l'image correspondante, puis fais glisser cet ingrédient sur la desserte, à droite de l'écran. Dès que tu auras stocké les quantités nécessaires à la commande, valide le résultat.",
                    "sndExplicationExercice": "cascade4.mp3", 
                    "ressourceMax": "materiaux",
                    "etapeRessource": ["materiaux","composants"] 
                },
                {
                    "niveau": "niveau 2",
                    "type": "association",
                    "txtExplicationExercice":"Pour obtenir un ingrédient clique d'abord sur un euro puis sur l'image correspondante. Pour accéder au produit dont tu as besoin. Dès que tu auras stocké les quantités nécessaires à la commande, valide le résultat.",
                    "sndExplicationExercice": "cascade6.mp3", 
                    "ressourceMax": "monnaies",
                    "etapeRessource": ["monnaies","materiaux","composants"]  
                }
            ],

            "composants":[
                { 
                    "id" : 1 ,
                    "qteOk" : 6,
                    "nom": "pomme",	
                    "img": "pomme.png",
                    "nomAuPluriel" : "pommes",
                    "coutComposant" :[
                        {"ressource": "composants", "listeImg":["pomme.png"], "texte":"pomme"},
                        {"ressource": "materiaux", "listeImg": ["pommier.png"], "texte":"un pommier"},
                        {"ressource": "monnaies","listeImg": ["pieceRouge.png"]},
                        {"ressource":"symboles","listeImg": []}
                    ]

                }, 
                { 
                    "id" : 2 ,
                    "qteOk" : 2,
                    "nom": "oeuf",	
                    "img": "oeuf.png",	
                    "nomAuPluriel" : "oeufs",
                    "coutComposant" :[
                        {"ressource": "composants", "listeImg":["oeuf.png"], "texte":"oeuf"},
                        {"ressource":"materiaux", "listeImg": ["poule.png"], "texte":"une poule"},
                        {"ressource":"monnaies", "listeImg": ["pieceJaune.png"]},
                        {"ressource":"symboles", "listeImg":[]}
                    ]
                },  
                { 
                    "id" : 3 ,
                    "qteOk" : 5,
                    "nom": "plaquettes de beurre",	
                    "img": "beurre.png",
                    "nomAuPluriel" : "plaquettes de beurre",
                    "coutComposant" :[
                        {"ressource": "composants", "listeImg":["beurre.png"], "texte":"plaquettes de beurre"},
                        {"ressource":"materiaux", "listeImg": ["vache.png"], "texte":"une vache"},
                        {"ressource":"monnaies", "listeImg": ["pieceVerte.png"]},
                        {"ressource":"symboles", "listeImg":[]}
                    ]   
                }, 
                { 
                    "id" : 4 ,
                    "qteOk" : 2,
                    "nom": "plaquet de farine",	
                    "img": "farine.png",
                    "nomAuPluriel" : "plaquets de farine",
                    "coutComposant" :[
                        {"ressource": "composants", "listeImg":["farine.png"], "texte":"plaquet de farine"},
                        {"ressource":"materiaux","listeImg": ["ble.png"] ,"texte":"du blé"},
                        {"ressource":"monnaies","listeImg": ["pieceOrange.png"]},
                        {"ressource":"symboles","listeImg":[]}
                    ] 
                }, 
                { 
                    "id" : 5 ,
                    "qteOk" : 12,
                    "nom": "sucre",	
                    "img": "sucre.png",	
                    "nomAuPluriel" : "sucres",
                    "coutComposant" :[
                        {"ressource": "composants", "listeImg":["sucre.png"], "texte":"sucre"},
                        {"ressource":"materiaux","listeImg": ["canneASucre.png"], "texte":"de la canne a sucre"},
                        {"ressource":"monnaies","listeImg": ["pieceBleu.png"]},
                        {"ressource":"symboles","listeImg":[]}
                    ] 
                }, 
            ],
            "materiaux":[
               
                {
                    "nom": "une poule",
                    "img": "poule.png",
                    "utilisable": true
                },
                { 
                    "nom" :'bol' ,
                    "img": "bol.png",
                    "utilisable": false
                },
                { 
                    "nom" :'chien' ,
                    "img": "chien.png",
                    "utilisable": false
                },
                {
                    "nom": "du blé",
                    "img": "ble.png",
                    "utilisable": true
                },
                {
                    "nom": "de la canne a sucre",
                    "img": "canneASucre.png",
                    "utilisable": true
                },
               
                { 
                    "nom" :'cerise',
                    "img": "cerise.png",
                    "utilisable": false 
                },
                {
                    "nom": "un pommier",
                    "img": "pommier.png",	
                    "utilisable": true
                },
                { 
                    "nom" :'poire' ,
                    "img": "poire.png",
                    "utilisable": false
                },
                { 
                    "nom" :'lait',
                    "img": "lait.png",
                    "utilisable": false 
                },
                { 
                    "nom" :'artichaut' ,
                    "img": "artichaut.png",
                    "utilisable": false
                },
                {
                    "nom": "une vache",
                    "img": "vache.png",
                    "utilisable": true
                },
                { 
                    "nom" :'boule' ,
                    "img": "boule.png",
                    "utilisable": false
                },
                { 
                    "nom" :'casquette',
                    "img": "casquette.png",
                    "utilisable": false 
                },
                { 
                    "nom" :'patate' ,
                    "img": "patate.png",
                    "utilisable": false
                },
                { 
                    "nom" :'drapeau',
                    "img": "drapeau.png",
                    "utilisable": false 
                }  
            ],
            "monnaies":[
                {
                    "nom": "piece jaune",
                    "img": "pieceJaune.png",
                    "utilisable": true 
                },
                {
                    "nom": "piece verte",
                    "img": "pieceVerte.png",
                    "utilisable": true 
                },
                {
                    "nom": "piece orange",
                    "img": "pieceOrange.png",
                    "utilisable": true 
                },
                {
                    "nom": "piece bleu",
                    "img": "pieceBleu.png",
                    "utilisable": true 
                }
                ,
                {
                    "nom": "piece violette",
                    "img": "pieceViolette.png",
                    "utilisable": false 
                },
                {
                    "nom": "piece rouge",
                    "img": "pieceRouge.png",
                    "utilisable": true 
                },

            ],
            "symboles":[
            ],
            "quizzQCM":[

            ],
            "quizzVraiFaux":[

            ]
    }
]



