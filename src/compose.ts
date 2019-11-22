import { Transform, TransformComposition, TransformType } from '~/transform'

export function compose<In, Out>(f1: Transform<In, Out>): TransformComposition<In, Out>
export function compose<In, Out, T1>(f1: Transform<In, T1>, f2: Transform<T1, Out>): TransformComposition<In, Out>
export function compose<In, Out, T1, T2>(
    f1: Transform<In, T1>,
    f2: Transform<T1, T2>,
    f3: Transform<T2, Out>
): TransformComposition<In, Out>
export function compose<In, Out, T1, T2, T3>(
    f1: Transform<In, T1>,
    f2: Transform<T1, T2>,
    f3: Transform<T2, T3>,
    f4: Transform<T3, Out>
): TransformComposition<In, Out>
export function compose<In, Out, T1, T2, T3, T4>(
    f1: Transform<In, T1>,
    f2: Transform<T1, T2>,
    f3: Transform<T2, T3>,
    f4: Transform<T3, T4>,
    f5: Transform<T4, Out>
): TransformComposition<In, Out>
export function compose<In, Out, T1, T2, T3, T4, T5>(
    f1: Transform<In, T1>,
    f2: Transform<T1, T2>,
    f3: Transform<T2, T3>,
    f4: Transform<T3, T4>,
    f5: Transform<T4, T5>,
    f6: Transform<T5, Out>
): TransformComposition<In, Out>
export function compose<In, Out, T1, T2, T3, T4, T5, T6>(
    f1: Transform<In, T1>,
    f2: Transform<T1, T2>,
    f3: Transform<T2, T3>,
    f4: Transform<T3, T4>,
    f5: Transform<T4, T5>,
    f6: Transform<T5, T6>,
    f7: Transform<T6, Out>
): TransformComposition<In, Out>
export function compose<In, Out, T1, T2, T3, T4, T5, T6, T7>(
    f1: Transform<In, T1>,
    f2: Transform<T1, T2>,
    f3: Transform<T2, T3>,
    f4: Transform<T3, T4>,
    f5: Transform<T4, T5>,
    f6: Transform<T5, T6>,
    f7: Transform<T6, T7>,
    f8: Transform<T7, Out>
): TransformComposition<In, Out>
export function compose<In, Out, T1, T2, T3, T4, T5, T6, T7, T8>(
    f1: Transform<In, T1>,
    f2: Transform<T1, T2>,
    f3: Transform<T2, T3>,
    f4: Transform<T3, T4>,
    f5: Transform<T4, T5>,
    f6: Transform<T5, T6>,
    f7: Transform<T6, T7>,
    f8: Transform<T7, T8>,
    f9: Transform<T8, Out>
): TransformComposition<In, Out>
export function compose<In, Out, T1, T2, T3, T4, T5, T6, T7, T8>(
    f1: Transform<In, T1>,
    f2: Transform<T1, T2>,
    f3: Transform<T2, T3>,
    f4: Transform<T3, T4>,
    f5: Transform<T4, T5>,
    f6: Transform<T5, T6>,
    f7: Transform<T6, T7>,
    f8: Transform<T7, T8>,
    f9: Transform<T8, any>,
    ...fns: Transform<any, any>[]
): TransformComposition<In, Out>
export function compose(...fns: Transform<any, any>[]): TransformComposition<any, any> {
    return {
        type: TransformType.Composite,
        descriptions: fns.map(x => x.description).filter(x => x !== undefined) as string[],
        transform: fns.map(x => x.transform).reduce((prevFn, nextFn) => (value: any) => nextFn(prevFn(value))),
    }
}
