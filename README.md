## comment lancer

set DEBUG = TpNote:* & npm start
//TpNote ici représente le nom du projet

## Sous postman

## Comment s'enregistrer dans la base de données 

Methode POST
Pour s'enregistrer il vous mettre l'url suivant et ecrire les informations dans body
http://www.localhost:4000/api/user/register

## Comment se connecter

Methode POST
Pour se connecter il vous mettre l'url suivant en se rassurant que les données concordent avec la base de données.
http://www.localhost:4000/api/user/login
Ensuite il y aura un acces token et un refresh token
l'acces token sera a mettre dans le header avec le mot Authorization et la valeur sera le token

## comment effectuer la recherche avec le code postal, ges et dpe

methode GET
mettre les differentes informations en parametres (params)
voici un exemple
http://www.localhost:4000/api/V1/geolocalisation?code_postal=72170&ges=A&dpe=A

## Recherche multicritere
pour ajouter la recherche avec la surface, il faut une surface min et une surface max. il suffit juste d'ajouter ces informations dans params
voici un exemple
http://www.localhost:4000/api/V1/geolocalisation?code_postal=72170&ges=A&dpe=A&surface_min=191&surface_max=193

## les informations recherchées sont directement enregistrées dans la base de données (mam_searches)

## supprimer une recherche
Pour supprimer une recherche, il faut mettre l'id de la recherche et l'id du resultat en parametre avec la methode DELETE 
voici un exemple
http://www.localhost:4000/api/V1/search/657051cafcb79f937764ab13/result/657051cafcb79f937764ab14

## Relancer un resultat de rcherche

J'ai écrit le code pour le faire mais je ne l'ai pas testé