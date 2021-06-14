Pour build:
    - ajouter "resources/app/" au début de chaque lien.
    - supprimer les for of
    - appelle des modules de base uniquement, pas de sous dossier (ex: "fs/promises")
    - ouvrir les PDF avec child_process.spawn("start chrome LIEN_DU_FICHIER")