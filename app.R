library(caret)

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
