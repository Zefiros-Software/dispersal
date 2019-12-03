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

    const disp = disperse.up(
        {
            version: '2019-11-08',
            transform: compose(
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
        },
        {
            version: '2019-11-09',
            description: 'latest version',
        }
    )
    test('coerce', () => {
        expect(disp.coerce({ target: { from: 'boo' }, version: '2019-11-08' })).toMatchInlineSnapshot(`
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
                "changes": Array [
                  "migrate \`from\` to \`to\`",
                  "change \`from\` type",
                ],
                "description": undefined,
                "version": "2019-11-08",
              },
              Object {
                "changes": Array [],
                "description": "latest version",
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

    const disp = disperse.up(
        {
            version: '2019-11-06',
            description: 'initial version',
            transform: (from: ObjVersions['2019-11-06']) => ({
                from: from.foo.toString(),
            }),
        },
        {
            version: '2019-11-08',
            transform: compose(
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
        },
        {
            version: '2019-11-09',
            description: 'newest version',
        }
    )

    test('from version 1', () => {
        const result: Obj = disp.coerce({ target: { foo: 8 }, version: '2019-11-06' })
        expect(result).toMatchInlineSnapshot(`
                    Object {
                      "to": Object {
                        "fromage": "8",
                      },
                    }
            `)
    })

    test('from version 2', () => {
        const result: Obj = disp.coerce({ target: { from: '8' }, version: '2019-11-08' })
        expect(result).toMatchInlineSnapshot(`
                    Object {
                      "to": Object {
                        "fromage": "8",
                      },
                    }
            `)
    })

    test('from version 3', () => {
        const result: Obj = disp.coerce({ target: { to: { fromage: '8' } }, version: '2019-11-09' })
        expect(result).toMatchInlineSnapshot(`
                Object {
                  "to": Object {
                    "fromage": "8",
                  },
                }
        `)
    })
})

describe('transform 3 versions api downgrade', () => {
    interface ObjVersions {
        ['2019-11-09']: {
            to: {
                fromage: string
            }
        }
        ['2019-11-08']: {
            from: string
        }
        ['2019-11-06']: {
            foo: number
        }
    }

    type Obj = ObjVersions['2019-11-09']

    const disp = disperse.down(
        {
            version: '2019-11-09',
            description: 'newest version',
        },
        {
            version: '2019-11-08',
            transform: compose(
                {
                    description: 'change `from` type',
                    transform: (from: Obj) => ({
                        to: {
                            from: from.to.fromage,
                        },
                    }),
                },
                {
                    description: 'migrate `from` to `to`',
                    transform: from => ({
                        from: from.to.from,
                    }),
                }
            ),
        },
        {
            version: '2019-11-06',
            description: 'initial version',
            transform: (from): ObjVersions['2019-11-06'] => ({
                foo: parseInt(from.from),
            }),
        }
    )

    test('from version 1', () => {
        const result: ObjVersions['2019-11-06'] = disp.coerce({ from: { to: { fromage: '8' } }, version: '2019-11-06' })
        expect(result).toMatchInlineSnapshot(`
                    Object {
                      "foo": 8,
                    }
            `)
    })

    test('from version 2', () => {
        const result: ObjVersions['2019-11-08'] = disp.coerce({ from: { to: { fromage: '8' } }, version: '2019-11-08' })
        expect(result).toMatchInlineSnapshot(`
                    Object {
                      "from": "8",
                    }
            `)
    })

    test('from version 3', () => {
        const result: ObjVersions['2019-11-09'] = disp.coerce({ from: { to: { fromage: '8' } }, version: '2019-11-09' })
        expect(result).toMatchInlineSnapshot(`
                Object {
                  "to": Object {
                    "fromage": "8",
                  },
                }
        `)
    })
})
