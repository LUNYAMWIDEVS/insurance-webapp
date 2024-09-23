import React, { useContext } from 'react';
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from './context/auth';

function ProtectedRoute({
    component: Component,
    ...rest
}) {
    const context = useContext(AuthContext);
    const isAuthenticated = context.useAuth()
    return (
        <Route
            {...rest}
            render={(props) => {
                if (isAuthenticated) {
                    return <Component props={rest} />;
                } else {
                    return (
                        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
                    );
                }
            }}
        />
    );
}

export default ProtectedRoute;