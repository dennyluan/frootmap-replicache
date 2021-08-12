import React, {useEffect, useRef, useState} from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

import { useSwipeable } from "react-swipeable";
import {supabase} from '../utils/supabase.js';

export default function Navigation(props) {

  function handleClick(){
    return null
  }

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Fruit Camera</Navbar.Brand>
        {/*{props.children}*/}

        {props.debug &&
          <Version rep={props.rep}/>
        }

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">

          <Nav.Link href="#home">Sign Up</Nav.Link>
     {/*
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown>*/}

        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const Version = (props) => {

  const [version, setVersion] = useState("0")
  const [clientVersion, setClientVersion] = useState("")
  const [clientID, setClientID] = useState("")
  const isMounted = useRef(true)

  useEffect(() => {
    async function getVersion() {
      // 1. get the "select currval('vesion')"
      // 2. set a lock
      // later. release the lock when the push is registered?

      // alt strategy: try 2! sequence columns
        // version and lock_version

      try {
        await supabase
          .from('version')
          .select('last_value')
          .then(resp => {
            setVersion(resp.body[0].last_value)
          })
      } catch (err) {
        console.error(err)
      }
    }

    async function getClientID(rep){
      if (rep != undefined) {
        const id = await rep.clientID
        setClientID(id)
      }
    }

    getVersion();
    getClientID(props.rep)

    return () => {
      isMounted.current = false;
    };
  }, [])

  useEffect(()=>{
    async function getVersion() {
      // 1. get the "select currval('vesion')"
      // 2. set a lock
      // later. release the lock when the push is registered?

      // alt strategy: try 2! sequence columns
        // version and lock_version

      try {
        await supabase
          .from('version')
          .select('last_value')
          .then(resp => {
            setVersion(resp.body[0].last_value)
          })
      } catch (err) {
        console.error(err)
      }
    }

    async function getClientID(rep){
      if (rep != undefined) {
        const id = await rep.clientID
        setClientID(id)
      }
    }

    getVersion();
    getClientID(props.rep)

  }, [props])

  useEffect(()=>{
    const getClientVersion = async () => {
      try {
        await supabase
          .from('replicache_client')
          .select('last_mutation_id')
          .match({id: clientID})
          .then(resp => {
            const val = resp.body[0].last_mutation_id
            setClientVersion(val)
          })
      } catch (err) {
        console.error(err)
      }
    }

    if (clientID) {
      getClientVersion()
    }
  }, [clientID])

  return (
    <ul className="breadcrumb text-start">
      <p className="breadcrumb-item muted">Debug</p>
      <li className="breadcrumb-item">ID: {clientID}</li>
      <li className="breadcrumb-item">Global Version: {version}</li>
      <li className="breadcrumb-item">Client Version: {clientVersion}</li>
    </ul>
  )
}