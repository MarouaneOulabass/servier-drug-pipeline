import drug_pipeline.src.parser.drugs_parser as parser
import pandas as pd


def get_most_commun_journal(file_path):
    """Get the most commun journal

    Args:
        file_path (string): path of file to analyse

    Returns:
        string: name of the journal
    """

    # Load the json file
    data = parser.load_json(file_path)

    # Select only the needed columns
    df = pd.json_normalize(data, record_path=["journals"], meta=["drug_name"])
    df.drop("date", axis=1, inplace=True)

    # Delete duplicates
    df.drop_duplicates(inplace=True)

    # Mode methode returns the most cummun record
    return df["journal"].mode()
