const HTMLConstants = {
    "topbar":`<div class="topbar">
                <div class="logo">
                    <img src="/files/AetherionLogo320x320.png" alt="logo" class="logo-image">
                </div>
                <a class="topbar-title bold" href="/home" style="border:none">Aetherion</a>
                <a class="topbar-title" style="" href="/leaderboards">Leaderboards</a>
                <a class="topbar-title" style="" href="https://www.roblox.com/games/13630165489/Aetherion">Play now</a>
                </div>
`
}




let module = {
    /**
     * @param {string} title
     * @returns {string}
    */
    getMetadataHTML: function (title) {
        return `
        <meta charset="utf-8">
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="author" content="Omega77073">
        <meta name="theme-color" content="#36393F">
        <link rel="icon" href="/favicon">
        <link rel="stylesheet" href="/files/main.css">
        <meta property="og:title" content="${title}" />
        `;  

    },

    /**
     * @param {string} html
     * @returns {string}
    */
    replaceConstants: function (html) {
        let result = html;

        for (const [key, value] of Object.entries(HTMLConstants)) {
            result = result.replaceAll(`{{${key}}}`, value);
        }

        return result;
    }
};

export default module;