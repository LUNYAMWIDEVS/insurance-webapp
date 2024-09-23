import React from 'react';
import {
    Dropdown
} from 'semantic-ui-react';

export default function PremiumTypes({ handleOnPremiumTypesChange, premiumTypes: data, placeholder, id: componentKey, selected, disabled, handleOnPremiumTypesSearch }) {

    let premiumTypes = []
    if (data) {
        for (const [key, value] of Object.entries(data)) {
            premiumTypes.push({
                key: key,
                text: value,
                value: componentKey ? key + "_" + componentKey : key
            })
        }
    }
    let selected_ = componentKey ? selected + "_" + componentKey : selected
    return (
        <div>
            {premiumTypes && <Dropdown
                placeholder={placeholder ? placeholder : 'Select Premium Type'}
                fluid
                clearable
                search
                selection
                required
                disabled={disabled ? disabled : false}
                defaultValue={selected_}
                // Modified on change handler to return the selected value and the premiumtypes for a lookup on the filter policy feature
                onChange={(e, { value }) => handleOnPremiumTypesChange(e, { value, premiumTypes })}
                onSearchChange={handleOnPremiumTypesSearch}
                options={premiumTypes}
            />}
        </div>

    )
}
