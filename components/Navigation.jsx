import React, {useEffect, useRef, useState} from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

import * as Pusher from 'pusher-js';
import { Replicache } from 'replicache';

import { useSwipeable } from "react-swipeable";

import Avatar from './Avatar'


export default function Navigation(props) {
  const [avatar_url, setAvatarUrl] = useState(null)

  function handleClick(){
    return null
  }

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Fruit Camera</Navbar.Brand>
        <p>{avatar_url}</p>

        <Avatar
          url={avatar_url}
          size={100}
          onUpload={(url) => {
            setAvatarUrl(url)
            // updateProfile({ username, website, avatar_url: url })
          }}
        />

        {props.children}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
        {/*
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#link">Link</Nav.Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown>
        */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const PinList = ( {pins} ) => {
  return pins.map(([k, v]) => {
    return (
      <div key={k}>
        <b>{v.from}: </b>
        {v.content}
      </div>
    );
  });

}
