/**
 * @since 2017-01-06 16:45
 * @author vivaxy
 */

import Listr from 'listr';

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
        `conf`,
        `lib`,
        `middlewares`,
        `.babelrc`,
        `.editorconfig`,
        `.gitignore`,
        `index.js`,
        `LICENSE`,
    ];

    await sleep(1000);
    await presets.copyFiles(files);
};

const updatePackageJSON = async() => {

    const {
        project,
        scaffold,
        presets,
    } = data;

    const projectGit = project.git || {};

    const filename = `package.json`;

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
            devDependencies: scaffoldDevDependencies,
            peerDependencies,
        } = data;

        const {
            listr: _, // remove
            devDependencies,
        } = scaffoldDevDependencies;

        return {
            name: project.name,
            version: `0.0.0`,
            gtScaffoldVersion: version,
            description,
            main,
            scripts,
            repository: {
                ...repository,
                url: projectGit.repositoryURL,
            },
            keywords,
            author,
            license,
            bugs: {
                ...bugs,
                url: undefined,
            },
            dependencies,
            devDependencies,
            peerDependencies,
        };

    });

};

const updateREADME = async() => {

    const {
        project,
        scaffold,
        presets,
    } = data;

    const filename = `README.md`;

    await sleep(1000);
    await presets.updateFile(filename, (data) => {
        const projectData = data.split(`----------\n\n`)[1];
        return projectData.replace(/gt-node-server/g, project.name);
    });

};

export const init = async(options) => {

    data = options;

    return new Listr([
        {
            title: `copy files`,
            task: copyFiles,
        },
        {
            title: `update package.json`,
            task: updatePackageJSON,
        },
        {
            title: `update README.md`,
            task: updateREADME,
        },
    ]);

};

export const after = async() => {
    console.log(`
    please exec following command to initialize your project

    - npm install

    then exec following command to start server

    - npm start
`);
};
