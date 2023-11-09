import React from 'react';
import add_button from '../../assets/add_button.svg';
import './AddButton.css';

export default function AddButton(props) {
  const { handleModalChange } = props;
  return (
    <div onClick={handleModalChange}>
      <img src={add_button} alt='add btn' className='add-btn-wrapper' />
    </div>
  )
}
