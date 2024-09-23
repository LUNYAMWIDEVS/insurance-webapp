import React from 'react';
import {
    Dropdown
} from 'semantic-ui-react';

export default function Agents({ handleOnAgentChange, agents: data,
    selected, multiple = false, placeholder = 'assign this conversation to an agent from the dropdown' }) {


    let allAgents = []

    data.forEach(agent => {

        allAgents.push({
            key: agent.id,
            text: agent.firstName + " " + agent.lastName,
            value: agent.id
        })
    })
    return (
        <div>
            {allAgents && <Dropdown
                placeholder={placeholder}
                fluid
                search
                clearable
                selection
                multiple={multiple}
                required
                defaultValue={selected}
                onChange={handleOnAgentChange}
                options={allAgents}
            />}
        </div>

    )
}

