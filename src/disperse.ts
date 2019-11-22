import { Migration } from '~/migration'
import { Change } from '~/change'

export class Disperse<Target, From> {
    public migrations: Migration<any>[]
    public versions: Record<string, number> = {}

    public constructor(migrations: Migration<any>[]) {
        this.migrations = migrations.sort((a, b) => a.version.localeCompare(b.version))
        this.versions = Object.fromEntries(this.migrations.map((m, i) => [m.version, i]))
    }

    public coerce<From>(obj: From, from: string): Target {
        if (this.versions[from] === undefined) {
            throw new Error(`Could not find version ${from}`)
        }
        let i = this.versions[from]
        for (; i < this.migrations.length; ++i) {
            obj = this.migrations[i].transform(obj)
        }
        return (obj as unknown) as Target
    }

    public get descriptions(): Array<{ version: string; changes: string[]; description: string | undefined }> {
        return this.migrations.map(m => ({
            version: m.version,
            description: m.description,
            changes: m.changes,
        }))
    }
}

export function disperse<Target>(t1: Omit<Change<Target, Target>, 'transformer'>): Disperse<Target, Target>
export function disperse<Target, From>(
    t1: Omit<Change<From, From>, 'transformer'>,
    t2: Change<From, Target>
): Disperse<Target, From>
export function disperse<Target, From, M1>(
    t1: Omit<Change<From, From>, 'transformer'>,
    t2: Change<From, M1>,
    t3: Change<M1, Target>
): Disperse<Target, From> | Disperse<Target, M1>
export function disperse<Target, From>(
    from: Omit<Change<From, any>, 'transformer'>,
    ...transformers: Change<any, any>[]
): Disperse<Target, From> {
    return new Disperse([from, ...transformers].map(t => new Migration(t)))
}
