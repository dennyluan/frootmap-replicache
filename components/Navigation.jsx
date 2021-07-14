import React, {useEffect, useRef, useState} from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

import * as Pusher from 'pusher-js';
import { Replicache } from 'replicache';
import { useSubscribe } from 'replicache-react-util';

import { useSwipeable } from "react-swipeable";


export default function Navigation(props) {

  // let pins
  // const pins = useSubscribe(
  //   props.rep,
  //   async tx => {
  //     // Note: Replicache also supports secondary indexes, which can be used
  //     // with scan. See:
  //     // https://js.replicachedev/classes/replicache.html#createindex
  //     const list = await tx.scan({prefix: 'pin/'}).entries().toArray();
  //     list.sort(([, {order: a}], [, {order: b}]) => a - b);
  //     return list;
  //   },
  //   [],
  // );

  const pins = useSubscribe(
    props.rep,
    async tx => {
      const thepins = await tx.scan({prefix: 'pins/'}).entries().toArray();
      thepins.sort(([, {order: a}], [, {order: b}]) => a - b);
      return thepins;
    },
    [],
  );


  // console.log('header rep pins', pins)

  function handleClick(){
    return null
  }

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Fruit Camera</Navbar.Brand>

      {pins.map( (p) => {
        return <p>pin: {p.id}</p>
      })}

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
