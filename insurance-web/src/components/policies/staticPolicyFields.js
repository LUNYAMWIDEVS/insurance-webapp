import React from "react";
import { Input, Form } from "semantic-ui-react";

export function columnCount(fieldSet) {
  let columnCount = 0;

  if (typeof(fieldSet) === "object") {
    columnCount =
      fieldSet instanceof Array
        ? Math.ceil(fieldSet.length / 3)
        : Math.ceil(Object.keys(fieldSet).length / 3);
  }

  return columnCount;
}


export default function StaticPolicyFields({
  detailSet,
  handleOnPolicyFieldSetChange,
}) {
  return (
    <div className="ui equal width grid">
      <div className=" column">
        {detailSet.slice(0, columnCount(detailSet)).map((set) => (
          <div key={set.id} className="ui ">
            <Form.Field>
              <label>{set.field}</label>
              <Input
                fluid
                placeholder={set.field}
                name="value"
                id={set.id}
                onChange={handleOnPolicyFieldSetChange}
              />
            </Form.Field>
            &nbsp; &nbsp;
          </div>
        ))}
      </div>
      <div className=" column">
        {detailSet
          .slice(
            columnCount(detailSet),
            columnCount(detailSet) * 2
          )
          .map((set) => (
            <div key={set.id} className="ui ">
              <Form.Field>
                <label>{set.field}</label>
                <Input
                  fluid
                  placeholder={set.field}
                  name="value"
                  id={set.id}
                  onChange={handleOnPolicyFieldSetChange}
                />
              </Form.Field>
              &nbsp; &nbsp;
            </div>
          ))}
      </div>
      <div className=" column">
        {detailSet
          .slice(columnCount(detailSet) * 2, detailSet.length)
          .map((set) => (
            <div key={set.id} className="ui ">
              <Form.Field>
                <label>{set.field}</label>
                <Input
                  fluid
                  placeholder={set.field}
                  name="value"
                  id={set.id}
                  onChange={handleOnPolicyFieldSetChange}
                />
              </Form.Field>
              &nbsp; &nbsp;
            </div>
          ))}
      </div>
    </div>
  );
}
