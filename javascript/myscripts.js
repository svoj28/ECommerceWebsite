var slides = document.querySelectorAll('.slide');
var btns = document.querySelectorAll('.buttonzz');
let currentSlide = 1;

var manualNav = function(manual) {
  slides.forEach((slide) => {
    slide.classList.remove('active');
  });

  btns.forEach(function(buttonzz) {
    buttonzz.classList.remove('active');
  });

  slides[manual].classList.add('active');
  btns[manual].classList.add('active');
}

btns.forEach((buttonzz, i) => {
  buttonzz.addEventListener("click", () => {
    manualNav(i);
    currentSlide = i;
  });
});

var repeat = function(activeClass) {
  let active = document.getElementsByClassName('active');
  let i = 1;

  var repeater = () => {
    setTimeout(function() {
      [...active].forEach((activeSlide) => {
        activeSlide.classList.remove('active');
      });

      slides[i].classList.add('active');
      btns[i].classList.add('active');
      i++;

      if (slides.length == i) {
        i = 0;
      }

      if (i >= slides.length) {
        return;
      }

      repeater();
    }, 10000);
  }

  repeater();
}

repeat();


var popupViews = document.querySelectorAll('.popup-view');
var popupBtns = document.querySelectorAll('.popup-btn');

var openPopup = function(popupClick) {
  popupViews[popupClick].classList.add('active');
}

popupBtns.forEach((popupBtn, i) => {
  popupBtn.addEventListener("click", () => {
    openPopup(i);
  });
});

var closeBtns = document.querySelectorAll('.popup-view .close-btn');
closeBtns.forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    var popupView = closeBtn.closest('.popup-view');
    popupView.classList.remove('active');
  });
});


// ************************************************
// Shopping Cart API
// ************************************************

var shoppingCart = (function() {
  // =============================
  // Private methods and propeties
  // =============================
  cart = [];
  
  // Constructor
  function Item(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }
  
  // Save cart
  function saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
  }
  
    // Load cart
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }
  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }
  

  // =============================
  // Public methods and propeties
  // =============================
  var obj = {};
  
  // Add to cart
  obj.addItemToCart = function(name, price, count) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart[item].count ++;
        saveCart();
        return;
      }
    }
    var item = new Item(name, price, count);
    cart.push(item);
    saveCart();
  }
  // Set count from item
  obj.setCountForItem = function(name, count) {
    for(var i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  obj.removeItemFromCart = function(name) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart[item].count --;
          if(cart[item].count === 0) {
            cart.splice(item, 1);
          }
          break;
        }
    }
    saveCart();
  }

 
  obj.removeItemFromCartAll = function(name) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  }

  
  obj.clearCart = function() {
    cart = [];
    saveCart();
  }

  
  obj.totalCount = function() {
    var totalCount = 0;
    for(var item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  }

  
  obj.totalCart = function() {
    var totalCart = 0;
    for(var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  }

  
  obj.listCart = function() {
    var cartCopy = [];
    for(i in cart) {
      item = cart[i];
      itemCopy = {};
      for(p in item) {
        itemCopy[p] = item[p];

      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy)
    }
    return cartCopy;
  }


  return obj;
})();


$('.add-to-cart').click(function(event) {
  event.preventDefault();
  var name = $(this).data('name');
  var price = Number($(this).data('price'));
  shoppingCart.addItemToCart(name, price, 1);
  displayCart();
});

// Clear items
$('.clear-cart').click(function() {
  shoppingCart.clearCart();
  displayCart();
});


function displayCart() {
  var cartArray = shoppingCart.listCart();
  var output = "";
  var totalPrice = 0; // Initialize total price variable
  
  for(var i in cartArray) {
    output += "<tr>"
      + "<td>" + cartArray[i].name + "</td>" 
      + "<td>(" + cartArray[i].price + ")</td>"
      + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
      + "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
      + "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
      + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
      + " = " 
      + "<td>" + cartArray[i].total + "</td>" 
      +  "</tr>";
      
    totalPrice += cartArray[i].total; // Add item total to the total price
  }
  
  // Add shipping fee to the total price
  var taxPercentage = 12; // 12% tax rate

  // Calculate the tax amount
  var taxAmount = (parseFloat(totalPrice) * taxPercentage) / 100;
  
  // Add the tax amount to the total price
  totalPrice = parseFloat(totalPrice) + taxAmount;

  $('.show-cart').html(output);
  $('.total-cart').html(totalPrice.toFixed(2)); // Display the updated total price with 2 decimal places
  $('.total-count').html(shoppingCart.totalCount());
}



// Delete item button

$('.show-cart').on("click", ".delete-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
})


// -1
$('.show-cart').on("click", ".minus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCart(name);
  displayCart();
})
// +1
$('.show-cart').on("click", ".plus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.addItemToCart(name);
  displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function(event) {
   var name = $(this).data('name');
   var count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();

var animateButton = function(e) {

  e.preventDefault;
  //reset animation
  e.target.classList.remove('animate');
  
  e.target.classList.add('animate');
  
  e.target.classList.add('animate');
  setTimeout(function(){
    e.target.classList.remove('animate');
  },6000);
};

var classname = document.getElementsByClassName("button");

for (var i = 0; i < classname.length; i++) {
  classname[i].addEventListener('click', animateButton, false);
}

function validateAndAnimate(event) {
  event.preventDefault(); // Prevent the form from submitting

  // Get the form values
  const name = document.getElementById('name').value.trim();
  const address = document.getElementById('address').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const email = document.getElementById('email').value.trim();
  const totalPrice = document.querySelector('.total-cart').textContent.trim();
  const selectedPayment = document.querySelector('input[name="payment"]:checked');

  // Check if any field or total price is empty
  if (name === '' || address === '' || contact === '' || email === '' || totalPrice === '0.00') {
    // Show error state animation and button
    const errorBlock = document.querySelector('.block');
    errorBlock.innerHTML = '<button class="button animate error"></button>';
    
    setTimeout(function() {
      // Reset to original button
      errorBlock.innerHTML = '<button class="button success" type="submit" onclick="validateAndAnimate(event)">CHECKOUT</button>';
    }, 5000); // Reset after 5 seconds
  } else if (!selectedPayment) {
    // Show error state animation and button
    const errorBlock = document.querySelector('.block');
    errorBlock.innerHTML = '<button class="button animate error"></button>';
  
    // Insert error message for payment selection
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Please select a mode of payment';
    errorBlock.appendChild(errorMessage);
  
    setTimeout(function() {
      // Reset to original button and remove error message
      errorBlock.innerHTML = '<button class="button success" type="submit" onclick="validateAndAnimate(event)">CHECKOUT</button>';
    }, 5000); // Reset after 5 seconds
  } else {
    // Show success state animation and button
    const successBlock = document.querySelector('.block');
    successBlock.innerHTML = '<button class="button animate success"></button>';
    
    setTimeout(function() {
      // Reset to original button
      successBlock.innerHTML = '<button class="button success" type="submit" onclick="validateAndAnimate(event)">CHECKOUT</button>';
    }, 5000); // Reset after 5 seconds
  }
}
var popupContainer = document.getElementById("popup-container");
var popup = document.getElementById("popup");

function openPopupzz() {
  popupContainer.style.display = "block";
}

function closePopupzz() {
  popupContainer.style.display = "none";
}

function showPaymentForm(payment) {
  var paymentForms = document.getElementsByClassName("payment-form");
  for (var i = 0; i < paymentForms.length; i++) {
    paymentForms[i].style.display = "none";
  }

  var selectedForm = document.getElementById(payment + "-form");
  if (selectedForm) {
    selectedForm.style.display = "block";
  }
}

    //jquery for toggle dropdown menus
    $(document).ready(function(){
      //toggle sub-menus
      $(".sub-btn").click(function(){
        $(this).next(".sub-menu").slideToggle();
      });

      //toggle more-menus
      $(".more-btn").click(function(){
        $(this).next(".more-menu").slideToggle();
      });
    });

    //javascript for the responsive navigation menu
    var menu = document.querySelector(".menu");
    var menuBtn = document.querySelector(".menu-btn");
    var closeBtn = document.querySelector(".close-btn");

    menuBtn.addEventListener("click", () => {
      menu.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
      menu.classList.remove("active");
    });

    //javascript for the navigation bar effects on scroll
    window.addEventListener("scroll", function(){
      var header = document.querySelector("header");
      header.classList.toggle("sticky", window.scrollY > 0);
    });
