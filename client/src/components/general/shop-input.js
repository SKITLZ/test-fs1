import React from 'react';

const ShopInput = ({ label, required, name, placeholder, value, inputHandler }) => {
  const requiredElem = required ? <span className="text-danger">*</span> : null;
  
  return (
    <label className="form-group w-100">
      { label } { requiredElem }
      <input
        className="form-control"
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={inputHandler}
        required={required} />
    </label>
  )
};

export default ShopInput;