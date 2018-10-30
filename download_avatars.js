var request = require('request');
require('dotenv').config();

console.log('Welcome to the GitHub Avatar Downloader!');

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
// loads the list of contributors via HTTPS for the given repo

  request(options, handleRequest);
}

getRepoContributors("jquery", "jquery", function(err, result) {
  if (err){
    throw err;
  }
  var contributors = JSON.parse(result.body);
  // body is the information that I requested
  // JASON.parse converts a JSON string into javascript
  contributors.forEach(function (contributor){
    console.log(contributor.avatar_url);
  })
  // console.log("Errors:", err);
  // console.log("Result:", contributors);
});