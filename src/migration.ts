import { Change, RChange } from '~/change'
import { Transformer, TransformComposition, TransformType } from '~/transform'

export class Migration<Target> {
    private change: RChange<any, Target>
    public constructor(change: Change<any, Target> | Omit<Change<any, Target>, 'transformer'>) {
        let transformer: RChange<any, Target>['transformer'] = {
            transform: (x: any): Target => x,
        }

        const cchange = change as Change<any, Target>

        if (cchange.transformer) {
            if (typeof cchange.transformer === 'function') {
                transformer = {
                    transform: cchange.transformer,
                }
            } else {
                transformer = cchange.transformer
            }
        }
        // remove transformer from definition
        const { transformer: _, ...rest } = { transformer: undefined, ...change }

        this.change = {
            transformer,
            ...rest,
        }
    }

    public get description(): string | undefined {
        return this.change.description
    }

    public get changes(): string[] {
        if (this.isComposite(this.change.transformer)) {
            return this.change.transformer.descriptions
        }
        return []
    }

    public transform(obj: any): Target {
        return this.change.transformer.transform(obj)
    }

    public get version(): string {
        return this.change.version
    }

    public isComposite<In, Out>(transformer: Transformer<In, Out>): transformer is TransformComposition<In, Out> {
        return transformer.type === TransformType.Composite
    }
}
