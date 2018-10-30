var request = require('request');
var fs = require('fs');
require('dotenv').config();
var repoOwner = process.argv[2];
var repoName = process.argv[3];

function getRepoContributors(repoOwner, repoName, handleRequest) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    qs: {
      "access_token": process.env.GITHUB_TOKEN
    },
    headers: {
      'User-Agent': 'request',
    }
  };
  request(options, function pullURL(err, result, callback){
    if (err || !repoOwner || !repoName){
      throw err;
    }
    var list = JSON.parse(result.body);
    list.forEach(function (contributor){
       downloadAvatar(contributor.avatar_url, contributor.id);
     });
  });
}


// getRepoContributors("jquery", "jquery", downloadAvatar);
getRepoContributors(repoOwner, repoName, downloadAvatar);

function downloadAvatar(url, filePath) {
  request.get(url)
         .on('error', function (err) {
           throw err;
         })
         .pipe(fs.createWriteStream('./avatars/' + filePath + ".jpg"));
         console.log("wrote a file");
       }
