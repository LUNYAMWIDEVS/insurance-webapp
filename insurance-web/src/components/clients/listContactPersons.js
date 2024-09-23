import React from 'react';
import {
    Dropdown
} from 'semantic-ui-react';

export default function Contacts({ handleOnClientSearch, handleOnClientChange, clients: data,
    selected, multiple = false, placeholder = 'Select Contact Person' }) {


    let allClients = []
    data.forEach(client => {

        allClients.push({
            key: client.id,
            text: client.name + " [" + client.email + "]",
            value: client.id
        })
    })
    return (
        <div>
            {allClients && <Dropdown
                placeholder={placeholder}
                fluid
                search
                clearable
                selection
                multiple={multiple}
                required
                defaultValue={selected}
                onChange={handleOnClientChange}
                onSearchChange={handleOnClientSearch}
                options={allClients}
            />}
        </div>

    )
}

