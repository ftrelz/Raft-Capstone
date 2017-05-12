function Hostname(context, name){
  this.context = context;
  this.hostname = name;

  this.draw = function(x,y){
    this.context.font = "25px Arial";
    this.context.fillText(this.hostname,x,y);
  };
}

function State(context, state){
  this.context = context;
  this.state = state

  this.draw = function(x,y){
    this.context.font = "23px Arial";
    this.context.fillText(this.state,x,y);
  };
}

function Status(context, status){
  this.context = context;
  this.status = status;

  this.draw = function(x,y){
    context.beginPath()
    this.context.rect(x-4,y-25,40,40);
    this.context.lineWidth = 2;
    this.context.strokeStyle = "black";
    this.context.stroke();

    this.context.font = "23px Arial";
    this.context.fillText(this.status,x,y);

  }
}


function Controls(context, width, height){
  this.context = context;
  this.boxWidth = width;
  this.boxHeight = height;

  this.draw = function(x,y){
    var middle_x = x;
    var middle_y = x;
  };
}

function Arrows(context){
  this.context = context;

  this.drawUpArrow = function(x,y){
    //increments by 25
    this.context.beginPath();
    this.context.moveTo(x + 25,y + 0);
    this.context.lineTo(x + 0,y + 25);
    this.context.lineTo(x + 50,y + 25);
    this.context.fill();

    var body = new Box(22,35);
    body.drawWithColor(this.context,x + 14,y + 22);
  };

  this.drawRightArrow = function(x,y){
    this.context.beginPath();
    this.context.moveTo(x + 75,y + 25);
    this.context.lineTo(x + 50,y + 0);
    this.context.lineTo(x + 50,y + 50);
    this.context.fill();

    var body = new Box(35,21);
    body.drawWithColor(this.context,x + 16, y + 14);
  };

  this.drawDownArrow = function(x,y){
    this.context.beginPath();
    this.context.moveTo(x + 25,y + 50);
    this.context.lineTo(x + 0,y + 25);
    this.context.lineTo(x + 50,y + 25);
    this.context.fill();

    var body = new Box(22,35);
    body.drawWithColor(this.context,x + 14, y - 7);
  };

  this.drawLeftArrow = function(x,y){
    this.context.beginPath();
    this.context.moveTo(x + 0,y + 25);
    this.context.lineTo(x + 25,y + 0);
    this.context.lineTo(x + 25,y + 50);
    this.context.fill();

    var body = new Box(35,21);
    body.drawWithColor(this.context,x + 24, y + 14);
  }
}
