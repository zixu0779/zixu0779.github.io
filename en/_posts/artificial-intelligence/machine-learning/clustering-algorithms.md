---
title: Clustering algorithms
translation_id: clustering-algorithms
source_digest: 4fbf5a4e738047dfa5d879ce2b2bb040b320ed4c502209123cd9e9181b4eba48
math: true
tags:
  - Clustering
  - Machine Learning
categories:
  - Artificial Intelligence
  - Machine Learning
sections: {"unsupervised-learning": "无监督学习", "cluster-analysis": "聚类分析"}
---

# Unsupervised learning

Unsupervised learning groups observations without being given labelled training examples.

**Advantages**

1. The algorithm can pick up patterns that the original choice of labels might have obscured.
2. Data does not need to be labelled, which can greatly expand the available sample.

Common applications include cluster analysis, association rules and dimensionality reduction.

# Cluster analysis

Cluster analysis groups objects according to how similar they are on selected attributes.

## K-means

Each cluster has a centre. An observation belongs to the cluster whose centre is closest to it.

Start with observations $x_1,x_2,\dots,x_k$ and cluster centres $u_1,u_2,\dots,u_m$. Initialise the centres by choosing observations at random.

- Compute the distance $dis(x_i,u_j)$ from each observation to each centre and assign it to the nearest one.
- Move each centre to the mean of the observations assigned to its cluster: $u_j=\frac{1}{|s_j|}\sum_{x_i\in s_j}x_i$, where $|s_j|$ counts the observations in cluster $j$.
- Repeat until the assignments and centres settle.

K-means is simple to implement and often converges quickly. You have to specify the number of clusters, and different initial centres can produce different results.

![K-means clustering animation](https://res.cloudinary.com/sycamore/image/upload/v1792696382/Typora/2023/03/169818722555497ae9d461a7352fabd1.gif)

## KNN

The k-nearest neighbours classifier uses **supervised learning**. For a new observation:

- Find its k nearest neighbours in the training set.
- Assign the class that occurs most often among those neighbours.

## Mean-shift

Mean-shift looks for cluster centres by moving towards regions of higher density.

Choose an observation at random as the starting centre $u$. Let $s_h$ contain the $k$ observations within radius $r$ of that centre.

1. For each point in the neighbourhood, take its displacement **from the centre to the point**. The mean displacement is $M(x)=\frac{1}{k}\sum_{x_i\in s_h}(x_i-u)$.
2. Add the displacement to the current centre: $u=u+M(x)$.
3. Repeat until the centre settles.

You choose the neighbourhood radius (the bandwidth). There is no need to specify the number of clusters up front.

![Mean-shift clustering animation](https://res.cloudinary.com/sycamore/image/upload/v1792696381/Typora/2023/03/89ca96a875623a1eee8814cc4066ae01.gif)

## DBSCAN

DBSCAN groups observations by local density.

1. Identify points with a sufficiently dense neighbourhood.
2. Expand each cluster outwards from its core points until no further points can be added.

DBSCAN can mark isolated observations as noise and does not require a predefined number of clusters. Results depend on how much the density varies across the dataset.
