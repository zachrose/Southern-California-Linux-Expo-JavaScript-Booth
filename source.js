var Color = require('color');

var getColorInputs = function(doc){
    return ['hue', 'lightness', 'saturation'].map(function(dimension){
        return [ 
            dimension,
            document.querySelector(`#${dimension} input`).value
        ]
    }).reduce(function(memo, pair){
        memo[pair[0]] = pair[1];
        return memo;
    }, {});
};

var setShirtColor = function(doc){
    return function(shirtColorString, artLightOrDark){
        doc.getElementById('tshirt-color')
            .style
            .backgroundColor = shirtColorString;
        doc.getElementById('tshirt-artwork').classList.remove('light');
        doc.getElementById('tshirt-artwork').classList.remove('dark');
        doc.getElementById('tshirt-artwork').classList.add(artLightOrDark);
    }
}

setInterval(function(){
    var color = getColorInputs(document);
    console.log(color);
    setShirtColor(document)(
        Color(color).hslString(),
        Color(color).dark() ? 'light' : 'dark'
    )
}, 16);
