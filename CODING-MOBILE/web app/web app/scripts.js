function toggleMenu() {
    var menu = document.getElementById('menu');
    menu.classList.toggle('hidden');
}

function showHome() {
    document.getElementById('home').classList.remove('hidden');
    document.getElementById('denunciar').classList.add('hidden');
    document.getElementById('menu').classList.add('hidden');
}

function showForm() {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('denunciar').classList.remove('hidden');
    document.getElementById('menu').classList.add('hidden');
}
