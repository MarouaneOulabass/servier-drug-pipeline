import pandas as pd
import json
import logging


def load_file(filepath, col_names, col_types, parse_date=False):

    """
    This method is used to load files depending on the extension
    :param filepath: path of the file to load
    :param col_names: new columns name to use
    :param col_types: expected columns types
    :param parse_date: date columns to be parsed
    :return: dataFrame
    """
    ftype = filepath.split(".")[-1].lower()
    print(ftype)
    if ftype == "csv":
        return load_csv(filepath, col_names, col_types, parse_date)
    elif ftype == "json":
        return load_pub_json(filepath, col_types, parse_date)
    else:
        logging.error("unrecognized file extension")


def load_csv(filepath, col_names, col_types, parse_date=False):
    print(parse_date)
    if parse_date:
        return pd.read_csv(
            filepath,
            names=col_names,
            header=None,
            dtype=col_types,
            parse_dates=["date"],
        )
    else:
        return pd.read_csv(filepath, names=col_names, header=None, dtype=col_types)


def load_pub_json(filepath, col_types, parse_date=False):
    if parse_date:
        return pd.read_json(filepath, dtype=col_types, convert_dates=["date"])
    else:
        return pd.read_json(filepath, dtype=col_types)


def get_matched_sources(first_source, second_source, type):
    """This method is used to join two Dataframees

    Args:
        first_source (Dataframe): the first Dataframe
        second_source (Dataframe): the seconde Dataframe

    Returns:
        Dataframe: joined Dataframe
    """
    first_source["join"] = 1
    second_source["join"] = 1
    dfFull = first_source.merge(second_source, on="join").drop("join", axis=1)

    second_source.drop("join", axis=1, inplace=True)

    dfFull["match"] = dfFull.apply(
        lambda x: x.title.upper().find(x.drug.upper()), axis=1
    ).ge(0)
    dfResult = dfFull[dfFull["match"] == True]
    dfResult["type"] = type

    return pd.DataFrame(dfResult)


def dataframe_to_json(dfpubmed):
    """This method convert a dataframe to a json

    Args:
        dfpubmed (dataframe)

    Yields:
        json: result
    """
    for (drug_name), df_cus_grouped in dfpubmed.groupby(["drug"]):
        yield {
            "drug_name": drug_name,
            "pubmeds": list(
                split_nested_fields(df_cus_grouped[df_cus_grouped["type"] == "pubmed"])
            ),
            "trials": list(
                split_nested_fields(
                    df_cus_grouped[df_cus_grouped["type"] == "clinicaltrials"]
                )
            ),
            "journals": list(split_nested_fields(df_cus_grouped, "journal")),
        }


def split_nested_fields(df_cus_grouped, title_or_journal="title"):
    for (title, publication_date), df_transactions in df_cus_grouped.groupby(
        [title_or_journal, "date"]
    ):
        yield {
            title_or_journal: title,
            "date": publication_date,
        }


def concat_frames(drugs_pubmed, drugs_clinicaltrials):
    frames = [drugs_pubmed, drugs_clinicaltrials]
    return pd.concat(frames)


def save_json(result_filename, data):
    with open(result_filename, "w", encoding="utf8") as f:
        f.write(json.dumps(data, ensure_ascii=False, indent=4))


def load_json(file_path):
    with open() as fi:
        return json.load(fi)
