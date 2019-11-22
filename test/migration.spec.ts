import { Migration } from '~/migration'
import { compose } from '~/index'

test('migration', () => {
    const migration = new Migration({
        version: '1',
        description: 'foo',
        transformer: {
            transform: (x: number) => x + 1,
        },
    })
    expect(migration.changes).toMatchInlineSnapshot(`Array []`)
    expect(migration.description).toMatchInlineSnapshot(`"foo"`)
    expect(migration.version).toEqual('1')
    expect(migration.transform(1)).toEqual(2)
})

test('migration no description', () => {
    const migration = new Migration({
        version: '1',
        transformer: {
            transform: (x: number) => x + 1,
        },
    })
    expect(migration.changes).toMatchInlineSnapshot(`Array []`)
    expect(migration.description).toMatchInlineSnapshot(`undefined`)
    expect(migration.version).toEqual('1')
    expect(migration.transform(1)).toEqual(2)
})

test('composite migration', () => {
    const migration = new Migration({
        version: '1',
        description: 'foo',
        transformer: compose(
            {
                description: 'foo bar to',
                transform: (x: number) => (x + 1).toString(),
            },
            {
                description: 'foo bar one',
                transform: x => x + 1,
            }
        ),
    })
    expect(migration.changes).toMatchInlineSnapshot(`
        Array [
          "foo bar to",
          "foo bar one",
        ]
    `)
    expect(migration.description).toMatchInlineSnapshot(`"foo"`)
    expect(migration.version).toEqual('1')
    expect(migration.transform(1)).toEqual('21')
})
