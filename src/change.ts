import { Transform, TransformComposition, Pipe } from '~/transform'

export interface Change<In, Out, Version extends string> {
    in?: In
    version: Version
    description?: string
    transform: Transform<In, Out> | TransformComposition<In, Out> | Pipe<In, Out>
}

export interface RChange<In, Out, Version extends string> {
    version: Version
    description?: string
    transform: Transform<In, Out> | TransformComposition<In, Out>
}
