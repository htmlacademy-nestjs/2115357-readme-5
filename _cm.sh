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

##nx g library libraries/shared --dry-run
##nx generate @nx/node:library shared

##nx g @nx/nest:service auth

#nx run-many --target=serve --all --maxParallel=10
#nx run-many --target=serve --all --maxParallel=10 --configuration=production

#nx run-many --target=build --prod --all

