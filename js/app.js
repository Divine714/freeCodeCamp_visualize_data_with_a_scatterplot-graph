fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then((info) => info.json())
  .then((data) => {
    console.log(data);

      const height = 500;
      const width = 500;
      const padding = 60;

      const formatTime = (time) => {
        return String(time).padStart(2, "0");
        };
      const svg = d3.select("body")
        .append("svg")
        .attr( "width", width)
        .attr( "height", height);

      const xScale = d3.scaleLinear()
        .domain([d3.min(data, (d) => parseInt(d.Year) - 1), d3.max(data, (d) => parseInt(d.Year) + 1)])
        .range([padding, width-padding]);

      const yScale = d3.scaleTime()
        .domain([d3.max(data, (d) => (d.Seconds)), d3.min(data, (d) => (d.Seconds))])
        .range([height-padding, padding]);


    const formatTimeAxis = (d) => {
      return String(Math.floor((d/60)).toFixed(0) + ":" + formatTime((d % 60)))
    }

    const formatYear = (d) => {
      return String(parseInt(d))
    }

    const addToolTip = d3.select("body").append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("background-color", "rgb(171, 190, 217)")
      .style("border-radius", "5px")
      .style("visibility", "hidden")

    let tooltipArray = [];

      svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => new Date(d.Seconds * 1000))
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale((d.Seconds)))
        .attr("r", 5)
        .attr("fill", d => d.Doping ? "red" : "blue")
        .on("mouseover", (e , d ) => {
          tooltipArray = [`Name: ${d.Name}`, `Country: ${d.Nationality}`, `Time: ${d.Time}, Year: ${d.Year}`, `Doping: ${d.Doping === "" ? "No Doping allegations" : d.Doping}`];
          addToolTip.style('visibility', 'visible')
            .style("opacity", 1)
            .style("position", 'absolute')
            .attr("data-year", d.Year)
            .style("top", `${e.clientY}px`)
            .style("left", `${e.clientX}px`)
            .selectAll("h1")
            .data(tooltipArray)
            .join("h1")
            .style("font-size", "10px")
            .text((text) => text)
            .style("visibility", "visible")
        })
        .on("mouseout", function () {
          addToolTip.style("visibility", "hidden")
            .style("opacity", 0)
          })

    const xAxis = d3.axisBottom(xScale).tickFormat(formatYear).ticks(10);
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(formatTimeAxis)
      .ticks(10)


    svg.append("g")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .attr("id", "x-axis")
      .call(xAxis);

    svg.append("g")
      .attr("transform", "translate(" + padding + ",0)")
      .attr("id", "y-axis")
      .call(yAxis)

    svg.append("g")
      .append("text")
      .text("Doping in Professional Bicycle Racing")
      .attr("x", (width + padding) / 4)
      .attr("y", padding / 2)
      .attr("font-weight", "bold")
      .attr("id", "title");

      svg.append("text")
        .attr("x", (width + padding) / 3.5)
        .attr("y", padding)
        .text("35 Fastest times up Alpe d'Huez");

      svg.append("rect")
        .attr("x", width - 100 )
        .attr("y", height - 400 )
        .attr("width", width / 6)
        .attr("height", height / 10)
        .attr("fill", "white")
        .attr("id", "legend")

    svg.append("rect")
        .attr("x", width - 95 )
        .attr("y", height - 395 )
        .attr("width", width / 30)
        .attr("height", height / 30)
        .attr("fill", "red")

    svg.append("rect")
      .attr("x", width - 95 )
      .attr("y", height - 370 )
      .attr("width", width / 30)
      .attr("height", height / 30)
      .attr("fill", "blue")

    svg.append("g")
      .append("text")
      .attr("x", width - 75 )
      .attr("y", height - 383 )
      .text("Doping")
      .attr("font-size", 12)

    svg.append("g")
      .append("text")
      .attr("x", width - 75 )
      .attr("y", height - 357 )
      .text("No Doping")
      .attr("font-size", 12)
  })
