import React from 'react';
import {
    Dropdown
} from 'semantic-ui-react';

export default function StatusTypes({handleOnStatusTypesChange, statusTypes: data, selected }) {


    let statusTypes = []
    if (data){
    for (const [key, value] of Object.entries(data)) {
        statusTypes.push({
            key: key,
            text: value,
            value: key
        })
      }}
    return (
        <div>
            {statusTypes && <Dropdown
                placeholder='Select Client Status'
                fluid
                clearable
                search
                defaultValue={selected}
                selection
                onChange={handleOnStatusTypesChange}
                options={statusTypes}
            />}
        </div>

    )
}
