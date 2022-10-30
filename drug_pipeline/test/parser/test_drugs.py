#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pytest
import pandas as pd
import datatest as dt
import pathlib


@pytest.fixture(scope='module')
@dt.working_directory(__file__)
def df():
    return pd.read_csv(str(pathlib.Path().resolve().parent.parent) + r'\test\resources\drugs.csv')
    
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