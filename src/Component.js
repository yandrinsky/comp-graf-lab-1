import {useKIOState} from "./KIO/use-KIO-state";

export const MyComponent = () => {
    const [stateN,] = useKIOState(false, '1337');

    return (
        <h1>MyComponent state: {stateN ? 'true' : 'false'}</h1>
    )
}