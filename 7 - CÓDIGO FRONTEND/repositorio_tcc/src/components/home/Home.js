import React, { Component } from 'react'
import logo from './../../assets/images/Logo TCCFLOW.png';
import Navbar from '../navbar/Navbar';

export default class Home extends Component {
  render() {
    return (
      <>
        <Navbar />
        <div className='container-fluid d-flex flex-column justify-content-between' style={{minHeight: '100vh'}}>
          <div className='row justify-content-center' style={{marginTop: '25vh'}}>
            <div className='col-10 col-md-6 col-lg-3'>
              <img src={logo} className="img-fluid mb-3 me-2" alt="Logo da faculdade"></img>
            </div>
          </div> 
        </div>
      </>
    )
  }
}
