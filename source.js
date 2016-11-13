var Color = require('color');
var tinygradient = require('tinygradient');

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

var setColorPickerColor = function(doc){
    var setPickerBackground = function(dimension){
        return function(color){
            var _color = Color(color);
            doc.getElementById(dimension).style.background = tinygradient([
                {pos: 0.0, color: _color[dimension](000).hexString()},
                {pos: 0.5, color: _color[dimension](050).hexString()},
                {pos: 1.0, color: _color[dimension](100).hexString()}
            ]).css();
        }
    };
    return function(color){
        setPickerBackground('saturation')(color);
        setPickerBackground('lightness')(color);
    }
}

var setButton = function(doc){
    return function(color, lightOrDark){
        var hex = Color(color).hexString();
        var text = `VOTE FOR ${hex}`;
        var element = doc.getElementById('vote');
        element.innerText = text;
        element.style.backgroundColor = hex;
        element.classList.remove('light');
        element.classList.remove('dark');
        element.classList.add(lightOrDark);
    }
}

setInterval(function(){
    var color = getColorInputs(document);
    setColorPickerColor(document)(color);
    setButton(document)(
        color,
        Color(color).dark() ? 'light' : 'dark'
    )
    setShirtColor(document)(
        Color(color).hslString(),
        Color(color).dark() ? 'light' : 'dark'
    )
}, 16);
