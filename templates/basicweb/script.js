console.log("JavaScript is loaded and running!");

const button = document.getElementById('myButton');
button.addEventListener('click', () => {
  alert('Button clicked! Interaction from the VM works.');
});