var Color = require('color');
var tinygradient = require('tinygradient');
var el = (id) => document.getElementById(id);

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

var updateShirtColor = function(colorElement, artworkElement){
    return function(shirtColorString, artLightOrDark){
        colorElement
            .style
            .backgroundColor = shirtColorString;
        artworkElement.classList.remove('light');
        artworkElement.classList.remove('dark');
        artworkElement.classList.add(artLightOrDark);
    }
};

var updateColorPicker = function(saturationElement, lightnessElement){
    var setPickerBackground = function(element, dimension){
        return function(color){
            var _color = Color(color);
            element.style.background = tinygradient([
                {pos: 0.0, color: _color[dimension](000).hexString()},
                {pos: 0.5, color: _color[dimension](050).hexString()},
                {pos: 1.0, color: _color[dimension](100).hexString()}
            ]).css();
        }
    };
    return function(color){
        setPickerBackground(saturationElement, 'saturation')(color);
        setPickerBackground(lightnessElement, 'lightness')(color);
    }
}

var updateButton = function(buttonElement, hexElement){
    return function(color, lightOrDark){
        var hex = Color(color).hexString();
        hexElement.innerText = hex;
        buttonElement.style.backgroundColor = hex;
        buttonElement.classList.remove('light');
        buttonElement.classList.remove('dark');
        buttonElement.classList.add('for');
        buttonElement.classList.add(lightOrDark);
    }
}


var loop = function(){
    var color = getColorInputs(document);
    updateColorPicker(el('saturation'), el('lightness'))(color);
    updateButton(
        el('vote'),
        el('hex')
    )(
        color,
        Color(color).dark() ? 'light' : 'dark'
    )
    updateShirtColor(el('tshirt-color'), el('tshirt-artwork'))(
        Color(color).hslString(),
        Color(color).dark() ? 'light' : 'dark'
    )
}

setImmediate(function(){
    setInterval(loop, 32);

    el('vote').addEventListener('click', function(){
        var hex = el('hex').innerText;
        analytics.track("T-Shirt Color Vote", {
            hexColor: hex
        });
        document.body.classList.add('voted');
    });

    document.querySelector('#subscribe button').addEventListener('click', function(){
        var email = document.querySelector('#subscribe input').value;
        var looksOk = email.match(/@/);
        if(!looksOk){
            alert("Please check this email address and try again");
            return;
        }
        analytics.track("Subscribed", { email: email });
        document.body.classList.add('subscribed');
    });
});
