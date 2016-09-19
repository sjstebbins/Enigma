library(caret)
library(caretEnsemble)
library(jsonlite)

BEST_MODEL = NULL

loadDependencies <- function (method) {
  requiredLibraries <- getModelInfo(method, regex = FALSE)[[1]]$library
  for (x in as.list(requiredLibraries)) {
    if (require (x, character.only = TRUE) == FALSE) {
      install.packages(x,repos='http://cran.us.r-project.org')
    }
    library(x, character.only=TRUE)
  }
}

runSelectedModels <- function (data, methods, target) {
  methods <- unlist(strsplit(methods, split='&'))
  removeParens <- function (method) { return(gsub(".*\\((.*)\\).*", "\\1", method))}
  methods <- lapply(methods, removeParens)
  # custom method to load or install dependencies of given method
  for (method in methods) {
    loadDependencies(method)
  }

  target <- as.formula(paste(target, "~ ."))

  control <- trainControl(method="repeatedcv", number=5, repeats=3, savePredictions=TRUE, classProbs=TRUE)
  models <- caretList(target, data=data, trControl=control, methodList=methods)
  results <- resamples(models)
  summary <- summary(results)
  # convert to short hand stats
  # stats <- data.frame(Model=summary$methods)
  # for (metric in summary$metrics) {
  #   Min. 1st Qu. Median   Mean 3rd Qu. Max.
  #   for (name in names(summary$statistics)) {
  #     stats[[metric]] = data.frame(summary$statistics[[metric]])[[name]]
  #   }
  # }
  summary$statistics[['models']] = summary$methods
  summary$statistics[['metrics']] = summary$metrics
  summary$statistics[['columns']] = names(data.frame(summary$statistics[[1]]))
  return(toJSON(summary$statistics))
}

getEnsembleSuggestions <- function ( data, model, target, type) {
  tag <- read.csv("./data/tag_data.csv", row.names = 1)
  tag <- as.matrix(tag)
  ## Select only models for regression
  regModels <- tag[tag[,type] == 1,]

  all <- 1:nrow(regModels)
  ## Seed the analysis with the SVM model
  start <- grep(model, rownames(regModels), fixed = TRUE)
  pool <- all[all != start]

  ## Select 4 models by maximizing the Jaccard
  ## dissimilarity between sets of models
  nextMods <- maxDissim(regModels[start,,drop = FALSE],
                        regModels[pool, ],
                        method = "Jaccard",
                        n = 4)

  suggestedMethodNames <- data.frame(rownames(regModels)[c(start, nextMods)])[,1]


  removeParens <- function (method) {
    return(gsub("[\\(\\)]", "", regmatches(method, gregexpr("\\(.*?\\)", method))[[1]]))
  }
  suggestedMethods <- lapply(suggestedMethodNames, removeParens)
  # custom method to load or install dependencies of given method

  for (method in suggestedMethods) {
    loadDependencies(method)
  }

  target <- as.formula(paste(target, "~ ."))

  control <- trainControl(method="repeatedcv", number=5, repeats=3, savePredictions=TRUE, classProbs=TRUE)
  models <- caretList(target, data=data, trControl=control, methodList=suggestedMethods)
  results <- resamples(models)
  correlation <- modelCor(results)
  summary <- summary(results)

  # sums <- lapply(correlation, sum)
  # max <- which(sums==max(sums))
  # x <- correlation[apply(correlation[, -1], MARGIN = 1, function(x) all(x > .75)), ]
  # y <- apply(x[, -1], MARGIN = 1, function(x) all(x > .75))

  methods <- unlist(strsplit(gsub("\\[|\\]", "", suggestedMethodNames), split=","))

  return(toJSON(list(
    correlation = correlation,
    models = summary$methods,
    columns = summary$methods,
    metrics = summary$metrics,
    modelNames = methods
  )))
}

createStackedEnsemble <- function (data, methods, target) {
  print(methods)
  methods <- unlist(strsplit(methods, split='&'))
  removeParens <- function (method) { return(gsub(".*\\((.*)\\).*", "\\1", method))}
  methods <- lapply(methods, removeParens)

  for (method in methods) {
    loadDependencies(method)
  }

  print(methods)
  # target <- as.formula(paste(target, "~ ."))
  #
  # control <- trainControl(method="repeatedcv", number=5, repeats=3, savePredictions=TRUE, classProbs=TRUE)
  # models <- caretList(target, data=data, trControl=control, methodList=methods)
  #
  # stackControl <- trainControl(method="repeatedcv", number=10, repeats=3, savePredictions=TRUE, classProbs=TRUE)
  # stack <- caretStack(models, method="rf", metric="Accuracy", trControl=stackControl)
  # results <- resamples(stack)
  # summary <- summary(results)
  # summary$statistics[['models']] = summary$methods
  # summary$statistics[['metrics']] = summary$metrics
  # summary$statistics[['columns']] = names(data.frame(summary$statistics[[1]]))
  # return(toJSON(summary$statistics))
  return('TEST')
}

getPredictions <- function (test) {
  predictions <- predict(BEST_MODEL, newdata = head(test))
  return(predictions)
}
