# FERREIRA_PETIT_2C2_Rendu_Leaflet_OpenLayers

-------------------------------------------------------------------------------------------------
Problèmes rencontrés 
-------------------------------------------------------------------------------------------------

Concernant la **partie OpenLayers**, nous avons rencontré, lors de l’élaboration et de la mise en place du GeoServer, plusieurs difficultés techniques majeures. Le principal problème réside dans l’impossibilité de relancer correctement le service une fois celui-ci arrêté. En effet, à chaque tentative de redémarrage, le GeoServer devient inutilisable, ce qui oblige à procéder à une reconstruction complète de l’environnement. 

Depuis le mois de décembre, cette opération a dû être répétée à plus de trois reprises sur des machines différentes, en reprenant chacune des étapes du cours. Chaque reconstruction implique une réinstallation complète du GeoServer, la reconfiguration des connexions aux données ainsi que la recréation et le paramétrage de l’ensemble des couches. Cette situation a engendré une perte de temps significative et a fortement ralenti l’avancement du projet. 

Ces dysfonctionnements rendent l’environnement instable et peu fiable pour une utilisation continue, malgré les différentes tentatives de résolution mises en œuvre. Cependant, la dernière fois, lorsque nous l'avons recréé une énième fois, nous avons réussi à tout relancer correctement.

Nous tenons à nous excuser pour les difficultés occasionnés par ces problèmes techniques. Malgré les nombreuses tentatives de stabilisation du GeoServer, ces contraintes ont impacté le bon déroulement du projet.

Pour la partie OpenLayers déposée sur GitHub, nous avons dû déposer chaque dossier à la main. Cela a engendré le fait que certains fichiers dont le fichier '.gitignore' et le dossier 'node_modules', qui étaient en 'caché' et donc impossible à déposer.

-------------------------------------------------------------------------------------------------

Concernant la **partie Leaflet**, nous avons rencontré des difficultés pour la lecture des couches. Nous avons trouvé comme solution d'utiliser l'extension 'LiveServer' sur VSCode. Il est donc nécessaire d'ouvrir le dossier concernant Leaflet dans VSCode, et de lancer le fichier HTML avec LiveServer.

-------------------------------------------------------------------------------------------------

En prenant en compte tous ces problèmes, nous avons oublié d'intégrer le petit texte pour présenter notre choix de jeu de données. Nous n'avons donc pas réitéré les manipulations pour intégrer cette partie pour l'appli OpenLayers. Pour des raisons d'homogénéisation de notre travail, nous ne l'avons pas intégrer, non plus, à l'application Leaflet. Vous trouverez le texte ci-dessous.

-------------------------------------------------------------------------------------------------

Dans le cadre de cette application, nous avons choisi d’exploiter le jeu de données Land Matrix Agri, qui recense les transactions foncières agricoles à grande échelle à travers le monde. En tant qu’ONG engagée dans la protection de l’environnement et des droits des populations locales, ce jeu de données nous permet d’analyser les impacts écologiques et sociaux de l’accaparement des terres, comme la déforestation, la perte de biodiversité et la pression sur les ressources naturelles.

L’application propose une visualisation cartographique mettant en évidence les projets agricoles ayant un impact direct sur les populations autochtones. Grâce à un filtre dédié, il est possible de n’afficher que les points concernés par ces impacts, afin de faciliter l’identification des zones les plus sensibles et de mieux comprendre l’ampleur des enjeux sociaux et environnementaux.

Chaque point affiché sur la carte est accompagné d’un pop-up informatif permettant d’accéder aux principales données du projet. Ces informations incluent le pays concerné, la surface du terrain exploitée, ainsi que le type de récolte prévue (cultures vivrières, industrielles, agrocarburants, etc.). Le pop-up précise également les types d’impact sur les populations locales, notamment les situations d’éviction ou de déplacement forcé. 

En tant qu'ONG engagée dans la protection de l’environnement et des droits des populations locales, cela permet de documenter les atteintes portées aux écosystèmes et aux droits des populations autochtones, de renforcer notre travail de sensibilisation auprès du public et de soutenir des actions de plaidoyer en faveur d’une gestion des terres plus juste, durable et respectueuse de l’environnement.
