let request = require('request');
// obtains the "request" node package
let async = require('async');
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
    let followersArray = []; 
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
      list.forEach(function(contributor, index){
        cb(contributor.url, followersArray, list, index)
      })
    }
  }
  request(options, pullURL);
}

function getJson(url, array, list, index){
  options = {
    url,
    qs: {
        "access_token": ENV.GITHUB_TOKEN
    },
    headers: {
       'User-Agent': 'request'
    }
  }
  request.get(options, function (error, response, body){
    if (!error && response.statusCode == 200){
      let info = JSON.parse(body);
      array.push(info);
      if (list.length - 1 == index){
        array.sort(function(a, b){
          let keyA = new Number(a.followers)
          let keyB = new Number(b.followers)
          if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0
        })
        let newArray = [];
        array.forEach(function(item){
          newArray.push(`[ ${item.followers} followers ] ${item.login} / ${item.location}`);
        })
        for (let x = 0; x < 5; x++){
          console.log(newArray[x]);
        }
      }
    } else {
      throw error;
    }
  });
}

getRepoContributors(repoOwner, repoName, getJson);