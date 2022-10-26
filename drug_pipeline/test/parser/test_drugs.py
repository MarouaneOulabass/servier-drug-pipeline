#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pytest
import pandas as pd
import datatest as dt


@pytest.fixture(scope='module')
@dt.working_directory(__file__)
def df():
    return pd.read_csv(r'C:\Users\oulabass.m\Downloads\Tests\SER\servier-drug-pipeline\drug_pipeline\test\resources\drugs.csv')

    
@pytest.mark.mandatory
def test_columns(df):
    dt.validate(
        df.columns,
        {'atccode', 'drug'},
    )



def test_atccode(df):
    dt.validate.regex(df['atccode'], r'^[A-Z0-9]')
  

def test_drug(df):
    dt.validate.regex(df['drug'], r'^[A-Z]')