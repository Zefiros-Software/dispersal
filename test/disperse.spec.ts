import { disperse, compose } from '~/index'

describe('transform 2 versions', () => {
    interface ObjV20191108 {
        from: string
    }
    interface ObjV20191109 {
        to: {
            fromage: string
        }
    }

    const disp = disperse(
        {
            version: '2019-11-08',
            description: 'initial version',
        },
        {
            version: '2019-11-09',
            transformer: compose(
                {
                    description: 'migrate `from` to `to`',
                    transform: (from: ObjV20191108) => ({
                        to: from.from,
                    }),
                },
                {
                    description: 'change `from` type',
                    transform: (from): ObjV20191109 => ({
                        to: {
                            fromage: from.to,
                        },
                    }),
                }
            ),
        }
    )
    test('coerce', () => {
        expect(disp.coerce({ from: 'boo' }, '2019-11-08')).toMatchInlineSnapshot(`
                    Object {
                      "to": Object {
                        "fromage": "boo",
                      },
                    }
            `)
    })

    test('descriptions', () => {
        expect(disp.descriptions).toMatchInlineSnapshot(`
            Array [
              Object {
                "changes": Array [],
                "description": "initial version",
                "version": "2019-11-08",
              },
              Object {
                "changes": Array [
                  "migrate \`from\` to \`to\`",
                  "change \`from\` type",
                ],
                "description": undefined,
                "version": "2019-11-09",
              },
            ]
        `)
    })
})

describe('transform 3 versions', () => {
    interface ObjVersions {
        ['2019-11-06']: {
            foo: number
        }
        ['2019-11-08']: {
            from: string
        }
        ['2019-11-09']: {
            to: {
                fromage: string
            }
        }
    }

    type Obj = ObjVersions['2019-11-09']

    const disp = disperse(
        {
            version: '2019-11-06',
            description: 'initial version',
        },
        {
            version: '2019-11-08',
            description: 'initial version',
            transformer: (from: ObjVersions['2019-11-06']) => ({
                from: from.foo.toString(),
            }),
        },
        {
            version: '2019-11-09',
            transformer: compose(
                {
                    description: 'migrate `from` to `to`',
                    transform: from => ({
                        to: from.from,
                    }),
                },
                {
                    description: 'change `from` type',
                    transform: (from): Obj => ({
                        to: {
                            fromage: from.to,
                        },
                    }),
                }
            ),
        }
    )

    test('', () => {
        expect(disp.coerce({ foo: 8 }, '2019-11-06')).toMatchInlineSnapshot(`
                    Object {
                      "to": Object {
                        "fromage": "8",
                      },
                    }
            `)
    })
})
