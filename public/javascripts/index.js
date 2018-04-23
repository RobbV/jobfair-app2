let seeker = document.getElementById('seeker');
let employer = document.getElementById('employer');
let btnSeeker = document.getElementById('btn_seeker');
let btnEmployer = document.getElementById('btn_employer');
let submit = document.getElementById('submit');

function hideForms() {
    seeker.style.display = 'none';
    employer.style.display = 'none';
    btnSeeker.style.display = 'block';
    btnEmployer.style.display = 'block';
    submit.style.display = 'none';
}

function seeker_visibility() {
    seeker.style.display = 'block';
    btnSeeker.style.display = 'none';
    employer.style.display = 'none';
    btnEmployer.style.display = 'block';
    submit.style.display = 'block';
 }

 function employer_visibility() {
    employer.style.display = 'block';
    btnEmployer.style.display = 'none';
    seeker.style.display = 'none';
    btnSeeker.style.display = 'block';
    submit.style.display = 'block';
 }
 function randomNum()
         {
             "use strict";
             return Math.floor(Math.random() * 9)+1;
         }
             var loop1,loop2,loop3,time=30, i=0, number, selector3 = document.querySelector('.thirdDigit'), selector2 = document.querySelector('.secondDigit'),
                 selector1 = document.querySelector('.firstDigit');
             loop3 = setInterval(function()
             {
               "use strict";
                 if(i > 40)
                 {
                     clearInterval(loop3);
                     selector3.textContent = 4;
                 }else
                 {
                     selector3.textContent = randomNum();
                     i++;
                 }
             }, time);
             loop2 = setInterval(function()
             {
               "use strict";
                 if(i > 80)
                 {
                     clearInterval(loop2);
                     selector2.textContent = 0;
                 }else
                 {
                     selector2.textContent = randomNum();
                     i++;
                 }
             }, time);
             loop1 = setInterval(function()
             {
               "use strict";
                 if(i > 100)
                 {
                     clearInterval(loop1);
                     selector1.textContent = 4;
                 }else
                 {
                     selector1.textContent = randomNum();
                     i++;
                 }
             }, time);
