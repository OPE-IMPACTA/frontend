const files = [
    'click',
    'fill',
    'submit',
    'assert',
];

module.exports = () => {
    let importeds = {};

    files.forEach(file => {
        let name = file.charAt(0).toUpperCase() + file.slice(1);

        importeds[`Action${name}Component`] = () => import(`./${file}`);
    });

    return importeds;
}
