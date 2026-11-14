---
title: Cryptography Basics
translation_id: cryptography-basics
source_digest: d87bd72b6313bcd23f2f92e1e3e48eed649c327483eb24a1c17db7a32d83e9cc
tags:
  - Coursework
categories:
  - Cybersecurity
  - Cryptography
sections: {"mathematical-thinking-in-cryptography": "数学思维在密码学中的应用", "what-is-cryptography": "密码学介绍", "classical-ciphers": "古典密码", "caesar-cipher": "凯撒密码", "vigenère-cipher": "维吉尼亚密码", "symmetric-and-asymmetric-cryptography": "对称密码体制和非对称密码体制", "1-symmetric-encryption": "一对称加密", "2-asymmetric-encryption": "二非对称加密", "3-four-block-cipher-modes": "三分组加密的四种工作模式", "1-ecb": "1ecb", "2-cbc": "2cbc", "3-cfb": "3cfb", "4-ofb": "4ofb"}
---

:::info
Coursework (o′┏▽┓｀o)
:::

# Mathematical thinking in cryptography

Before getting to the mathematics, it helps to start with the problem these techniques are meant to solve.

## What is cryptography?

One question cryptography asks is how to keep information confidential. People have tried to hide messages for thousands of years, for instance by writing with invisible ink. Once a reader knows how to reveal the ink, the message is there in plain sight. A cipher takes a different approach: a key determines how the message is transformed.

![Illustration accompanying the introduction](https://res.cloudinary.com/sycamore/image/upload/v1792216253/Covers/d03e7e1cc30ada4331e61a76e994adc3.png)

## Classical ciphers

For this coursework I used 1976 as the dividing line between classical and modern cryptography. The classical examples here fall into two broad families: **transposition** rearranges the symbols of the plaintext, while **substitution** replaces them according to a cipher alphabet.

### Caesar cipher

A simple substitution is a shift: move each letter forward by $n$ places in a fixed alphabet, wrapping around at the end. The shift $n$ is the key. The familiar Caesar cipher shifts the 26 letters of the Latin alphabet. The same idea can be extended to an alphabet that also includes the ten digits.


![A shifted cipher alphabet](https://res.cloudinary.com/sycamore/image/upload/v1792696652/Typora/2022/03/48cfe8124c9d3306a048a7112bec67fd.png)

With key 3, the plaintext alphabet starts ABCDE and ends WXYZ; its cipher alphabet starts DEFGH and ends ZABC. With only 26 possible shifts including zero, one can try every shift and read the candidate that makes sense.

### Vigenère cipher

The Vigenère cipher varies the shift from letter to letter. This is **polyalphabetic substitution**: choose successive substitution alphabets according to a key and repeat the key when it runs out.

More generally, one could use alphabet $i$ for the first $n$ letters, alphabet $j$ for the next $m$, and cycle back to the beginning after using them all. In Vigenère, each run is just one letter long.

Each of the 26 alphabets in the table corresponds to a Caesar shift and is labelled A through Z. Each key letter selects the alphabet for one plaintext letter.


![The Vigenère table](https://res.cloudinary.com/sycamore/image/upload/v1792696649/Typora/2022/03/92b5e30160b6461906f1c86ecd48e578.png)

For example, encrypt **GREAT** with **GOOD**. Repeat the key to match the message length: **GOODG**. Plaintext G with key G gives M; plaintext R with key O gives F. The remaining letters give SDZ, so the result is **MFSDZ**.


Compared with testing all 26 Caesar shifts, recovering an unknown repeating key was a much bigger task before computers.

## Symmetric and asymmetric cryptography

### 1. Symmetric encryption

Both parties use the same secret key to encrypt and decrypt. Symmetric algorithms are computationally efficient and are widely used for bulk encryption. After the US adopted DES as a standard in 1977, symmetric cryptography developed rapidly and saw widespread international use. Two important families are block ciphers and stream ciphers.

The algorithm can be public; confidentiality depends on protecting the key. Distribution and management become difficult when every pair of participants needs a separate shared secret. For a distributed network, arranging and protecting all those pairwise keys adds considerable cost. Shared keys can also authenticate messages using a suitable construction, but the parties cannot use them to produce a publicly verifiable signature identifying just one of them.

The size of the key space affects resistance to exhaustive search: a one-bit key leaves only two possibilities, so an attacker can try 0 and then 1. At the other extreme, imagine trying every possible one-megabyte key. That illustrates how quickly the search space grows. In practice, symmetric ciphers use much shorter keys, often 256 bits or fewer. Choosing a real cipher also means considering the security and performance of its supported key sizes.

A **block cipher** transforms fixed-size blocks. A mode of operation specifies how to use it across a message. A **stream cipher** produces a pseudorandom keystream from the key and associated initial state; the recipient reproduces the stream to recover the plaintext.

Examples from these notes:

1. **DES**, the Data Encryption Standard, is a historical block cipher valued for its speed when encrypting large amounts of data.
2. **3DES**, or Triple DES, applies the DES primitive three times per block with multiple key components. The three-key variant described here uses three distinct keys to increase the effective strength over single DES.
3. **AES**, the Advanced Encryption Standard, succeeded DES and combines fast encryption with support for 128-, 192- and 256-bit keys.

The main characteristics of symmetric encryption are:

- Sender and recipient share a key.
- Encryption and decryption are fast enough for long messages.
- Both sides have to protect that key in transit and manage it securely.

### 2. Asymmetric encryption

A key pair contains a public key that can be distributed and a private key that its owner keeps secret. For example, to send confidential data to a bank, a sender encrypts to the bank’s authentic public key. The bank decrypts with its private key, which it never has to send across the network.

Public-key operations are generally more expensive than symmetric encryption of bulk data. Hybrid protocols combine them: public-key techniques help establish or protect a key, then symmetric encryption handles the data. This addresses the problem of agreeing on a secret over an insecure channel.

Public-key cryptography includes RSA, ElGamal, historical knapsack schemes, Rabin and elliptic-curve constructions. Diffie–Hellman is a related key-agreement technique.

### 3. Four block cipher modes

#### 1. ECB

Electronic Codebook encrypts each block independently under the same key. Blocks can be processed in parallel, and a transmission error in one ciphertext block affects only its corresponding plaintext block. Inputs must be arranged in complete blocks, with padding if necessary.

The central weakness is visible repetition: equal plaintext blocks under the same key produce equal ciphertext blocks. Repeated structure can therefore remain visible even though individual blocks have been encrypted.

#### 2. CBC

Cipher Block Chaining XORs each plaintext block with the preceding ciphertext block before encrypting it. An initialisation vector (IV) supplies the input for the first block. Each ciphertext block therefore depends on what came before it; equal plaintext blocks can encrypt differently.

Encryption is sequential and normally needs padding to a whole number of blocks. The mode requires a suitable IV.

#### 3. CFB

Cipher Feedback encrypts the previous feedback value and XORs the result with the current plaintext to produce ciphertext. The ciphertext is then fed into the next step. As in CBC encryption, the preceding ciphertext enters the next step. Here the feedback varies the keystream, so identical plaintext segments can encrypt differently. This uses a block cipher in a stream-like mode. Encryption depends on previous outputs, and a ciphertext error can affect subsequent output for a limited span.

#### 4. OFB

Output Feedback feeds the **cipher’s output** back into the next step to generate a keystream independently of the plaintext. XOR combines that stream with the message. Applying the same XOR again recovers the plaintext, so encryption and decryption use the same keystream procedure.

Keystream generation is sequential, although it can be done before the plaintext is available. Unlike CFB, flipping one ciphertext bit flips only its corresponding plaintext bit. The error does not propagate to later blocks because ciphertext is not fed back into keystream generation.
