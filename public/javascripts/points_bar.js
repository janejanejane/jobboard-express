$('document').ready(function(){
	console.log("barchart...");
  if(typeof data != 'undefined'){
    console.log(data);
    console.log(total); 
    
    var div = d3.select(".chartContainer").append("div")
      .attr("class", "chart")
      .style("position", "relative")
      .attr("width", 300)
      .attr("height", 200);

    var barWidth = $('.row-fluid').width() * 0.20; 
    barWidth = $('.row-fluid').width() - barWidth; // less 20% for voters column

    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d){
          console.log(d);
          var round = Math.round((d.points/10) * 10);
          console.log("ROUND: " + round);
          return round; // round to nearest 10th
        })])
        // .range([0, 300]); // values will be divided within the 300 range
        .range([0, barWidth]);
        console.log("row-fluid width:", barWidth);

    // var y = d3.scale.ordinal()
    //   .domain(data.map(function (d){ return d.name;})) // create range from array of objects
    //   .rangeBands([0, 120]);

    var y = d3.scale.linear()
        .domain([0, data.length -1])
        .range([0, 200]);

    var bar = div.selectAll(".bar-container")
      .data(data)
    .enter().append("div")
      .attr("class", function(d){ 
        var name = d.name.replace(/\s/g, ""); // trim inner spaces
        name = name.toLowerCase(); // change to lower case
        return name + " bar-container";
      })
      .style("top", function(d,i){ return y(i)  + "px"})
      .style("position", "absolute")
      .style("height", "50px");

    
    bar.append("div")
      .attr("class", "label")
      .style("width", "100%")
      //.style("top", function(d,i){ return y(i) + "px"})
      .text(function(d,i){ 
        var jobpref = d.name.toUpperCase();
        if(d.preferred){
          jobpref += " (preferred)";
        }

        return jobpref; 
      });

    bar.append("div")
      .attr("class", "bar-color")
      .style("width", function(d,i){ 
        var width = x(d.points);
        console.log(width);
        return width + "px"; 
      })
      .text(function(d,i){ return d.points; });

    bar.append("div")
      .attr("class", "voters")
      .html(function(d,i){
        return d.voters;
      })
  }
});