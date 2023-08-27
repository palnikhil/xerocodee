import React from 'react';

const TableComponent = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr>
            <td>{item}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;