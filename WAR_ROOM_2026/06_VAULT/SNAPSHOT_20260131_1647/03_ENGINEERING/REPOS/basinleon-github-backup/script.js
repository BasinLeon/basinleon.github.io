document.addEventListener('DOMContentLoaded', () => {
    initTerminalEffect();
});

function initTerminalEffect() {
    const commands = [
        { text: "./initiate_gtm_sequence.sh --target='Seed_to_Series_A'", delay: 300 },
        { text: "> Loading modules...", delay: 800, class: "text-gray-400" },
        { text: "> GTM Architecture....... [DETECTED]", delay: 1200, class: "text-green-400" },
        { text: "> Revenue Operations..... [OPTIMIZED]", delay: 1600, class: "text-green-400" },
        { text: "> Signal Intelligence.... [ONLINE]", delay: 2000, class: "text-green-400" },
        { text: "System ready. Welcome, Architect.", delay: 2500, class: "text-blue-400 font-bold" }
    ];

    const commandContainer = document.querySelector('.typing-effect');
    if (!commandContainer) return;

    // Clear existing static content if we want a full replay, 
    // or we can append to it. Let's clear for a fresh boot effect.
    commandContainer.innerHTML = '<span class="text-green-400 mr-2">leon@basin:~$</span><span id="cursor" class="animate-pulse">_</span>';

    const cursor = document.getElementById('cursor');

    let totalDelay = 0;

    commands.forEach((cmd, index) => {
        setTimeout(() => {
            if (index === 0) {
                // Type out the first command character by character
                typeWriter(cmd.text, commandContainer, cursor);
            } else {
                // Print subsequent lines instantly like system logs
                const line = document.createElement('div');
                line.className = `mt-1 ${cmd.class || 'text-gray-300'}`;
                line.textContent = cmd.text;
                commandContainer.insertBefore(line, cursor);

                // Keep cursor at the end
                // cursor.remove();
                // commandContainer.appendChild(cursor);
            }
        }, totalDelay);

        if (index === 0) {
            totalDelay += (cmd.text.length * 50) + cmd.delay;
        } else {
            totalDelay += cmd.delay;
        }
    });
}

function typeWriter(text, container, cursor) {
    let i = 0;
    const speed = 30; // ms per char

    function type() {
        if (i < text.length) {
            const charSpan = document.createElement('span');
            charSpan.textContent = text.charAt(i);
            charSpan.className = "text-gray-200";
            container.insertBefore(charSpan, cursor);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}
