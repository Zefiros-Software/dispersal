import { Migration } from '~/migration'
import { Change } from '~/change'

export type DisperseTarget<Target, Version> = {
    version: Version
    target: Target
}

export class DisperseUp<Target, Versions extends { target: any; version: string }> {
    public migrations: Migration<any>[]
    public versions: Record<string, number> = {}

    public constructor(migrations: Migration<any>[]) {
        this.migrations = migrations.sort((a, b) => a.version.localeCompare(b.version))
        this.versions = Object.fromEntries(this.migrations.map((m, i) => [m.version, i]))
    }

    public coerce(target: Versions): Target {
        if (this.versions[target.version] === undefined) {
            throw new Error(`Could not find version ${target.version}`)
        }
        let i = this.versions[target.version]
        for (; i < this.migrations.length; ++i) {
            target.target = this.migrations[i].transform(target.target)
        }
        return (target.target as unknown) as Target
    }

    public get descriptions(): Array<{ version: string; changes: string[]; description: string | undefined }> {
        return this.migrations.map(m => ({
            version: m.version,
            description: m.description,
            changes: m.changes,
        }))
    }
}

export type DisperseFrom<From, Version> = {
    version: Version
    from: From
}
type ExtractVersion<A, T> = A extends { version: T } ? A : never

export class DisperseDown<From, Versions extends { from: any; version: string }> {
    public migrations: Migration<any>[]
    public versions: Record<string, number> = {}

    public constructor(migrations: Migration<any>[]) {
        this.migrations = migrations.sort((a, b) => -a.version.localeCompare(b.version))
        this.versions = Object.fromEntries(this.migrations.map((m, i) => [m.version, i]))
    }

    public coerce<Version>(from: {
        from: From
        version: Version & Versions['version']
    }): ExtractVersion<Versions, Version>['from'] {
        if (this.versions[from.version] === undefined) {
            throw new Error(`Could not find version ${from.version}`)
        }
        for (let i = 0; i <= this.versions[from.version]; ++i) {
            from.from = this.migrations[i].transform(from.from)
        }
        return (from.from as unknown) as Versions['from']
    }

    public get descriptions(): Array<{ version: string; changes: string[]; description: string | undefined }> {
        return this.migrations.map(m => ({
            version: m.version,
            description: m.description,
            changes: m.changes,
        }))
    }
}

export function disperseUp<Target, TVersion extends string>(
    t1: Omit<Change<Target, Target, TVersion>, 'transform'>
): DisperseUp<Target, DisperseTarget<Target, TVersion>>
export function disperseUp<Target, From, TVersion extends string, FVersion extends string>(
    t1: Change<From, Target, FVersion>,
    t2: Omit<Change<Target, Target, TVersion>, 'transform'>
): DisperseUp<Target, DisperseTarget<Target, TVersion> | DisperseTarget<From, FVersion>>
export function disperseUp<Target, From, TVersion extends string, FVersion extends string, M1, M1Version extends string>(
    t1: Change<From, M1, FVersion>,
    t2: Change<M1, Target, M1Version>,
    t3: Omit<Change<Target, Target, TVersion>, 'transform'>
): DisperseUp<Target, DisperseTarget<Target, TVersion> | DisperseTarget<From, FVersion> | DisperseTarget<M1, M1Version>>
export function disperseUp<
    Target,
    From,
    TVersion extends string,
    FVersion extends string,
    M1,
    M1Version extends string,
    M2,
    M2Version extends string
>(
    t1: Change<From, M1, FVersion>,
    t2: Change<M1, M2, M1Version>,
    t3: Change<M2, Target, M2Version>,
    t4: Omit<Change<Target, Target, TVersion>, 'transform'>
): DisperseUp<Target, DisperseTarget<Target, TVersion> | DisperseTarget<From, FVersion> | DisperseTarget<M1, M1Version>>
export function disperseUp<Target, From, FVersion extends string>(
    ...transformers: (Change<any, any, string> | any)[]
): DisperseUp<Target, DisperseTarget<From, FVersion>> {
    return new DisperseUp(transformers.map(t => new Migration(t)))
}

export function disperseDown<From, FVersion extends string>(
    t1: Omit<Change<From, From, FVersion>, 'transform'>
): DisperseDown<From, DisperseFrom<From, FVersion>>
export function disperseDown<From, Target, FVersion extends string, TVersion extends string>(
    t1: Omit<Change<From, From, FVersion>, 'transform'>,
    t2: Change<From, Target, FVersion>
): DisperseDown<From, DisperseFrom<Target, TVersion> | DisperseFrom<From, FVersion>>
export function disperseDown<From, Target, FVersion extends string, TVersion extends string, M1, M1Version extends string>(
    t1: Omit<Change<From, From, FVersion>, 'transform'>,
    t2: Change<From, M1, M1Version>,
    t3: Change<M1, Target, TVersion>
): DisperseDown<From, DisperseFrom<Target, TVersion> | DisperseFrom<From, FVersion> | DisperseFrom<M1, M1Version>>
export function disperseDown<
    From,
    Target,
    FVersion extends string,
    TVersion extends string,
    M1,
    M1Version extends string,
    M2,
    M2Version extends string
>(
    t1: Omit<Change<From, From, FVersion>, 'transform'>,
    t2: Change<From, M1, M1Version>,
    t3: Change<M1, M2, M2Version>,
    t4: Change<M2, Target, TVersion>
): DisperseDown<From, DisperseFrom<Target, TVersion> | DisperseFrom<From, FVersion> | DisperseFrom<M1, M1Version>>
export function disperseDown<From, Target, TVersion extends string>(
    ...transformers: (Change<any, any, string> | any)[]
): DisperseDown<Target, DisperseFrom<From, TVersion>> {
    return new DisperseDown(transformers.map(t => new Migration(t)))
}

export const disperse = {
    up: disperseUp,
    down: disperseDown,
}
