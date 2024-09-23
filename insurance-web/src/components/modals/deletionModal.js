import React from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

export default function DeleteModal({handleRemovalItem}) {
    const [open, setOpen] = React.useState(false)

    return (
        <Modal
            basic
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size='small'
            trigger={<Button floated='right'>
                <Icon name='trash alternate' />
                Delete</Button>}
        >
            <Header icon>
                <Icon name='archive' />
        Delete Item
        </Header>
            <Modal.Content>
                <p>
                    Are you sure that you want to delete the item selected?
                    Please confirm, then proceed to delete the object.
                </p>
            </Modal.Content>
            <Modal.Actions>
                <Button basic color='red' inverted onClick={() => setOpen(false)}>
                    <Icon name='remove' /> No
        </Button>
                <Button color='green' inverted onClick={handleRemovalItem}>
                    <Icon name='checkmark' /> Yes
        </Button>
            </Modal.Actions>
        </Modal>
    )
}
