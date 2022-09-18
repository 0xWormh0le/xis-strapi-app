#!/bin/bash

export REACT_APP_API_HOST=https://$HOST
export REACT_APP_BUGSNAG_API_KEY=123
export REACT_APP_UNREGISTER_SERVICE_WORKER=true

echo $REACT_APP_API_HOST

git clone git@bitbucket.org:sovtech/sxi-frontend.git
cd sxi-frontend
git checkout develop
yarn
yarn generate
yarn build
cd build
cp -a * ../../public/
cd ../../public
cp index.html production.html
rm -rf ../sxi-frontend