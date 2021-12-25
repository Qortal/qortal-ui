#!/bin/sh

set -x

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_version_push() {
  # Add New Remote
  git remote add ci https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git > /dev/null 2>&1
  # Show Remotes
  git remote -v
  # Create Version variable
  newVersion=$(git describe --abbrev=0)
  # Checkout and Switch to master branch
  # git checkout master
  # Disable yarn version-git-tag
  yarn config set version-git-tag false
  # Update package.json version
  yarn version --new-version $newVersion
  # Stage file for commit
  git add package.json
  # Create a new commit with a build version
  git commit --message "Build Version: $newVersion"
  # PUSH TO GITHUB
  git push ci master
}

setup_git

commit_version_push


# # Attempt to commit to git only if "git commit" succeeded
# if [ $? -eq 0 ]; then
#   echo "Commit the new version. Built and Pushing to GitHub"
#   push_build
# else
#   echo "Cannot commit new version"
# fi
