// define file path for json file
// var url = `../data/samples.json`;
var url = 'https://mariajdong.github.io/15_javascriptAPIs_hw/static/data/samples.json'

// fxn to display bar graph & bubble chart
function build_charts (sample) {

    // pull data for selected sample
    d3.json (url).then ((data) => {
        for (var x = 0; x < data.samples.length; x++) {
            if (data.samples[x].id == sample) {
                var sample_data = data.samples[x]
            }
        };

        // pull arrays from sample data
        var sample_values = sample_data.sample_values;
        var otu_ids = sample_data.otu_ids;
        var otu_labels = sample_data.otu_labels;

        // slice arrays for bar graph
        var x_values = sample_values.slice (0, 10).reverse();
        var y_values = otu_ids.slice (0, 10).reverse().map (object => `OTU ${object}`);
        var hover_text = otu_labels.slice (0, 10).reverse();

        // create trace/data & layout for bar graph
        var bar_data = [{
            x: x_values,
            y: y_values,
            text: hover_text,
            type: 'bar',
            orientation: 'h'
        }];

        var bar_layout = {
            title: `Top 10 OTUs in Sample ${sample}`
        }

        Plotly.newPlot ('bar', bar_data, bar_layout, {responsive: true});

        // create trace/data & layout for bubble chart
        var bubble_data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids
            }
        }];

        var bubble_layout = {
            title: `All Bacteria in Sample ${sample} & Corresponding Frequency`,
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Frequency' }
        };
        
        Plotly.newPlot ('bubble', bubble_data, bubble_layout, {responsive: true});
    });
}

// fxn to build metadata panel & gauge chart
function build_metadata (sample) {
    
    // define url, fetch sample info from metadata
    d3.json (url).then (function(data) {
        for (var x = 0; x < data.metadata.length; x++) {
            if (data.metadata[x].id == sample) {
                var sample_data = data.metadata[x]
            }
        };

        var metadata_box = d3.select ('tbody');
        var tb = document.querySelector('tbody');
        while (tb.childNodes.length) {
            tb.removeChild(tb.childNodes[0]);
        }

        Object.entries (sample_data).forEach (([key, value]) => {
            var row = metadata_box.append ('tr');
            var cell = row.append ('td');
            cell.text (`${key}: ${value}`)

            // pull frequency of washing for gauge chart below
            if (key == 'wfreq') {
                wash_freq = value;
            }; 
        });

        // create gauge data
        var gauge_data = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: wash_freq,
            gauge: { 
                axis: { 
                    range: [0, 10],
                    dtick: 2
                },
                bar: { color: '#003333' },
                steps: [
                    { range: [0, 2], color: "#FFF9C4" },
                    { range: [2, 4], color: "#F0F4C3" },
                    { range: [4, 6], color: "#DCEDC8" },
                    { range: [6, 8], color: "#C8E6C9" },
                    { range: [8, 10], color: "#B2DFDB" }
                ],
            },
            title: 'Washing Frequency',
            type: "indicator",
            mode: "gauge+number"
        }];
        
        var gauge_layout = { width: 400, height: 450, margin: { l: -100, t: 0, b: 0 } };
        Plotly.newPlot('gauge', gauge_data, gauge_layout, {responsive: true});
    });
}

// fxn to initialize page
function init() {

    // select dropdown element, populate ID info in menu
    var dropdown = d3.select ('#selDataset');
    d3.json (url).then ((data) => {
        data.names.forEach ((name) => {
            dropdown.append ('option').text (name).property ('value');
        });
    });

    // fxns to pull corresponding data
    build_charts ('940');
    build_metadata ('940');
}

// fxn to populate new data
function optionChanged (id) {
    build_charts (id);
    build_metadata (id);
}

// call init fxn
init();