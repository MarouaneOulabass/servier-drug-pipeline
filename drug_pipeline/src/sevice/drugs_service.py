import drug_pipeline.src.parser.drugs_parser as parser
import json

DRUGS_TYPE = {"atccode": str, "drug": str}
DRUGS_HEADER = ["atccode", "drug"]
PUBMED_TYPE = {"id": str, "title": str, "date": str, "journal": str}
PUBMED_HEADER = ["id", "title", "date", "journal"]


def generate_graph(
    drugs_file_path, pubmed_file_path, clinical_trials_file_path, result_filename
):
    """Generate the graph

    Args:
        drugs_file_path (string): path of drugs file
        pubmed_file_path (string): path of pubmed file
        clinical_trials_file_path (string): path of clinical trials file
        result_filename (string): path where to save result file
    """
    # Load drugs records
    drugs = parser.load_file(drugs_file_path, DRUGS_HEADER, DRUGS_TYPE)
    # Load pubmed records
    pubmed = parser.load_file(pubmed_file_path, PUBMED_HEADER, PUBMED_TYPE, True)
    # Load clinical trials records
    clinicaltrials = parser.load_file(
        clinical_trials_file_path, PUBMED_HEADER, PUBMED_TYPE, True
    )
    # Get the list of the drugs related to the pubmeds
    drugs_pubmed = parser.get_matched_sources(drugs, pubmed, "pubmed")
    # get the list of the drugs related to the clinical trials
    drugs_clinicaltrials = parser.get_matched_sources(
        drugs, clinicaltrials, "clinicaltrials"
    )

    # Join the two lists
    drugs_pubmed_clinicaltrials = parser.concat_frames(
        drugs_pubmed, drugs_clinicaltrials
    )
    # Convert result to json format file
    data = list(parser.dataframe_to_json(drugs_pubmed_clinicaltrials))
    # Save the json file
    parser.save_json(result_filename, data)
