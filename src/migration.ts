import { Change, RChange } from '~/change'
import { Transformer, TransformComposition, TransformType } from '~/transform'

export class Migration<Target> {
    private change: RChange<any, Target, string>
    public constructor(change: Change<any, Target, string> | Omit<Change<any, Target, string>, 'transform'>) {
        let transform: RChange<any, Target, string>['transform'] = {
            transform: (x: any): Target => x,
        }

        const cchange = change as Change<any, Target, string>

        if (cchange.transform) {
            if (typeof cchange.transform === 'function') {
                transform = {
                    transform: cchange.transform,
                }
            } else {
                transform = cchange.transform
            }
        }
        // remove transform from definition
        const { transform: _, ...rest } = { transform: undefined, ...change }

        this.change = {
            transform,
            ...rest,
        }
    }

    public get description(): string | undefined {
        return this.change.description
    }

    public get changes(): string[] {
        if (this.isComposite(this.change.transform)) {
            return this.change.transform.descriptions
        }
        return []
    }

    public transform(obj: any): Target {
        return this.change.transform.transform(obj)
    }

    public get version(): string {
        return this.change.version
    }

    public isComposite<In, Out>(transformer: Transformer<In, Out>): transformer is TransformComposition<In, Out> {
        return transformer.type === TransformType.Composite
    }
}
