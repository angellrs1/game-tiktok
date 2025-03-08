const socket = new WebSocket("ws://localhost:21213/");
// Variables del juego
let palabraSecreta = "dragón";
let ganador = false;
let jugadores = {};

// Conexión WebSocket
socket.onopen = () => {
    console.log("Conectado al WebSocket de TikFinity");
};

socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    
    if (message.event === "chat") {
        const username = message.data.username;
        const userMessage = message.data.comment.toLowerCase();

        // Lógica de "Adivina la palabra"
        if (userMessage === palabraSecreta && !ganador) {
            document.getElementById("game-status").innerText = `¡${username} ha adivinado la palabra!`;
            ganador = true;
        }

        // Lógica de "Batalla en el chat"
        if (!jugadores[username]) {
            jugadores[username] = { vida: 100 };
        }
        if (userMessage.startsWith("!ataque")) {
            let objetivo = userMessage.split(" ")[1];
            if (jugadores[objetivo]) {
                jugadores[objetivo].vida -= 10;
                document.getElementById("battle-status").innerText = `${username} atacó a ${objetivo}. Vida restante: ${jugadores[objetivo].vida}`;
                if (jugadores[objetivo].vida <= 0) {
                    document.getElementById("battle-status").innerText += `\n${objetivo} ha sido derrotado.`;
                }
            }
        }
    }
};

// Interfaz en HTML
const app = document.createElement("div");
app.innerHTML = `
    <style>
        body { font-family: Arial, sans-serif; background: black; color: white; text-align: center; }
        .game-container { padding: 20px; }
        .status { font-size: 20px; margin: 10px; }
    </style>
    <div class="game-container">
        <h1>Juego Interactivo TikTok</h1>
        <p class="status" id="game-status">Adivina la palabra secreta...</p>
        <p class="status" id="battle-status">Batalla en curso...</p>
    </div>
`;
document.body.appendChild(app);
