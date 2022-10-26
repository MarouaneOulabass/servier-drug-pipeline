from setuptools import setup

mypackage = 'drug_pipeline'

setup(
    name=mypackage,
    version='0.0.1',
    packages=[mypackage],
    author='Marouane OULABASS',
    description='generates a graph showing the relation between the drugs and medical publications',
    url='https://github.com/',
    setup_requires=["pytest-runner"],
    tests_require=["pytest"]
)
