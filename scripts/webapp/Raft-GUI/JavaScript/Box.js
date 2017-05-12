function Box(width, height){
  this.width = width;
  this.height = height;

  this.getWidth = function() {
    return this.width;
  };

  this.getHeight = function() {
    return this.height;
  };

  this.draw = function(context,x,y) {
    context.beginPath()
    context.rect(x,y,this.width,this.height);
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();
  };

  this.updateText = function(context,text,x,y) {
    context.font = "15px Arial";
    context.fillText(text,x,y);
  }

  this.drawWithColor = function(context,x,y) {
    context.beginPath()
    context.fillRect(x,y,this.width,this.height);
    context.stroke();
  };
}
