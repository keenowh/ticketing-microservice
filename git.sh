#!/bin/bash

git add .
git commit -m "$1"
git checkout main

git merge progress
git push
git checkout progress