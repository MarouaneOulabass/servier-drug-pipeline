import drug_pipeline.src.parser.drugs_parser as parser
import pytest
import pandas as pd


DRUGS_TYPE={'atccode': str, 'drug': str}
DRUGS_HEADER = ['atccode','drug']
PUBMED_TYPE={'id': str, 'title': str, 'date': str, 'journal': str}
PUBMED_HEADER = ['id','title','date','journal']
DRUGS_FILE_PATH = r'C:\Users\oulabass.m\Downloads\Tests\SER\servier-drug-pipeline\drug_pipeline\test\resources\drugs.csv'
PUBMED_CSV_FILE_PATH = r'C:\Users\oulabass.m\Downloads\Tests\SER\servier-drug-pipeline\drug_pipeline\test\resources\pubmed.csv'
PUBMED_JSON_FILE_PATH = r'C:\Users\oulabass.m\Downloads\Tests\SER\servier-drug-pipeline\drug_pipeline\test\resources\pubmed.json'
CLINICAL_TRIALS_FILE_PATH = r'C:\Users\oulabass.m\Downloads\Tests\SER\servier-drug-pipeline\drug_pipeline\test\resources\clinical_trials.csv'


def test_parse_drugs():
    drugs = parser.load_file(DRUGS_FILE_PATH, DRUGS_HEADER, DRUGS_TYPE )
    assert drugs.iloc[2]['atccode'] == 'S03AA'
    assert drugs.iloc[2]['drug'] == 'TETRACYCLINE'

def test_parse_pubmed_csv():
    pubmeds = parser.load_file(PUBMED_CSV_FILE_PATH, PUBMED_HEADER, PUBMED_TYPE, True)
    assert pubmeds.iloc[2]['id'] == '2'
    assert pubmeds.iloc[2]['title'] == 'An evaluation of benadryl, pyribenzamine, and other so-called diphenhydramine antihistaminic drugs in the treatment of allergy.'
    assert pubmeds.iloc[2]['date'] == '01/01/2019'
    assert pubmeds.iloc[2]['journal'] == 'Journal of emergency nursing'    

def test_parse_clinical_trials():
    clinicaltrials = parser.load_file(CLINICAL_TRIALS_FILE_PATH, PUBMED_HEADER, PUBMED_TYPE, True)
    assert clinicaltrials.iloc[2]['id'] == 'NCT04189588'
    assert clinicaltrials.iloc[2]['title'] == 'Phase 2 Study IV QUZYTTIR™ (Cetirizine Hydrochloride Injection) vs V Diphenhydramine'
    assert clinicaltrials.iloc[2]['date'] == '1 January 2020'
    assert clinicaltrials.iloc[2]['journal'] == 'Journal of emergency nursing'
