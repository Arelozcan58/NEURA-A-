const WORKER_URL = "https://neura.ozcanarel25.workers.dev"; // URL'ini teyit et!

let chatHistory = JSON.parse(localStorage.getItem('neura_history')) || [];

window.onload = () => {
    if(chatHistory.length > 0) {
        chatHistory.forEach(m => renderMessage(m.role, m.content));
    } else {
        addMessage('assistant', "Merhaba! Ben Neura. Nasıl yardımcı olabilirim?");
    }
};

async function sendMessage() {
    const input = document.getElementById('userInput');
    const btn = document.getElementById('sendBtn');
    const text = input.value.trim();

    if (!text) return;

    // Uzunluk Analizi ve Mesaj Ekleme
    addMessage('user', text);
    input.value = "";
    btn.disabled = true;

    try {
        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: chatHistory })
        });

        const data = await response.json();
        
        if(data.error) throw new Error(data.error);

        const aiMsg = data.choices[0].message.content;
        addMessage('assistant', aiMsg);
        localStorage.setItem('neura_history', JSON.stringify(chatHistory));

    } catch (err) {
        addMessage('assistant', "Bağlantı Hatası: " + err.message);
    } finally {
        btn.disabled = false;
    }
}

function addMessage(role, content) {
    chatHistory.push({ role, content });
    renderMessage(role, content);
}

function renderMessage(role, content) {
    const chatBox = document.getElementById('chatBox');
    const div = document.createElement('div');
    div.className = `p-3 rounded-lg max-w-[85%] ${role === 'user' ? 'bg-blue-600 ml-auto' : 'bg-slate-700 mr-auto'}`;
    div.innerText = content;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChat() {
    localStorage.removeItem('neura_history');
    location.reload();
}

document.getElementById('userInput').addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });
