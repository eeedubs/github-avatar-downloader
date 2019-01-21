# GitHub Avatar Downloader

## Problem Statement

Given a GitHub repository name and owner, download all the contributors' profile images and save them to a subdirectory, `avatars/`.

## Expected Usage

This program should be executed from the command line, in the following manner:

`node download_avatars.js <repoOwner> <repoName>`
eg...
`node download_avatars.js jquery jquery`

# ADDITIONAL: Github Followers Lister

Given a GitHub repository name and owner, the top 5 most followed users who are contributors to the repository are listed.

## Expected Usage

This program should be executed from the command line, in the following manner: 

`node list_followers.js <repoOwner> <repoName>`
e.g...
`node list_followers.js jquery jquery`