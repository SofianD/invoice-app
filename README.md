# Invoice App

Interface graphique permettant de:
-   Créer des factures ou autre document à partir d'un modèle.
-   Créer une BDD pour les clients et une BDD contenant les informations de l'utilisateur.
    Ces BDD sont consultables uniquement par l'utilisateur (sauvegarde locale uniquement) et permet le remplissage automatisé des formulaires.
-   Conserver un historique des ventes.

## à faire avant la v1:
-   Refonte totale de la page "Création de facture".
-   Option d'autocompletion des infos client à partir de la BDD (après la refonte de la page "Création de facture").

## à faire plus tard:
-   Option de chiffrement des données.
-   Rendre l'application totalement compatible avec linux et macOS.

## Pour build:
-   Supprimer les for of
-   Appel des modules de base uniquement, pas de sous dossier (ex: "require('fs/promises')" ne fonctionnera pas contrairement à "require('fs').promises").
