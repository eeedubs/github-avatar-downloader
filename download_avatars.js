var request = require('request'); // obtains the "request" node package
var fs = require('fs');           // allows access to the film system commands
require('dotenv').config();       // configures dotenv
var repoOwner = process.argv[2];  // parses the third word from the command line (repoOwner)
var repoName = process.argv[3];   // parses the fourth word from the command line (repoName)

function getRepoContributors(repoOwner, repoName, handleRequest) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    qs: {
      "access_token": process.env.GITHUB_TOKEN
    },
    headers: {
      'User-Agent': 'request',
    }
  }; // provides the access information for obtaining the contributor data
  request(options, function pullURL(err, result, callback){ // same as request(options) and request (function pullURL...)
    if (err || !repoOwner || !repoName){
      throw err; // if no repoOwner, repoName, or in case of error, throw back an error message
    }
    var list = JSON.parse(result.body); // converts the text (from object) into var list
    list.forEach(function (contributor){  // for each contributor from the list
       downloadAvatar(contributor.avatar_url, contributor.id); // download the avatar to the specified location
     });
  });
}

getRepoContributors(repoOwner, repoName, downloadAvatar);

function downloadAvatar(url, filePath) {
  request.get(url)
         .on('error', function (err) {
           throw err;
         })
         .pipe(fs.createWriteStream('./avatars/' + filePath + ".jpg"));
       }
