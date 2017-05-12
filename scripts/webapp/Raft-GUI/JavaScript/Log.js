function Log(context, init_x, init_y){

  this.context = context;
  this.init_x = init_x;
  this.init_y = init_y;
  this.boxList = [];
  this.entryList = [];

  this.boxWidth = 55;
  this.boxHeight = 50;

  this.makeLog = function() {
    for(var i=0; i < 10; i++){
      this.boxList.push(new Box(this.boxWidth, this.boxHeight));
    }

    var x = this.init_x;
    var y = this.init_y;
    var increment = this.boxWidth;
    for(var i=0; i < 10; i++){
      this.boxList[i].draw(this.context,x,y);
      x += increment;
    }
  };

  this.addEntry = function(text) {
    if(this.entryList.length == 10){
      this.entryList.shift();
    }
    this.entryList.push(text);

    for(var i=0; i < this.entryList.length; i++) {
      var x = (this.init_x + 5) + (this.boxWidth * i);
      var y = this.init_y + 30;
      this.boxList[i].updateText(this.context,this.entryList[i],x,y);
    }
  };

}
