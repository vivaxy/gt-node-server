/**
 * @since 2017-03-21 16:04:13
 * @author vivaxy
 */

const Listr = require('listr');

const sleep = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};

let data;

const copyFiles = async() => {

    const {
        presets,
    } = data;

    const files = [
        'conf',
        'lib',
        'middlewares',
        '.editorconfig',
        '.gitignore',
        '.npmrc',
        'index.js',
        'LICENSE',
        'yarn.lock',
    ];

    await sleep(1000);
    await presets.copyFiles(files);
};

const updatePackageJSON = async() => {

    const {
        project,
        presets,
    } = data;

    const projectGit = project.git || {};

    const filename = 'package.json';

    await sleep(1000);
    await presets.updateJson(filename, (data) => {

        const {
            name,
            version,
            description,
            main,
            scripts,
            repository,
            keywords,
            author,
            license,
            bugs,
            homepage,
            dependencies,
            devDependencies,
            peerDependencies,
        } = data;

        Reflect.deleteProperty(devDependencies, 'listr');
        Reflect.deleteProperty(devDependencies, 'standard-version');
        Reflect.deleteProperty(scripts, 'release');

        return {
            name: project.name,
            version: '0.0.0',
            gtScaffoldVersion: version,
            description,
            main,
            scripts,
            repository: Object.assign(repository, {
                url: projectGit.repositoryURL,
            }),
            keywords,
            author,
            license,
            bugs: Object.assign(bugs, {
                url: undefined,
            }),
            dependencies,
            devDependencies,
            peerDependencies,
        };

    });

};

const updateREADME = async() => {

    const {
        project,
        presets,
    } = data;

    const filename = 'README.md';

    await sleep(1000);
    await presets.updateFile(filename, (data) => {
        const projectData = data.split('----------\n\n')[1];
        return projectData.replace(/gt-node-server/g, `${project.name}

Initialized by [vivaxy/gt-node-server](https://github.com/vivaxy/gt-node-server)`);
    });

};

const updateCHANGELOG = async() => {
    const {
        presets,
    } = data;

    const filename = 'CHANGELOG.md';

    await sleep(1000);
    await presets.updateFile(filename, () => {
        return '';
    });
};

exports.init = async(options) => {

    data = options;

    return new Listr([
        {
            title: 'copy files',
            task: copyFiles,
        },
        {
            title: 'update package.json',
            task: updatePackageJSON,
        },
        {
            title: 'update README.md',
            task: updateREADME,
        },
        {
            title: 'update CHANGELOG.md',
            task: updateCHANGELOG,
        }
    ]);

};

exports.after = async() => {
    console.log(`
    please exec following command to initialize your project

    - yarn install

    then exec following command to start dev server

    - yarn run dev
`);
};
