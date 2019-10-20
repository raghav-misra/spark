//Stats loader
document.body.onload = requestStats





function requestStats(){
  
  
    urlData = querystring.parse();
    if(urlData.game == undefined || urlData.game == null){

       Swal.fire({
           title:  'Could not get stats!',
           text:  'Please check your code/link',
           type: 'error',
           input: 'text',
           inputPlaceholder: 'Code',
           confirmButtonText:"Submit"
          
         }).then((result) => {
          location.href= "index.html?game=" + result.value
           
        
         })
            
   
   }else{
   socket.emit('requestStats',urlData.game)
   }
 
   
 }


 //Get stats fail
 socket.on('sendFail',function(){
     
    Swal.fire({
        title:  'Could not get stats!',
        text:  'Please check your code/link',
        type: 'error',
        input: 'text',
        inputPlaceholder: 'Code',
        confirmButtonText:"Submit"
       
      }).then((result) => {
       location.href= "index.html?game=" + result.value
        
     
      })
         

 })

 //get stats success
 socket.on('getStats',function(stats){
     document.getElementById('mapName').innerText = urlData.game
     var data = {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: "Score",
            backgroundColor: "#f52727",
            data: []
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Scores for '+ urlData.game
        }
      }
  }
     stats.forEach(function(stat){
        var statE = document.createElement("li")
        statE.classList.add("list-group-item")
        statE.innerText = `${stat.name} - ${stat.score}`
        data.data.labels.push(stat.name)
        data.data.datasets[0].data.push(stat.score)
        document.getElementById('list').appendChild(statE)
     })




     //Render stats chart
     var ctx = document.getElementById('chart')
 
		
		  

     var myChart = new Chart(ctx,data)
      document.getElementById('spinner').style.display = "none"
     
      
      

 })
