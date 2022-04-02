/* eslint-disable no-console */
const SUPABASE_URL = 'https://mehoppuauhpwwofefpdc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1laG9wcHVhdWhwd3dvZmVmcGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc5NzIzMzEsImV4cCI6MTk2MzU0ODMzMX0.SdElfTGiCmXLkKax2vtO9-vVw5ioXrQMRkH28fDYKY8';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export async function moveParticipant(participant_id, workshop_id) {
    const response = await client 
        .from('participants')
        .update({ workshop_id: workshop_id })
        .match({ id: participant_id });
    return checkError(response);
}

export async function getParticipantByName(name) {
    const response = await client
        .from('participants')
        .select('*')
        .match({
            name: name
        });
    return checkError(response);
}

export async function createParticipant(participant) {
    const response = await client
        .from('participants')
        .insert({
            name: participant.name,
            user_id: client.auth.user().id,
            workshop_id: participant.workshop_id
        });
    return checkError(response);
}

export async function getWorkshops() {
    const response = await client
        .from('workshops')
        .select('*, participants (*)');
    return checkError(response);
}

export async function deleteParticipant(id) {
    const response = await client
        .from('participants')
        .delete()
        .match({ id: id })
        .single();
    return checkError(response);
}

export function getUser() {
    return client.auth.session() && client.auth.session().user;
}

export function checkAuth() {
    const user = getUser();

    if (!user) location.replace('../');
}

export function redirectIfLoggedIn() {
    if (getUser()) {
        location.replace('./workshops');
    }
}

export async function signupUser(email, password) {
    const response = await client.auth.signUp({ email, password });

    return response.user;
}

export async function signInUser(email, password) {
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return (window.location.href = '../');
}

function checkError({ data, error }) {
    return error ? console.error(error) : data;
}
