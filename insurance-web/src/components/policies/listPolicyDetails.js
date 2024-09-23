import React from 'react';
import {
    Dropdown
} from 'semantic-ui-react';

export default function FieldsDropdown({handleOnFieldsChange, fieldDetails: data, selected }) {


    let allFields = []
    
    data.forEach(field => {

        allFields.push({
            key: field.id,
            text: field.field,
            value: field.id
        })

    })
    return (
        <div>
            {allFields && <Dropdown
                placeholder='Select Correct Field'
                fluid
                search
                clearable
                selection
                defaultValue={selected}
                onChange={handleOnFieldsChange}
                options={allFields}
            />}
        </div>

    )
}
