#!/usr/local/bin/node
var fs = require("fs");
var sprintf = require("sprintf-js").sprintf;
var convnetjs = require("convnetjs");

var create = false;
var set = "train";
//var set = "t10k";


var net = new convnetjs.Net();
if (create)
{
    var layer_defs = [];
    layer_defs.push({type:'input', out_sx:24, out_sy:24, out_depth:1});
    layer_defs.push({type:'conv', sx:5, filters:8, stride:1, pad:2, activation:'relu'});
    layer_defs.push({type:'pool', sx:2, stride:2});
    layer_defs.push({type:'conv', sx:5, filters:16, stride:1, pad:2, activation:'relu'});
    layer_defs.push({type:'pool', sx:3, stride:3});
    layer_defs.push({type:'softmax', num_classes:10});
    net.makeLayers(layer_defs);
}
else
{
    var json = fs.readFileSync('./starter/nnew.json');
    net.fromJSON(JSON.parse(json));
}

trainer = new convnetjs.SGDTrainer(net, {method:'adadelta', batch_size:1, l2_decay:0.0005});

var labels = readLabels('data/' + set + '-labels-idx1-ubyte');
train(labels, trainer, 'data/' + set + '-images-idx3-ubyte');

var json = net.toJSON();
fs.writeFileSync('nnew.json', JSON.stringify(json));
console.log('done');


function readLabels(fileName) {
    var labels = [];
    var data = fs.readFileSync(fileName);
    var mn = data.readInt32BE(0);
    console.log('MN:', mn);

    var itemCount = data.readInt32BE(4);
    console.log('items:', itemCount);

    for (var i = 0; i < itemCount; i++)
    {
        var label = data.readInt8(i + 8);
        labels.push(label);
    }
    return labels;
}

function train(labels, trainer, fileName) {
    var data = fs.readFileSync(fileName);
    var mn = data.readInt32BE(0);
    console.log('MN:', mn);

    var itemCount = data.readInt32BE(4);
    console.log('items:', itemCount);

    var rows = data.readInt32BE(8);
    console.log('rows:', rows);

    var cols = data.readInt32BE(12);
    console.log('cols:', cols);

    itemCount = 10000;
    var offset = 0;
    for (var i = 0; i < itemCount; i++)
    {
        var pixels = [];
        var inputs = [];
        for (var c = 0; c < cols; c++)
        {
            for (var r = 0; r < rows; r++)
            {
                var pixel = data.readUInt8(16 + offset++);
                pixels.push(pixel);
                inputs.push(pixel/255 - 0.5);
            }
        }
        var x = new convnetjs.Vol(cols, rows, 1, 0.0); //input volume (image)
        x.w = inputs;
        net.forward(x);
        var yhat = net.getPrediction();

        var stats = trainer.train(x, labels[i]);
        var lossx = stats.cost_loss;
        var lossw = stats.l2_decay_loss;
        var v = 'no ';
        if (yhat == labels[i])
            v = '   ';
        if (yhat != labels[i])
            console.log(i, v,'should be:', labels[i], 'thinks', yhat, lossx, lossw);
        if (false)
        {
            console.log("Image:", i, "Represents:", labels[i]);
            process.stdout.write("      ");
            for (var y = 0; y < cols; y++)
            {
                process.stdout.write(sprintf("%4i", y));
            }
            process.stdout.write("\n------");
            for (var y = 0; y < cols; y++)
            {
                process.stdout.write("----");
            }
            var idx = 0;
            for (var x = 0; x < rows; x++)
            {
                process.stdout.write(sprintf("\n%4i |", x));
                for (var y = 0; y < rows; y++)
                {
                    process.stdout.write(sprintf("%4i", pixels[idx++]));
                }
            }
            process.stdout.write("\n\n");
        }

    }
}
