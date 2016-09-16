library(caret)
library(caretEnsemble)
BEST_MODEL = NULL

getEnsembleSuggestions <- function (type) {
  tag <- read.csv("./data/tag_data.csv", row.names = 1)
  tag <- as.matrix(tag)
  ## Select only models for regression
  regModels <- tag[tag[,type] == 1,]

  all <- 1:nrow(regModels)
  ## Seed the analysis with the SVM model
  start <- grep("(svmRadial)", rownames(regModels), fixed = TRUE)
  pool <- all[all != start]

  ## Select 4 model models by maximizing the Jaccard
  ## dissimilarity between sets of models
  nextMods <- maxDissim(regModels[start,,drop = FALSE],
                        regModels[pool, ],
                        method = "Jaccard",
                        n = 4)
  return(rownames(regModels)[c(start, nextMods)])
}

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
  stats <- data.frame(Model=summary$methods)
  for (metric in summary$metrics) {
    mean <- data.frame(summary$statistics[[metric]])$Mean
    stats[[metric]] = mean
  }
  print(stats)
  return(stats)

  # # Example of Boosting Algorithms
  # control <- trainControl(method="repeatedcv", number=5, repeats=3, allowParallel=TRUE)
  # # C5.0
  # model <- train(formula, data=data, method=method, trControl=control, verbose=FALSE)
  # BEST_MODEL <- model
  # Stochastic Gradient Boosting
  # fit.rf <- train(formula, data=data, method="rf", trControl=control, verbose=FALSE)
  # summarize result
  # methods <- as.formula(method)
  # boosting_results <- resamples(list(rf=model))
  # print(summary(model))
  # return(summary(model))
  # dotplot(boosting_results)
}

getPredictions <- function (test) {
  predictions <- predict(BEST_MODEL, newdata = head(test))
  return(predictions)
}
