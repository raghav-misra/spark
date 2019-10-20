// JS for main player

//Vars
var points = 0

//Audio for dia
var blip = new Howl({
    src: ['../assets/blip.wav'],
    loop:true
  });
  var btnSfx = new Howl({
    src: ['../assets/button.wav'],
    loop:false
  });






//Elements
  var title = document.getElementById('title')
  var message = document.getElementById('message')
  var choicesDiv = document.getElementById('choices')


//Build game on load
  document.body.onload = buildGame

  function buildGame(){
  
  
     urlData = querystring.parse();
     if(urlData.game == undefined || urlData.game == null){

        Swal.fire({
            title:  'Could not play game!',
            text:  'Please check your code/link',
            type: 'error',
            input: 'text',
            inputPlaceholder: 'Code',
            confirmButtonText:"Submit"
           
          }).then((result) => {
           location.href= "index.html?game=" + result.value
            
         
          })
             
    
    }else{
    socket.emit('requestGame',urlData.game)
    }
  
    
  }
  //Request server for game data
  socket.on("getMap", function(data){
    startGame(data);
 })

  



//Show first question init
function startGame(data){
    mapData = data
    currentObj = mapData.questions[0]
    currentObj.text.unshift(" ")
    document.getElementById('title').innerText = currentObj.title
    document.getElementById('mapName').innerText = mapData.metadata.name
    document.getElementById('mapAuthor').innerText = mapData.metadata.author
    document.getElementById('points').innerText = mapData.metadata.startingPoints
    points = mapData.metadata.startingPoints
    speak(currentObj.title,currentObj.text,true)

}


function showChoices(){
    currentObj.answers.forEach(function(choice,i){
            var btn = document.createElement("button")
            btn.innerText = choice.text
            btn.addEventListener("click", function(){
                btnSfx.play()
                nextRound(choice.next,choice.correct)
                
            })
            document.getElementById('choices').appendChild(btn)
    })
}
function nextRound(choice,correctOrNot){
    while(document.getElementById('choices').firstChild){
        document.getElementById('choices').removeChild(document.getElementById('choices').firstChild)
    }
    
    console.log(choice)
    //Check if incorrect
    if(choice == -1){//Instant quit
        
        currentObj = mapData.metadata.endMessage.lose
       speak(currentObj.title,currentObj.text,false,false,false,false,true)
       
    }
    else if(choice == -2){//End of quiz
        //Start Callback 
        if(points >= mapData.metadata.winningPoints){//win
            currentObj = mapData.metadata.endMessage.win
            speak(currentObj.title,currentObj.text,false,false,false,false,true)
          
            
        }if(points < mapData.metadata.winningPoints ){ //lose
            currentObj = mapData.metadata.endMessage.lose
            speak(currentObj.title,currentObj.text,false,false,false,false,true)
           
        }
      


    }else{
        //Start Callback 
        console.log(currentObj)
        console.log(correctOrNot)
        if(correctOrNot){
            speak(currentObj.title,currentObj.callbacks.correct.text,false,true,"correct",choice)
        }else{
            speak(currentObj.title,currentObj.callbacks.incorrect.text,false,true,"incorrect",choice)

        }
        

    }
   
    
   

    
    

}
function endGame(){

    Swal.fire({
        title:  'Good job!',
        text:  'Your assignment is complete!',
        type: 'success',
        input: 'text',
        inputPlaceholder: 'Your Name',
        confirmButtonText:"Submit"
       
      }).then((result) => {
          var resultSend =  {
            name: result.value,
            score: points
            }
            
          socket.emit("sendResults", urlData.game, resultSend)
        
     
      })
   
}


function speak(title,_text,show = false,callback = false,correctOrNot,choice,endgame = false){
    document.getElementById('title').innerText = title
    _text.unshift(" ")
    let text = []
    _text.forEach(function(line){
        text.push(line.replaceAll("!pts",points))
    })
    var options = {
        strings:text,
       typeSpeed: 40,
       fadeOut: true,
       showCursor: false,
       fadeOutClass: 'typed-fade-out',
        fadeOutDelay: 500,
        onComplete: function(self) { 
            
            blip.stop() 
            if(show){
            showChoices()
            }
            if(callback){
              points = parseInt(points) + parseInt(currentObj.callbacks[correctOrNot].pointsChange)
              
              document.getElementById('points').innerText = points
              console.log(`CHOICE:${choice}`)
              currentObj = mapData.questions[choice]
              currentObj.text.unshift(" ")
             setTimeout(function(){
              speak(currentObj.title,currentObj.text,true)
             },1000)
            }
            if(endgame){
                endGame()
            }
            
            
            },
        onStringTyped: function(self) { blip.stop() },
        preStringTyped: function(self) { blip.play()},
      
   };
   var typed = new Typed('#message', options);
   
}


//Sucesss result uploaded!
socket.on("sendSuccess",function(){

    swal.fire({
        title: "Results Submitted",
        text: "Your results have been uploaded, your teacher can now see your results!"
    }).then((result) => {
       location.href = "../stats/index.html?game=" + urlData.game
      
   
    })


})
//Fail to get data
socket.on("sendFail",function(){

    Swal.fire({
        title:  'Could not play game!',
        text:  'Please check your code/link',
        type: 'error',
        input: 'text',
        inputPlaceholder: 'Code',
        confirmButtonText:"Submit"
       
      }).then((result) => {
       location.href= "index.html?game=" + result.value
        
     
      })

})