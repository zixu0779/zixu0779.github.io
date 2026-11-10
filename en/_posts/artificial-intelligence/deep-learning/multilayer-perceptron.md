---
title: The multilayer perceptron
translation_id: multilayer-perceptron
source_digest: 78815839200ad070ba98b3940f9ec61cab2d726ac5615fd70006b4dadbf8e7e9
math: true
tags:
  - Neural Networks
  - MLP
  - Machine Learning
categories:
  - Artificial Intelligence
  - Deep Learning
sections: {"the-multilayer-perceptron": "多层感知器"}
---

# The multilayer perceptron

An MLP (multilayer perceptron) is a network of connected units.

> The analogy comes from the way neurons pass signals. A neuron's dendrites receive signals from several other neurons. Its axon carries the outgoing signal on to the next neurons, releasing neurotransmitters at the connections.
>
> In an MLP, a unit takes inputs from several units in the previous layer, applies a function $f(x)$ and passes its output to the next layer.

Here is a simplified example:

$a_{1}^{2} =g(\theta_{10}^{1}x_{0}+\theta_{11}^{1}x_{1}+\theta_{12}^{1}x_{2}+\theta_{13}^{1}x_{3})$

$a_{2}^{2} =g(\theta_{20}^{1}x_{0}+\theta_{21}^{1}x_{1}+\theta_{22}^{1}x_{2}+\theta_{23}^{1}x_{3})$

$a_{3}^{2} =g(\theta_{30}^{1}x_{0}+\theta_{31}^{1}x_{1}+\theta_{32}^{1}x_{2}+\theta_{33}^{1}x_{3})$

$y=g(\theta_{10}^2a_0^2+\theta_{11}^2a_1^2+\theta_{12}^2a_2^2+\theta_{13}^2a_3^2)$

![An input layer connected to three hidden units and a single output](https://res.cloudinary.com/sycamore/image/upload/v1792084674/Typora/2024/02/ffb09cdb9b4d5d5d009ae40b555cb33d.png)

In the diagram, $x_i$ denotes an input, $a_i^2$ a hidden-layer activation, $y$ the output and $\theta^j$ the weights.

==The three hidden units and one output unit together make up this MLP.==

In practice, the output layer can have more than one output.
