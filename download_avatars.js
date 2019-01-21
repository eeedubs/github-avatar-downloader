let request = require('request');
// obtains the "request" node package
let fs = require('fs');
// allows access to the film system commands
let ENV;

// Handles error with missing env.js file
try {
  ENV = require('./env.js');
} catch(error){
  console.log("Failure");
}

// Handles error with missing github token
if (ENV.GITHUB_TOKEN){
  console.log("Github token successfully parsed from env.js");
} else {
  console.log("No github token found");
}

let repoOwner = process.argv[2];
// parses the third word from the command line (repoOwner)
let repoName = process.argv[3];
// parses the fourth word from the command line (repoName)

function getRepoContributors(repositoryOwner, repositoryName, cb) {
  let options = {
    // gets the url, the access tokens, and the headers
    url: "https://api.github.com/repos/" + repositoryOwner + "/" + repositoryName + "/contributors",
    qs: {
      "access_token": ENV.GITHUB_TOKEN
    },
    headers: {
      'User-Agent': 'request',
    }
  }

  function pullURL(error, response){
    if (response.statusCode !== 200){
      console.log(`Bad request error ${response.statusCode}: The provided owner/repo does not exist.`);
    } else if (error){
      throw "Error: There was an issue with the information provided."; 
    } else if (!repoOwner || !repoName){
      // handles error: inadequate number of arguments
      throw "Error: Missing the name of either the repository owner, the repository name, or both."
    } else if (process.argv.length > 4){
      // handles error: excessive number of arguments
      throw "Error: Cannot process the additional parameters."
    } else {
      let list = JSON.parse(response.body);
      let starredArray = [];
      list.forEach(function (contributor){
        // for each contributor from the list
        cb(contributor.avatar_url, contributor.id);
        // download the avatar to the specified location
      });
      console.log(starredArray);
    }
  }

  // Actives the pullURL function
  request(options, pullURL);
}

function downloadAvatar(url, filePath) {
  // download the Avatar from the 'url' to the 'filePath'
  request.get(url)
  // gets the url from "contributor.avatar_url" 
    .on('error', function (error) {
      // Handles error with invalid url
      throw "There was an error getting the url: " + error;
    })
    .pipe(fs.createWriteStream('./avatars/' + filePath + ".jpg"))
    // save the file to the location
    .on("finish", function(response){
      // Log the successful write to the console
      console.log("Printed to: ./avatars/" + filePath + ".jpg");
    })
    .on("error", function(error){
      //  Handles the error with a missing folder to store images
      console.log("Problem writing file to local disk: ", error);
    });
}

getRepoContributors(repoOwner, repoName, downloadAvatar);