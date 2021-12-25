const path = require('path')
const shell = require("shelljs");

const runShellCommand = (appOutDir) => {

    shell.exec(
        `chmod 4755 ${path.join(appOutDir, "chrome-sandbox")}`,

        function (code, stdout, stderr) {
            console.log('runShellCommand ==> Exit code:', code);
            if (stderr) {
                console.log('runShellCommand ==> Program stderr:', stderr);
            }
        });
}

async function doLinux(context) {

    console.log("Running doLinux ==> ");

    const { targets, appOutDir } = context

    targets.forEach(async target => {

        if (!["appimage", "snap"].includes(target.name.toLowerCase())) {

            await runShellCommand(appOutDir)
        }
    });
}

async function afterPack(context) {

    console.log("Running AfterPack");

    const electronPlatformName = context.electronPlatformName.toLowerCase();

    if (electronPlatformName.includes("linux")) {
        await doLinux(context);
        return;
    }

}

module.exports = afterPack
