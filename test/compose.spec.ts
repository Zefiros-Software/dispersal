import { compose } from '~/compose'

test('one function', () => {
    expect(
        compose({
            transform: (x: number) => x + 1,
        }).transform(2)
    ).toEqual(3)
})

test('multiple functions', () => {
    expect(
        compose(
            {
                transform: (x: number) => x + 1,
            },
            {
                transform: (x: number) => x + 1,
            },
            {
                transform: (x: number) => x + 1,
            },
            {
                transform: (x: number) => x + 1,
            },
            {
                transform: (x: number) => x + 1,
            },
            {
                transform: (x: number) => x + 1,
            },
            {
                transform: (x: number) => x + 1,
            },
            {
                transform: (x: number) => x + 1,
            }
        ).transform(2)
    ).toEqual(10)
})

test('multiple types', () => {
    expect(
        compose(
            {
                transform: (x: number) => (x + 1).toString(),
            },
            {
                transform: x => x + 1,
            }
        ).transform(2)
    ).toEqual('31')
})

test('multiple descriptions', () => {
    expect(
        compose(
            {
                description: 'foo bar to',
                transform: (x: number) => (x + 1).toString(),
            },
            {
                description: 'foo bar one',
                transform: x => x + 1,
            }
        ).descriptions
    ).toEqual(['foo bar to', 'foo bar one'])
})

test('multiple descriptions 2', () => {
    expect(
        compose(
            {
                description: 'foo bar to',
                transform: (x: number) => (x + 1).toString(),
            },
            {
                transform: x => x + 1,
            }
        ).descriptions
    ).toEqual(['foo bar to'])
})

test('multiple descriptions 3', () => {
    expect(
        compose(
            {
                transform: (x: number) => (x + 1).toString(),
            },
            {
                description: 'foo bar one',
                transform: x => x + 1,
            }
        ).descriptions
    ).toEqual(['foo bar one'])
})
