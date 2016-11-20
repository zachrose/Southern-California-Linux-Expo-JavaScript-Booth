var Color = require('color');
var tinygradient = require('tinygradient');
var el = (id) => document.getElementById(id);

var bindColorInputChanges = function(fn){
    return ['hue', 'lightness', 'saturation'].map(function(dimension){
        el(dimension).addEventListener('input', fn);
    })
};

var getColorInputs = function(){
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
    return function(color, artLightOrDark){
        var hex = Color(color).hexString();
        colorElement
            .style
            .backgroundColor = hex;
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

var update = function(color){
    updateColorPicker(el('saturation'), el('lightness'))(color);
    updateButton(
        el('vote'),
        el('hex')
    )(
        color,
        Color(color).dark() ? 'light' : 'dark'
    )
    updateShirtColor(el('tshirt-color'), el('tshirt-artwork'))(
        color,
        Color(color).dark() ? 'light' : 'dark'
    )
}

bindColorInputChanges(function(){
    update(getColorInputs())
});

update(getColorInputs())

var subscribe = function(){};  // no-op
var vote = function(){
    document.body.classList.add('voted');
};

el('vote').addEventListener('click', vote);
document.querySelector('#subscribe button').addEventListener('click', subscribe)
