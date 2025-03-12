export interface LoadingProps {
    roomNumber: string;
}

const Loading = (props: LoadingProps) => {

    return (
        <div>
            <h1>Loading room {props.roomNumber}...</h1>
            <div style={{ textAlign: "center" }}>
                <progress value={undefined} />
            </div>
        </div>
    );
}

export default Loading;