#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pytest
import pandas as pd
import datatest as dt
import pathlib

@pytest.fixture(scope='module')
@dt.working_directory(__file__)
def df():
    return pd.read_csv(str(pathlib.Path().resolve().parent.parent) + r'\test\resources\clinical_trials.csv')

@pytest.mark.mandatory
def test_columns(df):
    dt.validate(
        df.columns,
        {'id', 'scientific_title', 'date', 'journal'},
    )

def test_id(df):
    dt.validate(df['id'], str)


def test_scientific_title(df):
    dt.validate(df['scientific_title'], str)
    
def test_date(df):
    dt.validate.regex(df['date'], r'^[0-9/0-9/0-9]')    

def test_journal(df):
    dt.validate(df['journal'], str)    