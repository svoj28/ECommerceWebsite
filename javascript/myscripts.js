var counter = 1;
setInterval(function(){
  document.getElementById('radio' + counter).checked = true;
  counter++;
  if(counter > 4){
    counter = 1;
  }
}, 5000);
$(document).ready(function(){
    $(".sub-btn").click(function(){
      $(this).next(".sub-menu").slideToggle();
    });
    $(".more-btn").click(function(){
      $(this).next(".more-menu").slideToggle();
    });
  });
  var menu = document.querySelector(".menu");
  var menuBtn = document.querySelector(".menu-btn");
  var closeBtn = document.querySelector(".close-btn");
  menuBtn.addEventListener("click", () => {
    menu.classList.add("active");
  });
  closeBtn.addEventListener("click", () => {
    menu.classList.remove("active");
  });
  window.addEventListener("scroll", function(){
    var header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
  });