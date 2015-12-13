/**
 * Created by cicles on 13/11/2015.
 */

var cart = {
    subtotal:50,
    iva:18,
    getTotal: function() {
        return this.subtotal * (1 + this.iva/100);
    }
};



var carrito =  parseInt(document.getElementById('product1').innerText) +  parseInt(document.getElementById('product2').innerText) +  parseInt(document.getElementById('product3').innerText);
var test = cart.getTotal.bind({subtotal:carrito,iva:21});

test();

console.log(test());
console.log(carrito);

var iva = document.getElementsByName('iva');
for (var i=0;i<iva.length;i++){
    if (iva[i].checked == true){
        iva = iva[i];
        break;
    }
}

/*


console.log(iva);*/
/*
console.log(cart.getTotal());
console.log(cart.getTotal.bind({iva:18}));
*/