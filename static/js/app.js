const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

const dataPromise = d3.json(url);
console.log("Data promise", dataPromise);

d3.json(url).then(function (data_we_get_back) {
    console.log("data_we_get_back", data_we_get_back);
});

function init() {

    let Menu = d3.select("#selDataset");

    d3.json(url).then((data) => {

        let names = data.names;

        names.forEach((id) => {

            console.log(id);

            Menu.append("option")
                .text(id)
                .property("value", id);

        });

        let first_sample = names[0];

        console.log(first_sample);

        buildMetadata(first_sample);
        buildBarchart(first_sample);
        buildBubblechart(first_sample);

    });

};
function optionChanged(sample) {
    buildMetadata(sample);
    buildBarchart(sample);
    buildBubblechart(sample);
};

function buildMetadata(sample) {

    d3.json(url).then((data) => {

        let metadata = data.metadata;

        let value = metadata.filter(result => result.id == sample);

        console.log(value)

        let valuedata = value[0];

        d3.select("#sample-metadata").html("");

        Object.entries(valuedata).forEach(([key, value]) => {

            console.log(key, value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

function buildBarchart(sample) {

    d3.json(url).then((data) => {

        let sample_info = data.samples;

        let value = sample_info.filter(result => result.id == sample);

        let valuedata = value[0];

        let otu_ids = valuedata.otu_ids;
        let otu_labels = valuedata.otu_labels;
        let sample_values = valuedata.sample_values;

        console.log(otu_ids, otu_labels, sample_values);

        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0, 10).reverse();
        let labels = otu_labels.slice(0, 10).reverse();

        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top 10 OTUs Present"
        };

        Plotly.newPlot("bar", [trace], layout)
    });
};

function buildBubblechart(sample) {

    d3.json(url).then((data) => {

        let sample_info = data.samples;

        let value = sample_info.filter(result => result.id == sample);

        let valuedata = value[0];

        let otu_ids = valuedata.otu_ids;
        let otu_labels = valuedata.otu_labels;
        let sample_values = valuedata.sample_values;

        console.log(otu_ids, otu_labels, sample_values);

        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        let layout = {
            title: "Microbial Species",
            hovermode: "closest",

        };

        Plotly.newPlot("bubble", [trace1], layout)
    });
};

init();