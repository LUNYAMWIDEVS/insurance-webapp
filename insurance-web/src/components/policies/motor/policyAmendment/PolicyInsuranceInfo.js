import { useQuery } from '@apollo/react-hooks';
import React, { memo, useMemo } from 'react';
import { Dropdown, Form, Input } from 'semantic-ui-react';
import { FETCH_INSURANCE_COMP } from '../../queries';

function PolicyInsuranceInfo({
  errors,
  search = '',
  insuranceClass,
  insuranceCompany,
  polOptions,
  polOptionsLoading,
}) {
  const { data, loading } = useQuery(FETCH_INSURANCE_COMP, {
    variables: { search },
  });

  const classOptions = useMemo(
    () =>
      polOptions
        ? Object.entries(
            polOptions?.motorPolicyOptions?.insurance_class_options
          ).map(([key, value]) => ({ key, text: value, value }))
        : [],
    [polOptions]
  );

  const companyOptions = useMemo(
    () =>
      data
        ? data.insuranceCompanies.items.map((company) => ({
            key: company.id,
            text: company.name,
            value: company.id,
          }))
        : [],
    [data]
  );

  if (loading) return null;
  return (
    <Form.Group widths="equal">
      <Form.Field
        required
        error={errors.errorPaths.includes('insuranceCompany')}
      >
        <label>Insurance Company</label>
        {insuranceCompany && !!companyOptions?.length && (
          <Dropdown
            fluid
            search
            selection
            required
            value={insuranceCompany.id} // or defaultValue if it should be editable
            // onChange={handleOnPremiumTypesChange}
            options={companyOptions}
          />
        )}
      </Form.Field>
      <Form.Field
        required
        error={errors.errorPaths.includes('transactionType')}
      >
        <label>Transaction Type</label>

        <Input fluid name="transactionType" value="Renewal" />
      </Form.Field>
      <Form.Field required error={errors.errorPaths.includes('insuranceClass')}>
        <label>Insurance class</label>
        {!polOptionsLoading && !!classOptions?.length && (
          <Dropdown
            fluid
            search
            selection
            required
            value={insuranceClass} // or defaultValue if it should be editable
            // onChange={handleOnPremiumTypesChange}
            options={classOptions}
          />
        )}
      </Form.Field>
    </Form.Group>
  );
}

export default memo(PolicyInsuranceInfo);
