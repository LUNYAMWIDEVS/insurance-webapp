import React from 'react';
import {
    Dropdown
} from 'semantic-ui-react';

export default function PaymentOptions({handleOnReceiptOptionsChange, receiptOptionsList: data, selected }) {


    let receiptOptions = []
    if (data){
    for (const [key, value] of Object.entries(data)) {
        receiptOptions.push({
            key: key,
            text: value,
            value: key
        })
    }}
    return (
        <div>
            {receiptOptions && <Dropdown
                placeholder='Select Payment Mode'
                fluid
                search
                clearable
                selection
                defaultValue={selected}
                onChange={handleOnReceiptOptionsChange}
                options={receiptOptions}
            />}
        </div>

    )
}
