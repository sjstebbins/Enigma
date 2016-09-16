# flask
from flask import Flask, request, redirect, g, render_template, jsonify
# app reload
from livereload import Server, shell
from formic import FileSet

from os import getcwd, path
import json
import random
import base64
import urllib
import pprint
import requests
from itertools import *
import subprocess
import pandas

 # R dependencies
import rpy2.robjects as ro
from rpy2.robjects import Formula
from rpy2.robjects.packages import importr
from rpy2.robjects import pandas2ri
import pandas.rpy.common as com
pandas2ri.activate()
import rpy2.interactive as r
import rpy2.interactive.packages
importr('datasets')
data = rpy2.interactive.packages.data
rpackages = r.packages.packages

# R function file
f = open('./app.R')
code = ''.join(f.readlines())
result = ro.r(code)
f.close()

#models
models = pandas.read_csv('./data/tag_data.csv', sep=',')
DATA = None;
best_model = None;


app = Flask(__name__)

# routes
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/getModels")
def getModels():
    # convert models dataframe to list of objects
    return(json.dumps(models.T.to_dict().values()))

@app.route("/getSampleDatasets")
def getSampleDatasets():
    return(json.dumps(data(rpackages.datasets).names()))

@app.route("/getSampleData")
def getSampleData():
    value = str(request.args['value'])
    global DATA   # Needed to modify global copy of DATA
    DATA = com.load_data(value)
    columns = DATA.columns.values.tolist()
    return(json.dumps(columns))

@app.route("/getSuggestedModels")
def getSuggestedModels():
    value = str(request.args['value'])
    # filter to only show models appropriate (regression or classification) for prediction column type
    if DATA[value].dtype == 'object':
        predictionType = 'Classification'
    else:
        predictionType = 'Regression'
    predictionModels = models.loc[models[predictionType] == 1]
    suggestedModels = predictionModels['Model'].values.tolist()
    response = {
        'suggestedModels': suggestedModels,
        'predictionType': predictionType,
        'observationCount': len(DATA.index)
    }
    return(json.dumps(response, sort_keys=True))

@app.route("/runSelectedModels")
def runSelectedModels():
    runModels = ro.r('runSelectedModels')
    summary = runModels(pandas2ri.py2ri(DATA), request.args['models'], request.args['target'])
    # print(com.convert_robj(summary))
    print('-' * 100)
    print(summary)
    return(json.dumps(str(summary)))

@app.route("/getPredictions")
def getPredictions():
    getPredictions = ro.r('getPredictions')
    predictions = getPredictions(DATA[30])
    print(predictions)
    return(json.dumps(str(predictions)))
    @app.route("/getEnsembleSuggestions")
    def getEnsembleSuggestions():
        getEnsembleSuggestions = ro.r('getEnsembleSuggestions')
        suggestions = getEnsembleSuggestions(request.args['value'])
        return(json.dumps(str(suggestions)))


# run server
if __name__ == "__main__":
    server = Server(app.wsgi_app)
    # watch for changes on the bundle.js file in static
    server.watch('static/**')
    server.serve(7777)
