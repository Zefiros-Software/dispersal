import { Transform, TransformComposition, Pipe } from '~/transform'

export interface Change<In, Out> {
    version: string
    description?: string
    transformer: Transform<In, Out> | TransformComposition<In, Out> | Pipe<In, Out>
}

export interface RChange<In, Out> {
    version: string
    description?: string
    transformer: Transform<In, Out> | TransformComposition<In, Out>
}
