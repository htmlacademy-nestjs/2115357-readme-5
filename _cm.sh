#!/bin/sh
PATH=/usr/sbin:/sbin:/usr/bin:/bin
export PATH="$PATH:"/usr/local/bin/
    git status
    read -p "branch/" BRANCH;
    if [ ! -z "$BRANCH" ];
    then
        git add .
        git commit --amend --no-edit
        git push origin $BRANCH -f
    fi