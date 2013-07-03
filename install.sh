#! /bin/sh

# install npm
# install brew



npm update && npm install grunt grunt-cli phantomjs
npm install mocha-phantomjs grunt-mocha grunt-mocha-cov grunt-mocha-phantomjs grunt-jslint grunt-jsmin-sourcemap grunt-contrib-watch --save-dev


brew update && brew install phantomjs