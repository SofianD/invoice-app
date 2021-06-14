const electronInstaller = require('electron-winstaller');

app();

setTimeout(function (){
    return process.exit();
}, 60000);

async function app() {
    try {
        await electronInstaller.createWindowsInstaller({
            appDirectory: __dirname + '/out/invoice-win32-x64',
            outputDirectory: '/tmp/build/installer64',
            authors: 'My App Inc.',
            exe: 'invoice.exe'
        });
        console.log('It worked!');
        return;
        } catch (e) {
        console.log(e.message);
        return;
    }
}