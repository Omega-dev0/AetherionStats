const HTMLConstants = {
    "topbar":`<div class="topbar">
                <div class="logo">
                    <img src="/files/AetherionLogo320x320.png" alt="logo" style="height: 60px; width: 60px; margin-left: 10px; margin-top: 0px;">
                </div>
                <a style="color: white; margin-left: 1vw; font-family: 'GT Walsheim Bold', 'GT Walsheim Bold Placeholder', sans-serif; text-decoration:none; font-size:3rem" href="/home">Aetherion</a>
</div>`
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
        <link rel="icon" href="/favicon">
        <link rel="stylesheet" href="/files/main.css">
        <meta property="og:title" content="${title}" />
        <meta name="theme-color" content="#34d5eb">
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