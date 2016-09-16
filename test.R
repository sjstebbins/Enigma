
# COMPLETE CARET INSTALLATION
# source("http://bioconductor.org/biocLite.R")
# biocLite()
# biocLite(c("arm", "gpls", "logicFS", "vbmp"))
#
# # 2) installs most of the 340 caret dependencies + seven commonly used ones
# mCom <- c("caret", "AppliedPredictiveModeling", "ggplot2",
#                 "data.table", "plyr", "knitr", "shiny", "xts", "lattice")
# install.packages(mCom, dependencies = c("Imports", "Depends", "Suggests"))

# # 3) load caret and check which additional libraries
# # covering over 200 models need to be installed
# # use caret getModelInfo() to obtain all related libraries
# require(caret); sessionInfo();
# cLibs <- unique(unlist(lapply(getModelInfo(), function(x) x$library)))
# detach("package:caret", unload=TRUE)
# install.packages(cLibs, dependencies = c("Imports", "Depends", "Suggests"))
# #
# # 4) load packages from R-Forge
# install.packages(c("CHAID"), repos="http://R-Forge.R-project.org")
#
# # 5) Restart R, clean-up mess, and say 'y' when asked
# # All packages that are not in CRAN such as SDDA need to be installed by hand
# biocLite()
# biocLite(c("gpls", "logicFS", "vbmp"))
# ipak <- function(pkg){
#     install.packages(pkg, dependencies=TRUE, repos='http://cran.us.r-project.org')
#     sapply(pkg, require, character.only = TRUE)
# }
# # usage
# packages <- c("caret")
# ipak(packages)
#
# install.packages('caret', dependencies=TRUE, repos='http://cran.us.r-project.org')
# library(mlbench)
# library(devtools)
# install_github("RevolutionAnalytics/miniCRAN")
# library("miniCRAN")
# pkgs <- c("caret")
# makeRepo(pkgDep(pkgs), path=file.path("./r_modules"), download=TRUE)
# library(caret)
# print(caret.dependencies('caret', check = FALSE,
#                      depLevel =
#                      c("Depends", "Imports", "Suggests")))
# ipak <- function(pkg){
#     new.pkg <- pkg[!(pkg %in% installed.packages()[, "Package"])]
#     if (length(new.pkg))
#         install.packages(new.pkg, dependencies = TRUE)
#     sapply(pkg, require, character.only = TRUE)
# }
#
# # usage
# packages <- c("caret")
# ipak(packages)
library(caret)
library(caretEnsemble)

loadDependencies <- function (method) {
  requiredLibraries <- getModelInfo(method, regex = FALSE)[[1]]$library
  for (x in as.list(requiredLibraries)) {
    if (require (x, character.only = TRUE) == FALSE) {
      install.packages(x,repos='http://cran.us.r-project.org')
    }
    library(x, character.only=TRUE)
  }
}

data(cars)
data <- cars
target ='Price'
methods =  c('lm', 'xgbTree')
# methods <- unlist(strsplit(methods, split='&'))
# removeParens <- function (method) { return(gsub(".*\\((.*)\\).*", "\\1", method))}
# methods <- lapply(methods, removeParens)
# # custom method to load or install dependencies of given method
for (method in methods) {
  loadDependencies(method)
}



target <- as.formula(paste(target, "~ ."))

control <- trainControl(method="repeatedcv", number=5, repeats=3, savePredictions=TRUE, classProbs=TRUE)
models <- caretList(target, data=data, trControl=control, methodList=methods)
results <- resamples(models)
summary <- summary(results)
# my.summary <- do.call(cbind, lapply(results, summary))
# my.summary <- summary(DATA$ids)
# summary <- data.frame(ids=names(summary$statistics$RMSE)), nums=my.summary)
stats <- data.frame()
for (metric in summary$metrics) {
  mean <- data.frame(summary$statistics[[metric]])$Mean
  stats[[metric]] = mean
}

print(stats)
# print(method$library)
#
#
# formula <- as.formula(paste(target, "~ ."))
# # Example of Boosting Algorithms
# control <- trainControl(method="repeatedcv", number=5, repeats=3, allowParallel=TRUE)
# # C5.0
# model <- train(formula, data=data, method=method, trControl=control, verbose=FALSE)
# # Stochastic Gradient Boosting
# # fit.rf <- train(formula, data=data, method="rf", trControl=control, verbose=FALSE)
# # summarize result
# # methods <- as.formula(method)
# # boosting_results <- resamples(list(rf=model))
# print(summary(model))
