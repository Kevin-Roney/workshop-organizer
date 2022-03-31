import { checkAuth, logout, getWorkshops, deleteParticipant } from '../fetch-utils.js';

checkAuth();

const workshopsEl = document.querySelector('.workshops-container');
const logoutButton = document.getElementById('logout');

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
        div.classList.add('workshop');
        partDiv.classList.add('participants');
        h3.textContent = workshop.name;
        for (let participant of workshop.participants) {
            const partEl = document.createElement('div');
            partEl.classList.add('participant');
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

window.addEventListener('load', async () => {
    await displayWorkshops();
});