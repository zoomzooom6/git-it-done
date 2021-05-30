var userFormE1 = document.querySelector("#user-form");
var nameInputE1 = document.querySelector("#username");
var repoContainerE1 = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function (event) {
    event.preventDefault();

    //get value from input element
    var username = nameInputE1.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputE1.value = "";
    } else {
        alert("Please enter a valid GitHub username");
    }
};

var getUserRepos = function (user) {
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    fetch(apiUrl)
        .then(function (response) {
            //if request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    displayRepos(data, user);
                });
            } else {
                alert("Error: GitHub User Not Found");
            }
        })
        .catch(function(error) {
            //.catch() is chained to end of .then()
            alert("Unable to connect to GitHub");
        });
};

var displayRepos = function (repos, searchTerm) {
    console.log(repos);
    console.log(searchTerm);

    //check if api returned any repos
    if (repos.length === 0) {
        repoContainerE1.textContent = "No Repositories found.";
        return;
    }

    //clear old content
    repoContainerE1.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    //loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        var repoE1 = document.createElement("a");
        repoE1.classList = "list-item flex-row justify-space-between align-center";
        repoE1.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //create a span element to hold repo name
        var titleE1 = document.createElement("span");
        titleE1.textContent = repoName;

        //append to container 
        repoE1.appendChild(titleE1);

        //create a status element
        var statusE1 = document.createElement("span");
        statusE1.classList = "flex-row align-center";

        //check whether current repo has issues
        if (repos[i].open_issues_count > 0) {
            statusE1.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusE1.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container
        repoE1.appendChild(statusE1);

        //append container to DOM
        repoContainerE1.appendChild(repoE1);
    }
}

userFormE1.addEventListener("submit", formSubmitHandler);