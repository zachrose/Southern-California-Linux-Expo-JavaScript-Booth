var Color = require('color');
var Cookies = require('js-cookie');
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
        var element = doc.getElementById('vote');
        var hex = Color(color).hexString();
        var hexEl = doc.getElementById('hex');
        hexEl.innerText = hex;
        element.style.backgroundColor = hex;
        element.classList.remove('light');
        element.classList.remove('dark');
        element.classList.add('for');
        element.classList.add(lightOrDark);
    }
}

var loop = function(){
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
}

var intro = function(){
    if(Cookies.get('subscribed')){
        document.body.classList.add('subscribed');
    }
    if(Cookies.get('voted')){
        document.body.classList.add('voted');
        return setInterval(function(){}, 100);
    }
    var i = 0;
    var f = function(x){ return Math.sin(x/(Math.PI*50))*180 };
    return setInterval(function(){
        i += 16;
        i = Math.min(i, 989);
        hue = f(i) + 180;
        document.querySelector('#hue input').value = hue;
    }, 32);
}

setImmediate(function(){
    var introInterval = intro();
    setInterval(loop, 32);
    setTimeout(function(){ clearInterval(introInterval) }, 3000);

    document.getElementById('vote').addEventListener('click', function(){
        var hex = document.getElementById('hex').innerText;
        analytics.track("T-Shirt Color Vote", {
            hexColor: hex
        });
        document.body.classList.add('voted');
        Cookies.set('voted', hex);
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
        Cookies.set('subscribed', true);
    });
});
