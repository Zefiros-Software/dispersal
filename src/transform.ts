export type TranformTo<M extends { transform: any }> = ReturnType<M['transform']>

export enum TransformType {
    Singular,
    Composite,
}

export type Pipe<In, Out> = (arg: In) => Out
export type Transformer<In, Out> = Transform<In, Out> | TransformComposition<In, Out>

export interface Transform<In, Out> {
    type?: TransformType.Singular
    description?: string
    transform: Pipe<In, Out>
    //itransform?: (arg: Out) => In
}
export interface TransformComposition<In, Out> {
    type: TransformType.Composite
    descriptions: string[]
    transform: Pipe<In, Out>
    //itransform?: (arg: Out) => In
}
