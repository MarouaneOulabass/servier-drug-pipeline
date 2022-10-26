1. Executer le pipeline:

Le command-line pour lancer le pipeline à partir de la root directory du projet:
    
python -m drug_pipeline \drug_pipeline\resources\drugs.csv drug_pipeline\resources\pubmed.csv drug_pipeline\resources\clinical_trials.csv drug_pipeline\result\report.json
drug_pipeline\resources\drugs.csv


le pipe reçoit 4 arguments:
    
    1- le path du fichier drugs file path
    2- le path du fichier pubmed
    4- le path du fichier clinical trial
    5- le path du fichier resultat

2. Tests:
J'ai créé des test sous le repertoire test, et il faut les lancer avec le pytest à partir du root directory

3. La solution Big Data

Solution 1:
Booster les performances Pandas:
Par défaut, la fonction Pandas read_csv() chargera l'intégralité des données en mémoire, ce qui pourrait être un problème de mémoire et de performances lors de l'importation d'un fichier CSV volumineux.
Une solution est d'utiliser l'argument appelé chunksize qui permet de récupérer les données dans des groupes de même taille.

Solution 2:
Une autre approche et de réimplémenter la solution dans GCP
-On commence par charger les fichiers brutes dans GCS
-Ensuite, avec un orchestrateur, google scheduler par exemple, on peut déclencher un programme python pour valider les fichiers(format de données...)
-Par la suite, on peut charger les données dans bigquery, et utiliser un outils de transformation de données (dbt, dataform...) pour nettoyer, transformer et générer les résultats souhaités
    
4. SQL
Cette partie a été réalisé sur BigQuery, la solution est dans le fichier 'SQL'