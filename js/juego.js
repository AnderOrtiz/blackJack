const miModulo = (() => {

    'use strict'

    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'K', 'Q'];

    let puntosJugadores = []



    //Referencias HTML
    const btnPedir = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevo = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
        puntosHTML = document.querySelectorAll('small');


    // Esta funcion inicializa el juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];

        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        puntosHTML.forEach(elem => elem.innerHTML = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');

        btnDetener.disabled = false;
        btnPedir.disabled = false;

    };

    const crearDeck = () => {

        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo);
            }
        }

        return _.shuffle(deck);
    }

    // Esta función me permite tomar una carta
    const pedirCarta = () => {


        if (deck.length === 0) {
            throw 'No hay mas cartas en el deck';
        };

        return deck.pop();
    }


    // Esta función retorna el valor de la carta
    const valorCarta = (carta) => {

        const valor = carta.substring(0, carta.length - 1);

        return (isNaN(valor)) ?
            (valor === 'A') ? 11 : 10 :
            valor * 1; //Para convertirlo de str a int
    }


    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }


    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }


    const determinarGanador = () => {

        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {
            if (puntosComputadora === puntosMinimos) {
                alert('Empate');
            } else if ((puntosMinimos > 21) || (puntosComputadora === 21)) {
                alert('Computadora Gana');
            } else if ((puntosComputadora > 21) || (puntosMinimos <= 21 && puntosMinimos > puntosComputadora)) {
                alert('Jugador Gana');
            } else {
                alert('Computadora Gana')
            }
        }, 10);
    }


    // Turno de la computadora
    const turnoComputadora = (puntosMinimos) => {

        let puntosComputadora = 0;

        do {
            const carta = pedirCarta();
            let puntosJugadoresLength = puntosJugadores.length - 1;
            puntosComputadora = acumularPuntos(carta, puntosJugadoresLength);
            crearCarta(carta, puntosJugadoresLength);

        } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();
    };


    //Eventos

    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0)

        if (puntosJugador > 21) {
            console.warn('Lo siento mucho, perdiste');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            console.log('21, Genial');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
            // alert('21, Genial');
        }
    });


    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click', () => {

        console.clear();
        inicializarJuego();

    });

    return {
        nuevoJuego: inicializarJuego
    }

})();