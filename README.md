# LookMa

LookMa is a bare-bones React Native app built for Android users as an interface for their locally-run LLMs.

When toying around with running LLMs locally, I was annoyed at not having a simple way to connect to my server from my Android phone. I built LookMa to address this issue, and open sourced it.

It can store multiple server settings, and multiple conversations across those servers. 

All data is stored on device in a SQLite database.

## Version 1.0.3 Update

- Fixed HTTPS/HTTP connection issues for local servers
- Improved connection handling for local LLMs
- Better protocol detection for server addresses  
- Now supports both `http://` and `https://` protocols

# Tutorial

[![LookMa Tutorial](https://i9.ytimg.com/vi/DY0rSqmzqNs/mqdefault.jpg?v=65ea1f2d&sqp=CLDoqK8G&rs=AOn4CLDrRnXfXhyA213U4xdgPtZzNRAQ4g)](https://youtu.be/DY0rSqmzqNs "LookMa Tutorial")

# License

LookMa is SamPatt Licensed, which is a MIT derivative. License is in the repository.

# Screenshots

## Adding a server

<img src="https://i.imgur.com/qmf6I4p.jpeg" width="300">

## Selecting a server

<img src="https://i.imgur.com/lgIQOvr.jpeg" width="300"> 

## Selecting a conversation

<img src="https://i.imgur.com/WmedDTX.jpeg" width="300"> 

## Chat

<img src="https://i.imgur.com/wRpH5fU.jpeg" width="300"> 