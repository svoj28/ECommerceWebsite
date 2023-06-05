var slides = document.querySelectorAll('.slide');
var btns = document.querySelectorAll('.button');
let currentSlide = 1;

var manualNav = function(manual) {
  slides.forEach((slide) => {
    slide.classList.remove('active');
  });

  btns.forEach(function(button) {
    button.classList.remove('active');
  });

  slides[manual].classList.add('active');
  btns[manual].classList.add('active');
}

btns.forEach((button, i) => {
  button.addEventListener("click", () => {
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
    var closeBtns = document.querySelectorAll('.close-btn');

    //javascript for quick view button
    var popup = function(popupClick){
      popupViews[popupClick].classList.add('active');
    }

    popupBtns.forEach((popupBtn, i) => {
      popupBtn.addEventListener("click", () => {
        popup(i);
      });
    });

    //javascript for close button
    closeBtns.forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => {
        popupViews.forEach((popupView) => {
          popupView.classList.remove('active');
        });
      });
    });