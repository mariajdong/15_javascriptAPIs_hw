// define file path for json file
var url = `../../data/samples.json`;

// fxn to display bar graph & bubble chart
function build_chart (sample) {

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

        // create trace/data for bar graph
        var bar_data = [{
            x: x_values,
            y: y_values,
            text: hover_text,
            type: 'bar',
            orientation: 'h'
        }];

        Plotly.newPlot ('bar', bar_data);

        // create trace/data for bubble chart
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

        Plotly.newPlot ('bubble', bubble_data);
    });
}

// fxn to build metadata panel
function build_metadata (sample) {
    
    // define url, fetch sample info from metadata
    d3.json (url).then (function(data) {
        for (var x = 0; x < data.metadata.length; x++) {
            if (data.metadata[x].id == sample) {
                var sample_data = data.metadata[x]
            }
        };

        var metadata_box = d3.select ('#sample-metadata');
        metadata_box.html ("");

        Object.entries (sample_data).forEach (([key, value]) => {
            var row = metadata_box.append ('p');
            row.text (`${key}: ${value}`)
        });
    });
}

build_chart('1601');
build_metadata('1601');