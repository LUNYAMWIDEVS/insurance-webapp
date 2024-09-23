import React from 'react';
import {
    Dropdown
} from 'semantic-ui-react';

export default function InsuranceCompanies({handleOnInsuranceCompChange, insuranceCompanies: data, selected, handleOnInsuranceCompanySearch, loading }) {


    let allInsuranceComps = []
    data.forEach(company => {

        allInsuranceComps.push({
            key: company.id,
            text: company.name,
            value: company.id
        })
    })
    return (
        <div>
            {allInsuranceComps && <Dropdown
                placeholder='Select Insurance Company'
                fluid
                search
                clearable
                selection
                defaultValue={selected}
                onChange={handleOnInsuranceCompChange}
                onSearchChange={handleOnInsuranceCompanySearch}
                options={allInsuranceComps}
                loading={loading}
            />}
        </div>

    )
}
