import { PythonShell } from 'python-shell';

function main() {
    const options = {
        scriptPath: __dirname,
        args: ['-v'],
    };
    PythonShell.run('main.py', options, (err, results) => {
        if (err) throw err;
       	console.log('results: %j', results);
    });
}

main();
