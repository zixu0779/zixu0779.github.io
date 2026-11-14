---
translation_id: confusion-matrix
tags:
  - Model Evaluation
  - Classification Algorithms
  - Machine Learning
categories: ["AI", "Machine learning"]
source_digest: fec0cfa92b3c2db826785eb20d11ef738808e6be28d486fd8d09ce0df2fc2303
math: true
title: Confusion Matrices
sections: {"confusion-matrices": "混淆矩阵"}
---

# Confusion matrices

> **Accuracy** alone can be misleading. For example, if most observations are labelled 1, predicting 1 every time can give a high accuracy score without fitting a model.

- Accuracy alone hides the distribution of predictions across classes.
- It also hides which kinds of mistakes the model makes.

> A **confusion matrix**, also called an error matrix, compares predicted and actual classes. In binary classification, it records four counts:

- True positives (TP): actual positives predicted as positive.
- True negatives (TN): actual negatives predicted as negative.
- False positives (FP): actual negatives predicted as positive.
- False negatives (FN): actual positives predicted as negative.

> Other metrics you can derive from those counts

| Metric | Formula | What it measures |
| :--- | :---: | :--- |
| Accuracy | $\frac{TP+TN}{TP+TN+FP+FN}$ | Fraction of all predictions that are correct |
| Misclassification rate | $\frac{FP+FN}{TP+TN+FP+FN}$ | Fraction of all predictions that are wrong |
| Recall | $\frac{TP}{TP+FN}$ | Fraction of actual positives correctly identified |
| Specificity | $\frac{TN}{TN+FP}$ | Fraction of actual negatives correctly identified |
| Precision | $\frac{TP}{TP+FP}$ | Fraction of positive predictions that are correct |
| F1 score | $\frac{2\times Precision\times Recall}{Precision+Recall}$ | Harmonic mean of precision and recall |
