
// get needed element
let infoGeneral = document.querySelector('.info-general');
let infoPersonal = document.querySelector('.info-personal');
let infoContact = document.querySelector('.info-contact');
let progressbar = document.querySelector('.progress-bar');
let form = document.querySelector("form");
let nextButton = document.querySelector('#next');
let submitButton = document.querySelector('#hiddenSubmit')
let stepMessage = document.querySelector('.step');
let step1 = document.createTextNode('Account Credentials');
let step2 = document.createTextNode('Personal Information');
let step3 = document.createTextNode('Contact Information');
stepMessage.appendChild(step1);
let directionCounter = 0;

document.getElementById('next').addEventListener('click', () => {
	if (directionCounter == 0){
		infoGeneral.setAttribute('id','hidden');
		infoPersonal.removeAttribute('id');
		progressbar.setAttribute('id',"step2");
		progressbar.removeAttribute('style');
		stepMessage.removeChild(step1);
		stepMessage.appendChild(step2);
		directionCounter++
	} else if(directionCounter == 1) {
		infoPersonal.setAttribute('id','hidden');
		infoContact.removeAttribute('id');
		progressbar.setAttribute('id',"step3");
		progressbar.removeAttribute('style');
		submitButton.setAttribute('id','submit');
		nextButton.setAttribute('id','hidden');
		stepMessage.removeChild(step2);
		stepMessage.appendChild(step3);
		directionCounter++
	} else {
			console.log('end of form');
	}
});

document.getElementById('back').addEventListener('click', () => {
	if (directionCounter == 0 ){
		console.log('cant go back');
	} else if (directionCounter == 1){
		infoPersonal.setAttribute('id','hidden');
		infoGeneral.removeAttribute('id');
		progressbar.setAttribute('id',"step1");
		progressbar.removeAttribute('style');
		stepMessage.removeChild(step2);
		stepMessage.appendChild(step1);
		directionCounter = 0;
	} else if(directionCounter == 2) {
		infoContact.setAttribute('id','hidden');
		infoPersonal.removeAttribute('id');
		progressbar.setAttribute('id',"step2");
		progressbar.removeAttribute('style');
		submitButton.setAttribute('id','hiddenSubmit');
		nextButton.setAttribute('id','next');
		stepMessage.removeChild(step3);
		stepMessage.appendChild(step2);
		directionCounter = 1
	}
console.log('back');
});
