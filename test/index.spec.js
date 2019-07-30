'use strict';

const yargs = require('yargs/yargs');
const parse = require('yargs-parser');
const minimist = require('minimist');
const unparse = require('../');

it('should unparse options whose values are primitives', () => {
    const argv = parse(['--no-boolean1', '--boolean2', '--number', '4', '--string', 'foo'], {
        number: 'number',
        string: 'string',
        boolean: ['boolean1', 'boolean2'],
    });

    expect(unparse(argv)).toEqual(['--no-boolean1', '--boolean2', '--number', '4', '--string', 'foo']);
});

it('should unparse options whose values are arrays', () => {
    const argv = parse(['--array1', '1', '2', '--array2', '3', '--array2', '4'], {
        array: ['array1', 'array2'],
    });

    expect(unparse(argv)).toEqual(['--array1', '1', '--array1', '2', '--array2', '3', '--array2', '4']);
});

it('should unparse options whose values are objects', () => {
    const argv = parse(['--foo.x', 'x', '--foo.y', 'y', '--foo.w', '1', '2', '--foo.z', '3', '--foo.z', '4'], {
        array: ['foo.w', 'foo.z'],
    });

    expect(unparse(argv)).toEqual(['--foo.x', 'x', '--foo.y', 'y', '--foo.w', '1', '--foo.w', '2', '--foo.z', '3', '--foo.z', '4']);
});

it('should unparse options whose values are not primitives, arrays or objects', () => {
    class Baz {
        toString() {
            return 'baz';
        }
    }

    const date = new Date(1502708276274);

    expect(unparse({
        foo: date,
        bar: /bar/,
        baz: new Baz(),
    })).toEqual(['--foo', date.toString(), '--bar', '/bar/', '--baz', 'baz']);
});

it('should unparse options whose values are empty strings correctly', () => {
    let argv = parse(['--string', ''], {
        string: 'string',
    });

    expect(unparse(argv)).toEqual(['--string', '']);

    argv = parse(['--string', '']);

    expect(unparse(argv)).toEqual(['--string', '']);
});

it('should only add a dash for short option names', () => {
    const argv = parse(['--n', '4', '--s', 'foo'], {
        number: 'n',
        string: 's',
    });

    expect(unparse(argv)).toEqual(['-n', '4', '-s', 'foo']);
});

it('should not duplicate keys that are camel-cased', () => {
    const argv = parse(['--some-string', 'foo']);

    expect(unparse(argv)).toEqual(['--some-string', 'foo']);
});

it('should keep camel-cased keys if standard ones were not found on argv', () => {
    const argv = parse(['--someNumber', '1']);

    expect(unparse(argv)).toEqual(['--someNumber', '1']);
});

it('should not duplicate nested keys that are camel-cased', () => {
    const argv = parse(['--paths.some-string', 'foo']);

    expect(unparse(argv)).toEqual(['--paths.some-string', 'foo']);
});

it('should keep nested camel-cased keys if standard ones were not found on argv', () => {
    const argv = parse(['--paths.someNumber', '1']);

    expect(unparse(argv)).toEqual(['--paths.someNumber', '1']);
});

it('should ignore nullish option values', () => {
    const argv = parse(['node', 'cli.js'], {
        number: 'n',
        string: 's',
    });

    expect(unparse(argv)).toEqual(['node', 'cli.js']);
});

it('should add unknown positional arguments at the start', () => {
    const argv = parse(['foo', '--string', 'bar']);

    expect(unparse(argv)).toEqual(['foo', '--string', 'bar']);
});

it('should add arguments after -- at the end', () => {
    const argv = parse(['--string', 'foo', '--', '--number', '1'], {
        configuration: {
            'populate--': true,
        },
    });

    expect(unparse(argv)).toEqual(['--string', 'foo', '--', '--number', '1']);
});

it('should ignore $0', () => {
    const argv = parse(['foo', '--string', 'bar']);

    argv.$0 = 'foo.js';

    expect(unparse(argv)).toEqual(['foo', '--string', 'bar']);
});

describe('options', () => {
    it('should ignore aliases specified via `options.aliases`', () => {
        const alias = {
            string: 's', // Single alias
            number: ['n', 'no'], // Multiple aliases
            substr: 'substring',
        };
        const argv = parse(['--string', 'foo', '--number', '1', '--substr', 'a'], { alias });

        expect(unparse(argv, { alias })).toEqual([
            '--string', 'foo',
            '--number', '1',
            '--substr', 'a',
        ]);
    });

    it('should filter flags with default values via `options.defaults`', () => {
        const defaults = { foo: false };
        const argv = parse([], { default: defaults });

        expect(unparse(argv, { default: defaults })).toEqual([]);
    });

    it('should handle known positional arguments specified via `options.command`', () => {
        const command = 'build <first> [second] [rest..]';
        const argv = yargs()
        .help(false)
        .version(false)
        .command(command, '', (yargs) => yargs, () => {})
        .parse(['build', 'foo', 'foz', 'bar', 'baz', '--string', 'hello']);

        expect(unparse(argv, {
            command,
        })).toEqual(['build', 'foo', 'foz', 'bar', 'baz', '--string', 'hello']);
    });

    it('should handle optional known positional arguments specified via `options.command`', () => {
        const command = 'build [first] [rest..]';
        const argv = yargs()
        .help(false)
        .version(false)
        .command(command, '', (yargs) => yargs, () => {})
        .parse(['build', '--string', 'hello']);

        expect(unparse(argv, {
            command,
        })).toEqual(['build', '--string', 'hello']);
    });

    it('should handle unknown positional arguments when `options.command` is set', () => {
        const command = 'build <first>';
        const argv = yargs()
        .help(false)
        .version(false)
        .command(command, '', (yargs) => yargs, () => {})
        .parse(['build', 'foo', 'foz', '--string', 'hello']);

        expect(unparse(argv, {
            command,
        })).toEqual(['build', 'foo', 'foz', '--string', 'hello']);
    });

    it('should handle positional arguments with alias specified in `options.command`', () => {
        const command = 'build <first|f>';
        const argv = yargs()
        .help(false)
        .version(false)
        .command(command, '', (yargs) => yargs, () => {})
        .parse(['build', 'foo', '--string', 'hello']);

        expect(unparse(argv, {
            command,
        })).toEqual(['build', 'foo', '--string', 'hello']);
    });
});

describe('interoperation with other libraries', () => {
    it('should have basic integration with minimist', () => {
        const argv = parse(['--no-cache', '--optimize', '--host', '0.0.0.0', '--collect', 'x', 'y'], {
            boolean: ['cache', 'optimize'],
            string: 'host',
            array: 'collect',
        });

        const argvArray = unparse(argv);

        expect(minimist(argvArray)).toMatchObject({
            cache: false,
            optimize: true,
            host: '0.0.0.0',
            collect: ['x', 'y'],
        });
    });
});
