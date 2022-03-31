import { checkAuth, logout, createParticipant, getWorkshops } from '../fetch-utils.js';

checkAuth();

const form = document.querySelector('.participant-form');
const logoutButton = document.getElementById('logout');
const selectEl = document.querySelector('select');

logoutButton.addEventListener('click', () => {
    logout();
});
window.addEventListener('load', async () => {
    const workshops = await getWorkshops();
    for (let workshop of workshops) {
        const optionEl = document.createElement('option');
        optionEl.textContent = workshop.name;
        optionEl.value = workshop.id;
        selectEl.append(optionEl);
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const workshopId = data.get('workshop-id');
    const name = data.get('participant-name');
    await createParticipant({
        name: name,
        workshop_id: workshopId
    }),
    form.reset();
    window.location.href = '../workshops';
});