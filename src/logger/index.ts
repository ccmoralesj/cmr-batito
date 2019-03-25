import tracer from 'tracer';
import sourceMap from 'source-map-support';

sourceMap.install({
    environment: 'node',
});

const newLineSeparator = process.env.CGS_CLUSTER ? '\r' : '\n';

export default tracer.colorConsole({
    format: [
        '<{{title}}> {{message}} ({{method}}) (in {{path}}:{{line}})', // default
        {
            error: `<{{title}}> {{message}} ({{method}}) (in {{path}}:{{line}})${newLineSeparator}{{stacklist}}`,
            info: '<{{title}}> {{message}} (in {{file}}:{{line}})',
            log: '<{{title}}> {{message}} (in {{file}}:{{line}})',
        },
    ] as any,
    level: 'trace',
    preprocess: function preprocess(data: any) {
        if (process.env.CGS_CLUSTER) {
            Object.keys(data.args).forEach(arg => {
                if (typeof data.args[arg] === 'string') {
                    data.args[arg] = data.args[arg].split('\n').join('\r');
                } else if (typeof data.args[arg] === 'object') {
                    data.args[arg] = JSON.stringify(data.args[arg], null, 2)
                        .split('\n')
                        .join('\r');
                }
            });
        }

        if (data.title !== 'error') {
            return;
        }

        let stack = data.stack;

        // First argument is an error object
        if (typeof data.args[0] === 'object' && data.args[0].stack) {
            stack = data.args[0].stack.split('\n');
            data.args[0] = stack.shift();
        } else if (['boolean', 'number', 'string'].indexOf(typeof data.stack) !== -1) {
            stack = [data.stack] as any;
        }

        data.stacklist = stack.join(newLineSeparator);
    },
});
