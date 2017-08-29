'use strict';

const parse = require('yargs-parser');
const unparse = require('../');

it('should unparse options whose values are primitives', () => {
    const argv = parse(['node', 'cli.js', '--no-boolean1', '--boolean2', '--number', '4', '--string', 'foo'], {
        number: 'number',
        string: 'string',
        boolean: ['boolean1', 'boolean2'],
    });

    expect(unparse(argv)).toEqual(['node', 'cli.js', '--no-boolean1', '--boolean2', '--number', '4', '--string', 'foo']);
});

it('should unparse options whose values are arrays', () => {
    const argv = parse(['node', 'cli.js', '--array1', '1', '2', '--array2', '3', '--array2', '4'], {
        array: ['array1', 'array2'],
    });

    expect(unparse(argv)).toEqual(['node', 'cli.js', '--array1', '1', '2', '--array2', '3', '4']);
});

it('should unparse options whose values are objects', () => {
    const argv = parse(['node', 'cli.js', '--foo.x', 'x', '--foo.y', 'y', '--foo.w', '1', '2', '--foo.z', '3', '--foo.z', '4'], {
        array: ['foo.w', 'foo.z'],
    });

    expect(unparse(argv)).toEqual(['node', 'cli.js', '--foo.x', 'x', '--foo.y', 'y', '--foo.w', '1', '2', '--foo.z', '3', '4']);
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
    let argv = parse(['node', 'cli.js', '--string', ''], {
        string: 'string',
    });

    expect(unparse(argv)).toEqual(['node', 'cli.js', '--string', '']);

    argv = parse(['node', 'cli.js', '--string', '']);

    expect(unparse(argv)).toEqual(['node', 'cli.js', '--string', '']);
});

it('should only add a dash for short option names', () => {
    const argv = parse(['node', 'cli.js', '--n', '4', '--s', 'foo'], {
        number: 'n',
        string: 's',
    });

    expect(unparse(argv)).toEqual(['node', 'cli.js', '-n', '4', '-s', 'foo']);
});

it('should not duplicate keys that are camel-cased', () => {
    const argv = parse(['node', 'cli.js', '--some-string', 'foo']);

    expect(unparse(argv)).toEqual(['node', 'cli.js', '--some-string', 'foo']);
});

it('should keep camel-cased keys if standard ones were not found on argv', () => {
    const argv = parse(['node', 'cli.js', '--someNumber', '1']);

    expect(unparse(argv)).toEqual(['node', 'cli.js', '--someNumber', '1']);
});

it('should ignore nullish option values', () => {
    const argv = parse(['node', 'cli.js'], {
        number: 'n',
        string: 's',
    });

    expect(unparse(argv)).toEqual(['node', 'cli.js']);
});

it('should add positional arguments at the start', () => {
    const argv = parse(['node', 'cli.js', 'foo', '--string', 'bar']);

    expect(unparse(argv)).toEqual(['node', 'cli.js', 'foo', '--string', 'bar']);
});

it('should add arguments after -- at the end', () => {
    const argv = parse(['node', 'cli.js', '--string', 'foo', '--', '--number', '1'], {
        configuration: {
            'populate--': true,
        },
    });

    expect(unparse(argv)).toEqual(['node', 'cli.js', '--string', 'foo', '--', '--number', '1']);
});

it('should ignore $0', () => {
    const argv = parse(['node', 'cli.js', 'foo', '--string', 'bar']);

    argv.$0 = 'foo.js';

    expect(unparse(argv)).toEqual(['node', 'cli.js', 'foo', '--string', 'bar']);
});

it('should ignore aliases', () => {
    const alias = {
        string: 's', // Single alias
        number: ['n', 'no'], // Multiple aliases
    };
    const argv = parse(['node', 'cli.js', '--string', 'foo', '--number', '1'], { alias });

    expect(unparse(argv, { alias })).toEqual(['node', 'cli.js', '--string', 'foo', '--number', '1']);
});
