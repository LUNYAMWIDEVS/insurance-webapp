import React from 'react';
import {
    Dropdown
} from 'semantic-ui-react';

export default function Clients({ handleOnClientSearch, handleOnClientChange, clients: data, selected, multiple = false }) {


    let allClients = []
    data.forEach(client => {

        allClients.push({
            key: client.id,
            text: client.name,
            value: client.id
        })
    })
    return (
        <div>
            {allClients && <Dropdown
                placeholder='Select Client'
                fluid
                search
                clearable
                selection
                required
                multiple={multiple}
                defaultValue={selected}
                onChange={handleOnClientChange}
                onSearchChange={handleOnClientSearch}
                options={allClients}
            />}
        </div>

    )
}

