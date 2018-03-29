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
