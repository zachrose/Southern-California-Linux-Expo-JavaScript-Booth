
const EventEmitter = require('events');
const Color = require('color');
const tinygradient = require('tinygradient');
const el = (id) => document.getElementById(id);
const qs = (selector) => document.querySelector(selector);
const rand = () => Math.random();
class Bus extends EventEmitter {};
const bus = new Bus();

// jsla page
if(document.body.className == 'jsla'){
    (function(){
        let startingHue = Math.floor(rand()*360);
        const getHue = function(){
            startingHue = (startingHue + 1) % 360
            return startingHue;
        }
        setInterval(function(){
            const color = {
                hue: getHue(),
                lightness: 40,
                saturation: 50
            };
            const lightOrDark = Color(color).dark() ? 'dark' : 'light';
            const linkBgColor = lightOrDark ? 'white' : 'black'
            const linkColor = Color(linkBgColor).dark() ? 'white': 'black';
            [].slice.call(document.querySelectorAll("a.yay")).forEach(function(el){
                el.style.color = linkColor;
                el.style.backgroundColor = linkBgColor;
            })
            document.body.classList.remove('light')
            document.body.classList.remove('dark')
            document.body.classList.add(lightOrDark)
            document.body.style.backgroundColor = Color(color).hexString()
        }, 300);
    })()
}
// end jsla page

const serviceUrl = "https://damp-falls-30597.herokuapp.com"

var bindColorInputChanges = function(fn){
    return ['hue', 'lightness', 'saturation'].map(function(dimension){
        el(dimension).addEventListener('input', fn);
    })
};

var getColor = function(){
    return ['hue', 'lightness', 'saturation'].reduce(function(memo, dimension){
        var value = qs(`#${dimension} input`).value;
        return Object.assign(memo, { [dimension]: value });
    }, {});
};

var updateShirtColor = function(colorElement){
    return function(color){
        var hex = Color(color).hexString();
        colorElement.style.backgroundColor = hex;
    }
};

var updateShirtArtworkColor = function(artworkElement){
    return function(contrast){
        artworkElement.classList.remove('light');
        artworkElement.classList.remove('dark');
        artworkElement.classList.add(contrast);
    }
};

var updateColorPicker = function(saturationElement, lightnessElement, hueElement){
    var updateDimension = function(element, dimension){
        var input = element.querySelector('input')
        return function(color){
            var _color = Color(color);
            input.value = color[dimension];
            element.style.background = tinygradient([
                {pos: 0.0, color: _color[dimension](0).hexString()},
                {pos: 0.5, color: _color[dimension](50).hexString()},
                {pos: 1.0, color: _color[dimension](100).hexString()}
            ]).css();
        }
    };
    var updateHue = function(element){
        var input = element.querySelector('input')
        return function(color){
            input.value = color.hue;
        };
    };
    return function(color){
        updateDimension(saturationElement, 'saturation')(color);
        updateDimension(lightnessElement, 'lightness')(color);
        updateHue(hueElement)(color);
    }
}

var updateButton = function(buttonElement){
    return function(color, lightOrDark){
        var hex = Color(color).hexString();
        buttonElement.style.backgroundColor = hex;
        buttonElement.classList.remove('light');
        buttonElement.classList.remove('dark');
        buttonElement.classList.add('for');
        buttonElement.classList.add(lightOrDark);
    }
}

var updateButtonText = function(hexElement){
    return function(color){
        var hex = Color(color).hexString();
        hexElement.innerText = hex;
    }
}

var Updater = function(){
    var colorPicker = updateColorPicker(el('saturation'), el('lightness'), el('hue'));
    var shirtColor = updateShirtColor(el('tshirt-color'))
    var shirtArtworkColor = updateShirtArtworkColor(el('tshirt-artwork'));
    var button = updateButton(el('vote'));
    var buttonText = updateButtonText(el('hex'));
    var submitSubscription = updateButton(el('submit-subscription'));
    return function(color){
        var contrast = Color(color).dark() ? 'light' : 'dark';
        shirtColor(color);
        button(color, contrast);
        colorPicker(color);
        buttonText(color);
        shirtArtworkColor(contrast);
        submitSubscription(color, contrast)
    }
}

bus.on('NEW_COLOR', Updater());
bindColorInputChanges(() => bus.emit('NEW_COLOR', getColor()));
bus.emit('NEW_COLOR', {
    hue: rand()*360,
    lightness: rand()*50+rand()*50,
    saturation: rand()*50+rand()*50
});

var subscribe = function(e){
    e.preventDefault()
    const body = {
        color: Color(getColor()).hexString(),
        email: el('email').value
    }
    fetch(serviceUrl+'/identified_votes', {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(body)
    })
    .then(function(){
        document.body.className = "subscribed"
    })
};

var vote = function(){
    fetch(serviceUrl+'/anonymous_votes', {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ color: "#000001" })
    })
    .then(function(res){ console.log('yay', res) })
    .catch(function(res){ console.log('boo', res) })
    // don't wait for slow cheap Heroku to warm up, just assume success:
    setTimeout(function(){
        document.body.classList.add('voted');
    }, 200);
};

el('vote').addEventListener('click', vote);
qs('#subscribe form').addEventListener('submit', subscribe)





