var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var drone_list = [];
var droneImage = new Image();
droneImage.src = "Images/drone.png";

var drone_x = 650;
var drone_y = 180;
var drone_width = 220;
var drone_height = 150;

var missed_x = 0;
var missed_y = 0;
var missed_width = 0;
var missed_height = 0;

// Logs for each Pi
var log1_commands = [];
var log2_commands = [];
var log3_commands = [];
var log4_commands = [];
var log5_commands = [];

var drone_logs = []
for(var i = 0; i < 5; i++){
  drone_logs.push([]);
}

var state_list = ["Leader","Follower","Follower","Follower","Follower"];
var status_list = ["On","On","On"];

document.onkeydown = checkKey;

function checkKey(e) {

  var direction_input;
  e = e || window.event;

  // Need to change for Leader
  if(log1_commands.length == 10){
    log1_commands.shift();
  }

  if(e.keyCode == '38'){
    direction_input = 'up';
    //var temp = drone_y - 20;
    //if(temp > 40){
      //drone_width -= 5;
      //drone_height -= 5;
      //drone_y -= 20;
    //}
  }
  else if (e.keyCode == '40') {
    direction_input = 'down';
    //var temp = drone_y + 20;
    //if(temp < 320){
      //drone_width += 5;
      //drone_height += 5;
      //drone_y += 20;
    //}
  }
  else if (e.keyCode == '37') {
    direction_input = 'left';
    //var temp = drone_x - 20;
    //if(temp > 0){
      //drone_x -= 20;
    //}
  }
  else if (e.keyCode == '39') {
    direction_input = 'right';
    //var temp = drone_x + 20;
    //if(temp < 1300){
      //drone_x += 20;
    //}
  }
   
  /*$.post({url:"/cgi-bin/raft_gui_input.cgi",
            data:{direction: direction_input},
            dataType:"text"}).done(function(data,status,xml){
            console.log(data);
            console.log(status);
            console.log(xml);}).fail(function(xml,status,error){
            console.log(xml);
            console.log(status);
            console.log(error);});
 */
  $.ajax({
    type: "GET",
    url: "/cgi-bin/raft_gui_input.cgi",
    data: {direction: direction_input},
    success: function(data,status,xhr){console.log("Success"); 
                                       console.log(data+"\n"+status+"\n"+xhr);
                                       //var obj = JSON.parse(data);
                                       //console.log(obj);
                                       jsonObj = data.split('\n');
                                       console.log(jsonObj);
                                       var log1 = JSON.parse(jsonObj[0]);
                                       var log2 = JSON.parse(jsonObj[1]);
                                       var log3 = JSON.parse(jsonObj[2]);
                                       
                                       var log1_length = Object.keys(log1).length;
                                       var log2_length = Object.keys(log2).length;
                                       var log3_length = Object.keys(log3).length;

                                       var high = log2_length;
                                       if(log1_length > log2_length){
                                         high = log1_length;
                                       }
 
                                       if(log3_length > log1_length){
                                         high = log3_length;
                                       }
                                       
                                       console.log(log1_length);
                                       console.log(log2_length);
                                       console.log(log3_length); 
                                       var log1_shift = high - log1_length;
                                       var log2_shift = high - log2_length;
                                       var log3_shift = high - log3_length;
                                       
                                       var failure = 0;
                                       if(log1_shift > 0){
                                         failure += 1;
                                       }

                                       if(log2_shift > 0){
                                         failure += 1;
                                       }
 
                                       if(log3_shift > 0){
                                         failure += 1;
                                       } 
                                      
                                       log1_commands = [];
                                       for(var i = 0; i < Object.keys(log1).length - 1; i++){
                                         log1_commands.push(log1[i]["data"]);
                                       }
				       while(log1_commands.length > 10){
                                         log1_commands.shift();
                                       }
                                       for(var i = 0; i < log1_shift; i++){
                                         log1_commands.shift();
                                       }

                                       if(log1_shift > 0){
                                         status_list[0] = "Off";
                                       }
                                       else{
                                         status_list[0] = "On";
                                       } 

                                       log2_commands = [];
                                       for(var i = 0; i < Object.keys(log2).length - 1; i++){
                                         console.log(log2[i]["data"]);
                                         log2_commands.push(log2[i]["data"]);
                                       }
                                       while(log2_commands.length > 10){
                                         log2_commands.shift();
                                       }
                                       for(var i = 0; i < log2_shift; i++){
                                         status_list[1] = "Off";
                                         log2_commands.shift();
                                       }

                                       if(log2_shift > 0){
                                         status_list[1] = "Off";
                                       }
                                       else{
                                         status_list[1] = "On";
                                       } 


                                       log3_commands = [];
                                       for(var i = 0; i < Object.keys(log3).length - 1; i++){
                                         log3_commands.push(log3[i]["data"]);
                                       }
                                       while(log3_commands.length > 10){
                                         log3_commands.shift();
                                       }

                                       for(var i = 0; i < log3_shift; i++){
                                         log3_commands.shift();
                                       }

                                       if(log3_shift > 0){
                                         status_list[2] = "Off";
                                       }
                                       else{
                                         status_list[2] = "On";
                                       }

                                       if(failure >= 2){
                                         if(direction_input == 'up'){
                                           var temp = drone_y - 20;
                                           if(temp > 40){
                                             missed_y -= 20
                                             missed_width -= 5;
                                             missed_height -= 5;
                                           }
                                         }
                                         else if(direction_input == 'down'){
                                           var temp = drone_y + 20;
                                           if(temp < 320){
                                             missed_y += 20;
                                             missed_width += 5;
                                             missed_height += 5;
                                           }
                                         }
                                         else if(direction_input == 'left'){
                                           var temp = drone_x - 20;
                                           if(temp > 0){
                                             missed_x -= 20;
                                           }
                                         }
                                         else if(direction_input == 'right'){
                                           var temp = drone_x + 20;
                                           if(temp < 1300){
                                             missed_x += 20;
                                           }
                                         }
                                       }
                                       else{
                                         if(direction_input == 'up'){
                                           var temp = drone_y - 20;
                                           if(temp > 40){
                                             drone_y -= 20
                                             drone_width -= 5;
                                             drone_height -= 5;
                                           }
                                         }
                                         else if(direction_input == 'down'){
                                           var temp = drone_y + 20;
                                           if(temp < 320){
                                             drone_y += 20;
                                             drone_width += 5;
                                             drone_height += 5;
                                           }
                                         }
                                         else if(direction_input == 'left'){
                                           var temp = drone_x - 20;
                                           if(temp > 0){
                                             drone_x -= 20;
                                           }
                                         }
                                         else if(direction_input == 'right'){
                                           var temp = drone_x + 20;
                                           if(temp < 1300){
                                             drone_x += 20;
                                           }
                                         }
                                         drone_x += missed_x;
                                         drone_y += missed_y;
                                         drone_height += missed_height;
                                         drone_width += missed_width;

                                         missed_x = 0;
                                         missed_y = 0;
                                         missed_height = 0;
                                         missed_width = 0;

                                       }

                                       console.log(log2_commands);
                                       
                                       },
    error: function(xhr,status,error){console.log("Error");},
    dataType: "text"
  });
}

$('#myCanvas').click(function (e) {

    var direction_input;

    var clickedX = e.pageX - this.offsetLeft;
    var clickedY = e.pageY - this.offsetTop;

    console.log(clickedX);
    console.log(clickedY);

    if((clickedY >= 600 && clickedY <= 665) && (clickedX >= 1245 && clickedX <= 1286)){
      direction_input = 'up';
      drone_width -= 5;
      drone_height -= 5;
      drone_y -= 20;
    }
    else if((clickedY >= 690 && clickedY <= 765) && (clickedX >= 1245 && clickedX <= 1286)){
      direction_input = 'down';
      drone_width += 5;
      drone_height += 5;
      drone_y += 20;
    }
    else if((clickedY >= 655 && clickedY <= 695) && (clickedX >= 1170 && clickedX <= 1245)){
      direction_input = 'left';
      drone_x -= 20;
    }
    else if((clickedY >= 655 && clickedY <= 695) && (clickedX >= 1295 && clickedX <= 1355)){
      direction_input = 'right';
      drone_x += 20;
    }

  $.ajax({
    type: "GET",
    url: "/cgi-bin/raft_gui_input.cgi",
    data: {direction: direction_input},
    success: function(data,status,xhr){console.log("Success");
                                       console.log(data+"\n"+status+"\n"+xhr);
                                       //var obj = JSON.parse(data);
                                       //console.log(obj);
                                       jsonObj = data.split('\n');
                                       var log1 = JSON.parse(jsonObj[0]);
                                       var log2 = JSON.parse(jsonObj[1]);
                                       var log3 = JSON.parse(jsonObj[2]);
                                       //log1_commands

                                       var log1_length = Object.keys(log1).length;
                                       var log2_length = Object.keys(log2).length;
                                       var log3_length = Object.keys(log3).length;

                                       var high = log2_length;
                                       if(log1_length > log2_length){
                                         high = log1_length;
                                       }

                                       if(log3_length > log1_length){
                                         high = log3_length;
                                       }

                                       console.log(log1_length);
                                       console.log(log2_length);
                                       console.log(log3_length);
                                       var log1_shift = high - log1_length;
                                       var log2_shift = high - log2_length;
                                       var log3_shift = high - log3_length;
                                       log1_commands = [];
                                       for(var i = 0; i < Object.keys(log1).length - 1; i++){
                                         log1_commands.push(log1[i]["data"]);
                                       }
                                       while(log1_commands.length > 10){
                                         log1_commands.shift();
                                       }
                                       for(var i = 0; i < log1_shift; i++){
                                         log1_commands.shift();
                                       }

                                       if(log1_shift > 0){
                                         status_list[0] = "Off";
                                       }
                                       else{
                                         status_list[0] = "On";
                                       }

                                       log2_commands = [];
                                       console.log(log2[1]["data"]);
                                       for(var i = 0; i < Object.keys(log2).length - 1; i++){
                                         console.log(log2[i]["data"]);
                                         log2_commands.push(log2[i]["data"]);
                                       }
                                       while(log2_commands.length > 10){
                                         log2_commands.shift();
                                       }
                                       for(var i = 0; i < log2_shift; i++){
                                         status_list[1] = "Off";
                                         log2_commands.shift();
                                       }

                                       if(log2_shift > 0){
                                         status_list[1] = "Off";
                                       }
                                       else{
                                         status_list[1] = "On";
                                       }


                                       log3_commands = [];
                                       for(var i = 0; i < Object.keys(log3).length - 1; i++){
                                         log3_commands.push(log3[i]["data"]);
                                       }
                                       while(log3_commands.length > 10){
                                         log3_commands.shift();
                                       }

                                       for(var i = 0; i < log3_shift; i++){
                                         log3_commands.shift();
                                       }

                                       if(log3_shift > 0){
                                         status_list[2] = "Off";
                                       }
                                       else{
                                         status_list[2] = "On";
                                       }


                                       console.log(log2_commands);

                                       },
    error: function(xhr,status,error){console.log("Error");},
    dataType: "text"
  });

});

// Set both background images
var controlImage = new Image();
controlImage.src = "Images/controlBackground.jpg";

var grassBackground = new Image();
grassBackground.src = "Images/grasslands.png";

function draw(){
  context.clearRect(0,0,1500,800);

  context.drawImage(controlImage,0,480,1600,400);
  context.drawImage(grassBackground,0,0,1600,480);

  context.font = "15px Arial";
  var log1 = new Log(context,520,500);
  log1.makeLog();
  for(var i = 0; i < log1_commands.length; i++){
    log1.addEntry(log1_commands[i]);
  }

  var log2 = new Log(context,520,560);
  log2.makeLog();
  for(var i = 0; i < log2_commands.length; i++){
    log2.addEntry(log2_commands[i]);
  }

  var log3 = new Log(context,520,620);
  log3.makeLog();
  for(var i = 0; i < log3_commands.length; i++){
    log3.addEntry(log3_commands[i]);
  }

  //var log4 = new Log(context,520,680);
  //log4.makeLog();

  //var log5 = new Log(context,520,740);
  //log5.makeLog();

  var hostname1 = new Hostname(context, "H1");
  hostname1.draw(470,532);

  var hostname2 = new Hostname(context, "H2");
  hostname2.draw(470,592);

  var hostname3 = new Hostname(context, "H3");
  hostname3.draw(470,652);

  //var hostname4 = new Hostname(context, "H4");
  //hostname4.draw(470,712);

  //var hostname5 = new Hostname(context, "H5");
  //hostname5.draw(470,772);

  var state_x = 340;
  var state_y = 530;

  for(var i = 0; i < 3; i++){
    var state = new State(context, state_list[i]);
    state.draw(state_x, state_y);
    state_y += 60;
  }

  var status_x = 250;
  var status_y = 530;

  for(var i = 0; i < 3; i++){
    var state = new Status(context, status_list[i]);
    state.draw(status_x, status_y);
    status_y += 60;
  }

  //context.drawImage(droneImage,drone_x,drone_y,drone_width,drone_height);
  makeSwarm(drone_x,drone_y);

  context.font = "30px Arial";

  context.fillText("Use Arrow Keys to",1135,520);
  context.fillText("Control Drone",1165,560);

  var arrow = new Arrows(context);
  arrow.drawUpArrow(1240,600);
  arrow.drawRightArrow(1280,650);
  arrow.drawDownArrow(1240,705);
  arrow.drawLeftArrow(1175,650);
}

// Will check the Apache DB for any updates for logs
function makeSwarm(x,y){
    if(status_list[0] == "On"){
      context.drawImage(droneImage,x+50,y-40,drone_width-20,drone_height-10);
    }

    if(status_list[1] == "On"){
      context.drawImage(droneImage,x-20,y,drone_width,drone_height);
    }

    if(status_list[2] == "On"){
      context.drawImage(droneImage,x+100,y,drone_width,drone_height);
    }
}

draw();

setInterval(draw, 50);
