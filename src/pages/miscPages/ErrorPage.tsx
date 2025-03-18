import {NavLink} from "react-router-dom";


const ErrorPage = () => {
    return (
        <div>
            <h1>404 Error: Not found</h1>
            <div style={ {padding: '1em', textAlign: 'center'}}>
                <NavLink to={"/"}>Go to home</NavLink>
            </div>
        </div>
    )
}

export default ErrorPage
