export function mhtmExtractAlts(text) {
    const altRegex = /alt=3D"([^"]*)"/g;
    let match;
    let fullText = '';
    let index = 1;
    while ((match = altRegex.exec(text)) !== null) {
        let altText = match[1];
        if (altText) {
            altText = altText.replace(/&#10/g, ' ');
            altText = altText.replace(/=\r\n/g, '');
            fullText = fullText + `\nLESSON${index}\n` + altText;
            index++;
        }
    }
    return fullText;
}
