let oof = 0;

// Unact Markup Generators
function createQuestion(questionNumber){
    const questionHTML = `
        <details class="question">
            <summary class="q-parent">
                <span>${questionNumber}.</span><input class="question-title" placeholder="Who is asking?" type="text" value="Who is speaking...?"><button class="close-btn" onclick="this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement);"><i class='material-icons'>close</i></button>
            </summary>
            <h3>
            <textarea class="question-title" placeholder="What is the question/dialogue? (Seperated by newlines)"></textarea></h3>
            <h3 style="font-weight:400">Actions:</h3>
            <details class="action-correct">
                <summary>
                    On Correct Answer
                </summary>
                <div class="answer-field">
                    <span>Change in Points:</span> <input placeholder="How much do the points change?" type="number" value="1">
                </div>
                <h3>
                <textarea class="question-title" placeholder="What are the subtitles? (Seperated by newlines)"></textarea></h3>
            </details>
            <details class="action-incorrect">
                <summary>
                   On Incorrect Answer
                </summary>
                <div class="answer-field">
                    <span>Change in Points:</span> <input placeholder="How much do the points change?" type="number" value="-1">
                </div>
                <h3>
                <textarea class="question-title" placeholder="What are the subtitles? (Seperated by newlines)"></textarea></h3>
            </details>
            <h3 style="font-weight:400">Choices:</h3>
            <div class="choices"></div><button onclick="createChoice(this)">+ New Answer</button>
            
            <hr>
        </details>`;
    Unact.fromString(questionHTML).render(document.getElementById("qContain"));
}

function createChoice(location) {
    oof++;
    Unact.fromString(`<details class="choice">
    <summary>
        New Choice
    </summary>
    <div class="answer-field">
        <span>Answer:</span> <input onchange="changeChoiceValue(this)" placeholder="What's the answer?" type="text" value="New Choice">
    </div>
    <div class="answer-field-check">
        <span>Correct:</span> <input type="checkbox">
    </div>
    <div class="action">
        <b>Next Action:</b> 
        <input name="next${oof }" type="radio" value="goto" checked="true"> 
        <label for="goto">Go To Question #<span class="qnumberxd" contenteditable="true">1</span></label> 
        <input name="next${oof}" type="radio" value="-2"> 
        <label for="-2">End Game</label>
        <input name="next${oof}" type="radio" value="-1"> 
        <label for="-1">Force Loss</label>
    </div>
</details>`).render(location.parentNode.querySelector(".choices"));
};


function changeChoiceValue(location){
    location.parentNode.parentNode.querySelector('summary').innerText = location.value.trim()
}

// JSON Template:
let finalJSON = {
    metadata: {
        name: "",
        author: "",
        startingPoints: 0,
        winningPoints: 0,
        endMessage: {
            win: {
                title: "",
                text: []
            },
            lose: {
                title: "",
                text: []
            }
        }
    },
    questions: [],
    stats: []
}

function parse(){
    // Metadata ADD starting pts winningpts
    finalJSON.metadata.name = document.querySelector("#gameTitleBox").value.trim() || "Untitled Adventure";
    finalJSON.metadata.author = document.querySelector("#authorBox").value.trim() || "Guest Teacher";
    finalJSON.metadata.endMessage.win.title = document.querySelector("#winTitleBox").value.trim() || "Congrats! You won!";
    finalJSON.metadata.endMessage.win.text = document.querySelector("#winSubBox").value.split("\n") || ["Play again to review."];
    finalJSON.metadata.endMessage.lose.title = document.querySelector("#loseTitleBox").value.trim() || "You lost.";
    finalJSON.metadata.endMessage.lose.text = document.querySelector("#loseSubBox").value.split("\n") || ["Better luck next time."];
    finalJSON.metadata.startingPoints = document.querySelector("#startPtBox").value.trim();
    finalJSON.metadata.winningPoints = document.querySelector("#winPtBox").value.trim();
    document.querySelectorAll(".question").forEach((questionObj, i) => {
        finalJSON.questions.push(parseQuestion(questionObj))
        if( document.querySelectorAll(".question").length - 1 == i){
          uploadMap(JSON.stringify(finalJSON))
        }
    });
 
}

function parseChoices(xdchoice){
    tmpChoices = [];
    xdchoice.querySelectorAll(".choice").forEach((choice, i)=>{
        let radioButtons = choice.querySelectorAll("input[type=radio]");
        let finaltest;
        for (var i = 0; i < radioButtons.length; i++) {
            if (radioButtons[i].checked){
                finaltest = radioButtons[i].value;
                break;
            } 
        }
        finaltmp = (finaltest == "goto") ? choice.querySelector(".qnumberxd").innerText : finaltest; 
        tmpChoices.push({
            text: choice.querySelector(".answer-field").querySelector("input").value.trim(),
            correct: choice.querySelector(".answer-field-check").querySelector("input").checked,
            next: finaltmp
        });
    });
    return tmpChoices;
}

function getRVBN(rName) {
    
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) return radioButtons[i].value;
    }
    return -1;
}

function parseQuestion(questionObject){
    return {
        title: questionObject.querySelector(".question-title").value.trim() || "New Question?",
        text: questionObject.querySelector("h3").querySelector("textarea").value.trim().split("\n") || ["Nice Text!"],
        answers: parseChoices(questionObject.querySelector(".choices")) || [{text: "Empty", correct: true, next: -1}],
        callbacks: {
            correct: {
                pointsChange: questionObject.querySelector(".action-correct").querySelector(".answer-field").querySelector("input").value || "Correct Answer!",
                text: questionObject.querySelector(".action-correct").querySelector("textarea").value.trim().split("\n") || ["Nice Text!"]
            },
            incorrect: {
                pointsChange: questionObject.querySelector(".action-correct").querySelector(".answer-field").querySelector("input").value || "Oops! That was incorrect.",
                text: questionObject.querySelector(".action-incorrect").querySelector("textarea").value.trim().split("\n") || ["Nice Text!"]
            }
        }
    }
}



//Upload Map
var socket = io("/editor")
function uploadMap(data){
  console.log(data)
  socket.emit("uploadMap", data)
}
socket.on("sendSuccess",function(code){

  swal.fire({
      title: "Map Uploaded",
      text: `Your game has been uploaded, the code is ${code}`
  }).then((result) => {
     location.href = "../player/index.html?game=" + code
    
 
  })


})