import React, { useState } from 'react';


export default function DropdownOnComponent() {
    const data = [{id: 0, label: "On"}, {id: 1, label: "Off"}];
const [isOpen, setOpen] = useState(false);
  const [items] = useState(data);
  const [selectedItem, setSelectedItem] = useState(null);
  const toggleDropdown = () => setOpen(!isOpen);
  const handleItemClick = (id) => {
    selectedItem == id ? setSelectedItem(null) : setSelectedItem(id);
  }

return(               
<div className='dropdown wdthdrpdwn'>

<div className='dropdown-head' onClick={toggleDropdown}>


  {selectedItem ? items.find(item => item.id == selectedItem).label : "On"}
  <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}></i>
</div>
<div className={`dropdown-body ${isOpen && 'open'}`}>
  {items.map(item => (
    <div key={item.id} className="dropdown-item" onClick={e => handleItemClick(e.target.id)} id={item.id}>
      
      {item.label}
    </div>
  ))}
  
  
  
</div>
</div>
          )
        }