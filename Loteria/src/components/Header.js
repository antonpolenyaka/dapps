import React from 'react'
import { Menu, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default () => {
    return (
        <Menu stackable style={{ marginTop: '50px' }}>
            <Button color='blue' as={Link} to='/'>
                Gestión de tokens ERC-20
            </Button>

            <Button color='green' as={Link} to='/loteria'>
                Gestión de boletos
            </Button>

            <Button color='orange' as={Link} to='/premios'>
                Premios de loteria
            </Button>

            <Button color='linkedin' href='https://www.linkedin.com/in/antonpolenyaka/'>
                <Icon name='linkedin' /> LinkedIn
            </Button>

            <Button color='instagram' href='https://instagram.com'>
                <Icon name='instagram' /> Instagram
            </Button>

            <Button color='facebook' href='https://facebook.com'>
                <Icon name='facebook' /> Facebook
            </Button>
        </Menu>
    );
}