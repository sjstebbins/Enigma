# import pandas.rpy.common as com
# import rpy2.robjects as ro
# from rpy2.robjects import Formula
# from rpy2.robjects.packages import importr
# f = open('./R/app.R')
# code = ''.join(f.readlines())
# result = ro.r(code)
# f.close()
#
# from rpy2.robjects import r
# r.data('iris')
# df_iris = pandas2ri.ri2py(r[name])
#
# loadSampleData = ro.r('loadSampleData')
# # request.args['type']
# data = str(loadSampleData('iris'))
 # R dependencies
# import rpy2.robjects as ro
# from rpy2.robjects import Formula
# from rpy2.robjects.packages import importr
# import rpy2.interactive as r
# import rpy2.interactive.packages
# data = rpy2.interactive.packages.data
# rpackages = r.packages.packages
# importr('datasets')
#
# f = open('./R/app.R')
# code = ''.join(f.readlines())
# result = ro.r(code)
# f.close()
#
# getEnsembleSuggestions = ro.r('getEnsembleSuggestions')
# suggestions = getEnsembleSuggestions('Regression')
import rpy2.robjects as ro
from rpy2.robjects import Formula
from rpy2.robjects.packages import importr
import rpy2.interactive as r
import rpy2.interactive.packages
importr('datasets')
data = rpy2.interactive.packages.data
rpackages = r.packages.packages
import pandas.rpy.common as com
import pandas, json



# models = pandas.read_csv('./data/tag_data.csv', sep=',')
DATA = com.load_data('iris')
print (DATA['Species'].dtype)
# print(pandas.DataFrame(DATA, names=tuple(DATA['iris'].names)))
# col = DATA['Species'].dtype
# print(json.dumps(col))
