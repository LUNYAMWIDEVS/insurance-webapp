import React from 'react';
import {
    Dropdown
} from 'semantic-ui-react';

export default function TransactionTypes({ handleOnTransactionTypesChange, transactionTypes: data, selected }) {


    let transactionTypes = []
    if (data) {
        for (const [key, value] of Object.entries(data)) {
            transactionTypes.push({
                key: key,
                text: value,
                value: key
            })
        }
    }
    return (
        <div>
            {transactionTypes && <Dropdown
                placeholder='Select Transaction Type'
                fluid
                clearable
                search
                defaultValue={selected}
                selection
                onChange={handleOnTransactionTypesChange}
                options={transactionTypes}
            />}
        </div>

    )
}
