document.addEventListener("DOMContentLoaded", function(){

    const Searchbtn = document.getElementById("Userbtn");
    const Inputfild = document.getElementById("user-input");
    const StateContainer = document.getElementsByClassName("stats-container");
    const esayProgress = document.querySelector(".easy-progress");
    const mediumProgress = document.querySelector(".medium-progress");
    const hardProgress = document.querySelector(".hard-progress");
    const easyLable = document.getElementById("easy-lable");
    const mediumLable = document.getElementById("medium-lable");
    const hardLable = document.getElementById("hard-lable");
    const cardstateContainer = document.querySelector(".stats-cards");


    // return true or false based on a regex

    function vaildUsername(username){
        if(username.trim===""){
            alert('Please fill username name first');
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert('Invalid username')
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {

        try{
            Searchbtn.textContent = "Searching...";
            Searchbtn.disabled = true;
            //statsContainer.classList.add("hidden");

            // const response = await fetch(url);
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/' 
            const targetUrl = 'https://leetcode.com/graphql/';
            
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            const response = await fetch(proxyUrl+targetUrl, requestOptions);
            if(!response.ok) {
                throw new Error("Unable to fetch the User details");
            }
            const parsedata = await response.json();
            console.log("Logging data: ",parsedata) ;

            UserDisplayData(parsedata);
        }
        catch(error) {
            StateContainer.innerHTML = `<p>No data Found</p>`
        }
        finally {
            Searchbtn.textContent = "Search";
            Searchbtn.disabled = false;
        }
    }

    function updateProgress(solved,total,label,circle){
      const progressDegree = (solved/total)*100;
      circle.style.setProperty("--progress-degree",`${progressDegree}%`);
      label.textContent = `${solved}/${total}`;
    }

    function UserDisplayData(parsedata) {
        const AllQues = parsedata.data.allQuestionsCount[0].count;
        const AllEasyQues = parsedata.data.allQuestionsCount[1].count;
        const AllMediumQues = parsedata.data.allQuestionsCount[2].count;
        const AllHardQues = parsedata.data.allQuestionsCount[3].count;


        const SolvedTotalQues = parsedata.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const SolvedEasyTotalQues = parsedata.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const SolvedMediumTotalQues = parsedata.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const SolvedHardTotalQues = parsedata.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(SolvedEasyTotalQues,AllEasyQues,easyLable,esayProgress);
        updateProgress(SolvedMediumTotalQues,AllMediumQues,mediumLable,mediumProgress);
        updateProgress(SolvedHardTotalQues,AllHardQues,hardLable,hardProgress);


       const cardData = [
        {label: "Total Submissions", value:parsedata.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
        {label: "Total Easy Submissions", value:parsedata.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
        {label: "Total Medium Submissions", value:parsedata.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
        {label: "Total Hard Submissions", value:parsedata.data.matchedUser.submitStats.totalSubmissionNum[3].submissions},
       ];

       console.log("card ka data", cardData);
    }

    Searchbtn.addEventListener('click', function(){
        const username=Inputfild.value;
        console.log("Your username :",username);
        if(vaildUsername(username)){
            fetchUserDetails();
        }
    })
})