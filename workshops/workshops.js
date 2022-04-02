import { checkAuth, logout, getWorkshops, deleteParticipant, moveParticipant } from '../fetch-utils.js';

checkAuth();

const workshopsEl = document.querySelector('.workshops-container');
const logoutButton = document.getElementById('logout');

var dragged = '';

logoutButton.addEventListener('click', () => {
    logout();
});

async function displayWorkshops() {
    const workshops = await getWorkshops();
    workshopsEl.textContent = '';
    for (let workshop of workshops) {
        const div = document.createElement('div');
        const h3 = document.createElement('h3');
        const partDiv = document.createElement('div');
        div.classList.add('dropzone');
        div.classList.add('workshop');
        div.setAttribute('id', workshop.id);
        partDiv.classList.add('participants');
        h3.textContent = workshop.name;
        document.addEventListener('drop', drop);
        for (let participant of workshop.participants) {
            const partEl = document.createElement('div');
            partEl.classList.add('participant');
            partEl.setAttribute('id', participant.id);
            partEl.setAttribute('draggable', true);
            partEl.setAttribute('ondragstart', 'event.dataTransfer.setData("text/plain", null)');
            partEl.textContent = participant.name;
            partEl.addEventListener('click', async () => {
                await deleteParticipant(participant.id);
                const newWorkshops = await getWorkshops;
                displayWorkshops(newWorkshops);
            });
            partDiv.append(partEl);
        }
        div.append(h3, partDiv);
        workshopsEl.append(div);
    }
}
//eslint-disable-next-line
document.addEventListener('drag', function(event) {

}, false);

document.addEventListener('dragstart', function(event) {
    // store a ref. on the dragged elem
    dragged = event.target;
    event.dataTransfer.setData('text', event.target.id);
    // make it half transparent
    event.target.style.opacity = .5;
}, false);

document.addEventListener('dragend', function(event) {
    // reset the transparency
    event.target.style.opacity = '';
}, false);

/* events fired on the drop targets */
document.addEventListener('dragover', function(event) {
    // prevent default to allow drop
    event.preventDefault();
}, false);

document.addEventListener('dragenter', function(event) {
    // highlight potential drop target when the draggable element enters it
    if (event.target.className === 'dropzone workshop') {
        event.target.style.background = 'purple';
    }

}, false);

document.addEventListener('dragleave', function(event) {
    // reset background of potential drop target when the draggable element leaves it
    if (event.target.className === 'dropzone workshop') {
        event.target.style.background = '';
    }
}, false);

async function drop(event) {
        // prevent default action (open as link for some elements)
    event.preventDefault();
        // move dragged elem to the selected drop target
    if (event.target.className === 'dropzone workshop') {
        event.target.style.background = '';
        dragged.parentNode.removeChild(dragged);
        event.target.appendChild(dragged);
        const participantId = event.dataTransfer.getData('text');
        const participantEl = document.getElementById(participantId);
        const elementPlace = event.path.length - 7;
        event.path[elementPlace].childNodes[1].append(participantEl);
        const workshopId = event.path[elementPlace].id;
        await moveParticipant(participantId, workshopId);
    }
}
window.addEventListener('load', async () => {
    await displayWorkshops();
});