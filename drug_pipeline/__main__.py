import sys
import logging
import drug_pipeline.src.sevice.drugs_service as drugs_service


def run_pipeline(
    drugs_file_path, pubmed_file_path, clinical_trials_file_path, result_filename
):
    """
    This pipeline parses the drugs, medical publications, clinical trials, and then generates a graph which
    presents the relation between the drugs, medical publications, clinical trials and the journals. Once the graph
    is generated, it gets written into a json file
    :param drugs_file: path to the csv file containing the list of drugs
    :param pubmed_files: list of the medical publication csv and json filepaths
    :param clinical_trial_files: list of the clinical trial csv and json filepaths
    :param result_filename: The name of the output file
    :return: void
    """

    drugs_service.generate_graph(
        drugs_file_path, pubmed_file_path, clinical_trials_file_path, result_filename
    )


if __name__ == "__main__":

    try:
        drugs_file = sys.argv[1]
        pubmed_file = sys.argv[2]
        clinical_trials_file = sys.argv[3]
        result_filename = sys.argv[4]
    except:
        logging.error(
            "Missing required arguments: \n"
            "arg-1: drugs csv file\n"
            "arg-2: pubmed csv file\n"
            "arg-3: clinical trial csv file\n"
            "arg-4: output directory\n"
        )
        raise Exception("Missing required arguments!")

    run_pipeline(drugs_file, pubmed_file, clinical_trials_file, result_filename)
